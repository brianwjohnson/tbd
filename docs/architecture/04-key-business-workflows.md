# 04 — Key Business Workflows

The three workflows below are selected because they have clear end-to-end implementations in the repository: map/geospatial drill-down, nonprofit/IRS scope aggregation, and payment-to-donation/AI-credit reconciliation. The repository also contains extensive governance and bookkeeping workflows; those are documented in the schema and RBAC documents and are not presented as a fourth “top” workflow here.

## Workflow 1 — Geospatial filtering and drill-down

```mermaid
sequenceDiagram
  autonumber
  actor U as User
  participant UI as Map UI
  participant API as /api/map/home or map child route
  participant DB as Supabase public schema/PostGIS
  participant G as Google Maps client

  U->>UI: Open map
  UI->>API: Request map level
  API->>DB: Load geometry data
  DB-->>API: GeoJSON rows
  API->>API: Batch and normalize
  API-->>UI: FeatureCollection
  UI->>G: Render map features
  U->>UI: Drill into entity
  UI->>API: Request child data
  API-->>UI: Child features
```

```mermaid
stateDiagram-v2
  [*] --> Loading
  Loading --> Ready: valid rows and geometry
  Loading --> Error: Query or payload error
  Ready --> Loading: drill-down or filter change
  Ready --> Cached: map home response cached
  Cached --> Loading: Refresh or expiry
  Error --> Loading: retry
```

Evidence and controls:

- `/api/map/home` is `force-static`, has `revalidate = 3600`, emits `s-maxage=3600` and `stale-while-revalidate=86400`, and logs request/step timings.
- It chooses simplified boundaries when both simplified and full geometry exist, chunks state IDs by 200, validates UUIDs, ignores malformed geometries, and returns GeoJSON FeatureCollections.
- Other entity geometry helpers use `cache: "no-store"` for interactive detail calls.
- Likely bottlenecks are geometry payload volume, Supabase round trips, client rendering and Google Maps script load. The code mitigates only the first two through simplification, batching and caching.
- Errors are logged with request IDs/timings in the home route and returned as HTTP 500 JSON; malformed geometry is skipped rather than crashing the response.

## Workflow 2 — District nonprofit scope, financial aggregation and detail drill-down

```mermaid
sequenceDiagram
  autonumber
  actor U as Superintendent or admin user
  participant UI as District / superintendent UI
  participant Scope as Scope API
  participant Summary as Scope summary service
  participant DB as public + irs schemas
  participant Detail as Nonprofit detail API

  U->>UI: Open district dashboard
  UI->>Scope: Load nonprofit scope
  Scope->>DB: Read scope view
  DB-->>Scope: Scope rows
  Scope-->>UI: Ordered rows
  UI->>Summary: Request summary
  Summary->>DB: Read IRS financials
  DB-->>Summary: Aggregation inputs
  Summary-->>UI: KPI summary
  U->>UI: Open nonprofit detail
  UI->>Detail: Request EIN detail
  Detail->>DB: Read IRS detail
  DB-->>Detail: Detail rows
  Detail-->>UI: Detail view
```

```mermaid
stateDiagram-v2
  [*] --> Candidate
  Candidate --> Active: scope update / activation
  Candidate --> Archived: archive
  Active --> Archived: archive
  Archived --> Active: Reactivate
  Active --> Detailed: user opens EIN detail
  Detailed --> Active: back to scope
```

Evidence and controls:

- Scope status values are `candidate`, `active`, `archived`; tiers are `registry_only`, `disclosure_grade`, `institutional` in the scope route types.
- The scope GET route uses `v_district_scope_nonprofits`; PATCH validates arrays, status/tier enums, and updates district+EIN pairs in parallel.
- IRS overview routes query `irs.entity_links`, `irs.organizations`, `irs.latest_returns`, `irs.latest_financials`, narratives, people and restrictions.
- The detail UI explicitly uses `cache: "no-store"`; this avoids stale onboarding/scope state but increases database load.
- Aggregation latency is dominated by cross-schema joins, latest-return views and payload size. The repository uses summary views/RPCs but does not show a distributed cache or materialized refresh scheduler.
- `safeRoute` maps thrown failures to JSON 500; client routes commonly surface non-OK responses to the UI.

## Workflow 3 — Entity donation/payment and AI-credit reconciliation

```mermaid
sequenceDiagram
  autonumber
  actor Donor as Donor
  participant UI as Donate UI
  participant API as Checkout route
  participant Stripe as Stripe Checkout
  participant Webhook as /api/stripe/webhook
  participant DB as Supabase service-role client
  participant Credit as AI credit RPC

  Donor->>UI: Enter donation
  UI->>API: Submit donation
  API->>API: Validate request
  API->>Stripe: Create checkout session
  Stripe-->>API: Session ID
  API-->>UI: Session ID
  UI->>Stripe: Redirect to Checkout
  Stripe-->>Webhook: Signed payment event
  Webhook->>Stripe: Verify event
  Webhook->>DB: Upsert payment records
  alt funding_purpose = ai_credits
    Webhook->>Credit: Grant AI credits
    Credit->>DB: Write idempotent ledger
  end
  DB-->>Webhook: Reconciliation result
  Webhook-->>Stripe: Success or retry
  UI->>API: Request receipt
  API-->>UI: Payment status
```

```mermaid
stateDiagram-v2
  [*] --> CheckoutCreated
  CheckoutCreated --> PaidEventReceived: Stripe webhook
  CheckoutCreated --> Abandoned: cancel/timeout outside app
  PaidEventReceived --> DonationUpserted: checkout.session.completed
  PaidEventReceived --> RecurringDonationUpserted: invoice.payment_succeeded
  DonationUpserted --> AiCreditsGranted: AI funding purpose
  DonationUpserted --> Complete: ordinary donation
  RecurringDonationUpserted --> Complete
  AiCreditsGranted --> Complete
  PaidEventReceived --> Failed: signature/reconciliation/provider error
  Failed --> PaidEventReceived: Stripe retry
```

Evidence and controls:

- Checkout routes use `STRIPE_SECRET_KEY`; the webhook uses `STRIPE_WEBHOOK_SECRET` and `SUPABASE_SERVICE_ROLE_KEY`.
- Webhook signature verification occurs before event processing.
- Donations upsert on `stripe_session_id`; invoice events update by `invoice_id`; subscriptions upsert on `stripe_subscription_id`.
- The AI credit RPC is idempotent on `(entity_id, source_type, source_id, direction)`, enforces positive amounts and active accounts, and writes ledger/usage records.
- Error handling returns 400 so Stripe can retry; database/provider failures are logged. Duplicate event safety is implemented for the main keys, but replay/partial-failure observability is not centralized in-repo.
- External Stripe latency and webhook retry timing are the main bottlenecks; the application does not block the checkout redirect on database reconciliation.

## Cross-workflow caching and failure posture

| Concern | Implemented behavior |
|---|---|
| Server/static caching | Map home uses static generation, `revalidate=3600`, and CDN cache headers |
| Client data caching | Small in-memory cached-resource helpers and React Query provider exist; many detail requests explicitly use `no-store` |
| Cache invalidation | Selected actions call `revalidatePath`; no central cache-invalidation bus is present |
| API errors | `safeRoute`, `jsonError`, `console.error`, request/timing logs in selected routes |
| External retries | IRS scripts include cache/backoff behavior; Stripe relies on webhook retry; browser fetch callers commonly retry manually or surface errors |

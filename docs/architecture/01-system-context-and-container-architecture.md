# 01 — System Context and Container Architecture

## Scope and evidence

This document describes the architecture evidenced by the current source tree, current Supabase migrations, `database.types.ts`, and the Next.js App Router. Archived migrations are treated as history, not as current runtime behavior. The repository identifies the product as pre-production in `README.md`.

Key evidence: `package.json`, `middleware.ts`, `utils/supabase/*`, `app/api/**`, `supabase/config.toml`, `supabase/migrations/**`, and the import scripts under `scripts/`.

## C4 system context

```mermaid
C4Context
  title Ante Up Nation — verified system context

  Person(publicUser, "Public visitor / donor", "Browses public entity, district, nonprofit and map views; may donate anonymously")
  Person(workspaceUser, "Authenticated workspace user", "Uses entity workspaces, governance, bookkeeping, people, documents and dashboards")
  Person(platformAdmin, "Platform administrator", "Uses /admin routes and nonprofit/business onboarding tools")
  System_Boundary(uta, "Ante Up Nation repository") {
    System(web, "Next.js application", "Next.js 16 App Router, React 19, TypeScript, Tailwind; pages, server components, client components and API routes")
  }
  System_Ext(supabase, "Supabase project", "Postgres schemas, Auth, Storage, Data API/RPC, RLS and local development stack")
  System_Ext(stripe, "Stripe", "Checkout, subscriptions, invoices, customers, payment webhooks and receipts")
  System_Ext(googleMaps, "Google Maps APIs", "Browser map rendering and geocoding script usage evidenced in the repository")
  System_Ext(irs, "IRS / public datasets", "IRS TEOS XML, Pub78/EOBMF-style registry data and Minnesota public education datasets")
  System_Ext(mail, "SMTP / email provider", "Nodemailer transport; production SMTP is configuration-dependent")
  System_Ext(deployGap, "Vercel / GCP deployment control plane", "No committed provider manifest or GitHub workflow found in this repository")

  Rel(publicUser, web, "HTTPS")
  Rel(workspaceUser, web, "HTTPS; Supabase session cookies")
  Rel(platformAdmin, web, "HTTPS; admin routes")
  Rel(web, supabase, "Server/client Supabase SDK; typed queries; RPCs")
  Rel(web, stripe, "Checkout session creation; webhook verification and reconciliation")
  Rel(web, googleMaps, "Maps JavaScript client; geocoding script uses Google endpoint")
  Rel(web, mail, "Server-side email delivery where configured")
  Rel(irs, web, "Import scripts download, parse and upsert data")
  Rel(irs, supabase, "Service-role ingestion scripts write IRS/public-data schemas")
  Rel(deployGap, web, "Target is not evidenced by repository configuration")
```

### Context interpretation

- Public and authenticated users enter through the same Next.js application. `middleware.ts` refreshes Supabase sessions and applies route-level admin/entity-admin redirects.
- Supabase is the system of record for the database, Auth, exposed schemas, RPCs, RLS and local Storage configuration. The app uses both the user-scoped server client and a service-role client in selected server/import paths.
- Stripe is a real integration: checkout routes create sessions and `/api/stripe/webhook` verifies signatures and upserts `donations`/`subscriptions`.
- Google Maps is a real client integration through `@react-google-maps/api`; Google geocoding is used by `scripts/geocode-nonprofit-addresses.ts`.
- IRS and Minnesota public-data ingestion are implemented as scripts, not as an in-request ETL service.
- No GCP SDK, Cloud Run/Functions manifest, Cloud Build file, Terraform/Pulumi module, `vercel.json`, or `.github/workflows/**` file was found. Vercel/GCP deployment is therefore an operational assumption or external configuration, not a repository-proven container.

## C4 container view

```mermaid
C4Container
  title Ante Up Nation — verified container view

  Person(user, "User", "Public, authenticated workspace, or platform administrator")
  System_Boundary(app, "Next.js application") {
    Container(pages, "App Router pages", "TSX", "Public pages, entity/district/nonprofit/business workspaces, admin pages, donate and auth screens")
    Container(api, "Route handlers", "TypeScript / NextRequest", "API surface under app/api: entities, map, districts, nonprofits, governance, bookkeeping, Stripe, admin and user routes")
    Container(auth, "Session and authorization layer", "Supabase SSR + middleware + RBAC helpers", "Cookie refresh, platform role checks, entity role checks, board membership checks and validated actions")
    Container(domain, "Domain services / DTOs", "TypeScript", "Entity, IRS, governance, bookkeeping, branding, map, services, admin and AI credit orchestration")
    Container(imports, "Data import utilities", "tsx scripts", "IRS XML/ZIP ingestion, MDE/state/district/geospatial imports, geocoding and seed/verification utilities")
  }
  System_Ext(db, "Supabase Postgres", "public, branding, governance, irs and business schemas; PostGIS/pg_trgm")
  System_Ext(storage, "Supabase Storage", "Configured local Storage; assets/documents reference buckets and paths")
  System_Ext(stripe, "Stripe", "Payments and billing")
  System_Ext(maps, "Google Maps / Geocoding", "Map client and geocoding")
  System_Ext(publicData, "IRS / Minnesota public data", "Downloadable source datasets")
  System_Ext(smtp, "SMTP", "Nodemailer mail transport when configured")

  Rel(user, pages, "Browses and interacts")
  Rel(pages, api, "fetch / form actions")
  Rel(pages, auth, "Supabase browser/session context")
  Rel(api, auth, "gets user and enforces route/entity/board authorization")
  Rel(api, domain, "calls domain DTOs and server services")
  Rel(domain, db, "typed Supabase queries and RPCs")
  Rel(api, db, "server client or service-role client for selected public/webhook paths")
  Rel(api, storage, "asset upload URLs and document/file references")
  Rel(api, stripe, "creates sessions; webhook receives events")
  Rel(pages, maps, "renders maps")
  Rel(imports, publicData, "downloads source files")
  Rel(imports, db, "service-role upserts and RPC calls")
  Rel(api, smtp, "sends emails/invoices when configured")
```

## Technology stack decision matrix

| Layer | Repository evidence | Why this choice fits the implemented system | Scalability / cost boundary visible in code |
|---|---|---|---|
| Web runtime | Next.js 16, React 19, App Router, server/client components | One codebase supports public pages, authenticated workspaces and API route handlers | Server work is request-bound; large imports are kept out of request paths and run as scripts |
| Language and contract | TypeScript 5.8, generated `database.types.ts`, domain DTOs | Strong compile-time contracts across route handlers, Supabase queries and UI | Generated types must be regenerated after migrations; stale types are a release risk |
| Styling/UI | Tailwind CSS, Radix slot, AG Grid, Framer Motion | Reusable responsive UI, data-heavy admin tables and interactive map/workspace components | Browser bundle and grid/map payload sizes are practical limits; map data is chunked and cached |
| Data platform | Supabase Postgres 15, exposed schemas, RLS, RPCs | Relational integrity, tenant-aware policies, typed Data API access, database-side lifecycle rules | `supabase.config.toml` caps Data API responses at 1,000 rows; query/index design matters as data grows |
| Geospatial | PostGIS extension, GeoJSON, Turf/D3 geo, Google Maps | Stores geometry in Postgres while rendering/drilling into map features in the browser | Geometry payload size is a bottleneck; `/api/map/home` chunks IDs and uses simplified boundaries plus HTTP caching |
| Authentication | Supabase Auth + `@supabase/ssr` cookies | Session refresh works across middleware, server components and route handlers | Token/session settings are in Supabase config; MFA is present only as disabled local configuration |
| File storage | Supabase Storage references and bucket/path columns | Assets and IRS documents use stable bucket/path metadata | Local config sets a 50 MiB file limit; remote bucket policy is outside this repository |
| Payments | Stripe SDK and client checkout | Stripe owns payment collection; webhook is the source of payment reconciliation events | Webhook idempotency relies on `stripe_session_id`/invoice upserts; retries and provider latency remain external |
| Public-data ingestion | `tsx` scripts, local caches under `data/`, service-role Supabase client | Handles large IRS XML/ZIP files and public datasets without blocking web requests | Disk/cache retention, IRS availability, parse variation and service-role blast radius are operational boundaries |
| Email | Nodemailer | Supports invite, invoice and contact delivery without coupling domain code to one vendor | Delivery depends on SMTP configuration; local Supabase email is captured by Inbucket |
| AI governance primitives | AI account, credit ledger, usage events, agent runs and safety policy JSONB | Establishes budget, usage and audit records for entity-scoped AI capabilities | Current repository proves accounting/control tables and governance RPCs; it does not prove a specific external model provider |
| Delivery infrastructure | `package.json` scripts and local Supabase config | Reproducible local development and migration reset workflows | No committed Vercel/GCP manifest or CI workflow; promotion, secrets and rollback are not codified here |

## Architecture boundaries and risks

1. The service-role client is intentionally used for Stripe webhooks, map home aggregation and import scripts. Those paths must remain server-only and must not accept arbitrary tenant writes without explicit validation.
2. Several public-facing views use `Cache-Control`, `revalidate`, or `no-store`; this is deliberate but not centrally standardized.
3. The repository has local Supabase configuration, but hosted Supabase, Vercel, GCP, DNS, observability and secret-rotation settings are external to source control.

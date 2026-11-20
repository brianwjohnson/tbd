import Link from "next/link";
import { getPublicServiceProviders } from "@/domain/services/services-dto";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Services",
  description: "Services offered by members of the community.",
};

export default async function ServicesPage() {
  const supabase = await createClient();
  const providers = await getPublicServiceProviders(supabase);

  return (
    <main className="min-h-screen bg-[#eef0f5] px-4 py-10 text-[#0f172a] md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl bg-white px-6 py-8 shadow-sm md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#64748b]">Community services</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Find a local service provider</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#64748b]">
            Browse services offered directly by people in the community.
          </p>
        </div>

        {providers.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#cbd5e1] bg-white px-6 py-12 text-center">
            <h2 className="text-xl font-semibold">No published services yet</h2>
            <p className="mt-2 text-[#64748b]">Check back soon for community providers.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
              <Link
                key={provider.id}
                href={`/services/${provider.id}`}
                className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748b]">Service provider</p>
                <h2 className="mt-3 text-2xl font-semibold">{provider.display_name}</h2>
                {provider.bio && <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#64748b]">{provider.bio}</p>}
                <div className="mt-5 space-y-2">
                  {provider.offerings.map((offering) => (
                    <div key={offering.id} className="flex items-center justify-between rounded-xl bg-[#f8fafc] px-3 py-2 text-sm">
                      <span>{offering.name}</span>
                      {offering.price && <span className="font-semibold">{formatPrice(offering.price.amount_cents, offering.price.currency_code)}</span>}
                    </div>
                  ))}
                </div>
                <span className="mt-5 inline-block text-sm font-semibold text-[#2563eb]">View provider →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function formatPrice(amountCents: number, currencyCode: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode }).format(amountCents / 100);
}

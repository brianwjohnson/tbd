"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import EntityDirectoryGrid from "@/app/components/entities/directory/EntityDirectoryGrid";
import type { PublicServiceProvider } from "@/domain/services/services-dto";

type ExploreTab = "directory" | "services";

export default function ExploreTabs({
  providers,
}: {
  providers: PublicServiceProvider[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab: ExploreTab =
    searchParams.get("tab") === "services" ? "services" : "directory";

  const tabHref = (tab: ExploreTab) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "directory") params.delete("tab");
    else params.set("tab", tab);
    const query = params.toString();
    return `${pathname}${query ? `?${query}` : ""}`;
  };

  return (
    <div className="min-h-screen bg-[#eef0f5] px-4 py-8 text-[#0f172a] md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-white px-6 py-8 shadow-sm md:px-10 md:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#64748b]">
            Community directory
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Explore your community
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#64748b]">
            Search local districts, businesses, nonprofits, and services from one shared directory.
          </p>

          <nav aria-label="Explore sections" className="mt-8 flex flex-wrap gap-2">
            <Link
              href={tabHref("directory")}
              className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                activeTab === "directory"
                  ? "border-[#d6422b] bg-[#d6422b] text-white"
                  : "border-[#d7dce5] bg-white text-[#334155] hover:border-[#d6422b] hover:text-[#d6422b]"
              }`}
              aria-current={activeTab === "directory" ? "page" : undefined}
            >
              Organizations & districts
            </Link>
            <Link
              href={tabHref("services")}
              className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                activeTab === "services"
                  ? "border-[#d6422b] bg-[#d6422b] text-white"
                  : "border-[#d7dce5] bg-white text-[#334155] hover:border-[#d6422b] hover:text-[#d6422b]"
              }`}
              aria-current={activeTab === "services" ? "page" : undefined}
            >
              Community services
            </Link>
          </nav>
        </div>

        {activeTab === "services" ? (
          <ServicesDirectory providers={providers} />
        ) : (
          <EntityDirectoryGrid allowTypeSwitch basePath="/explore" />
        )}
      </div>
    </div>
  );
}

function ServicesDirectory({
  providers,
}: {
  providers: PublicServiceProvider[];
}) {
  return (
    <section className="mt-6">
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
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748b]">
                Service provider
              </p>
              <h2 className="mt-3 text-2xl font-semibold">{provider.display_name}</h2>
              {provider.bio && (
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#64748b]">
                  {provider.bio}
                </p>
              )}
              <div className="mt-5 space-y-2">
                {provider.offerings.map((offering) => (
                  <div
                    key={offering.id}
                    className="flex items-center justify-between rounded-xl bg-[#f8fafc] px-3 py-2 text-sm"
                  >
                    <span>{offering.name}</span>
                    {offering.price && (
                      <span className="font-semibold">
                        {formatPrice(offering.price.amount_cents, offering.price.currency_code)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <span className="mt-5 inline-block text-sm font-semibold text-[#2563eb]">
                View provider →
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function formatPrice(amountCents: number, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amountCents / 100);
}

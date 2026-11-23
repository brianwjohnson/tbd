"use client";

import { useUser } from "@/app/hooks/useUser";
import AccordionCard from "@/app/components/user/AccordionCard";
import Link from "next/link";
import { EntityUser } from "@/app/lib/types/types";

export default function MyBusinesses() {
  const { user } = useUser();

  const businesses = (user?.entity_users ?? []).filter(
    (eu) => eu.entity_type === "business",
  ) as EntityUser[];

  if (businesses.length === 0) {
    return (
      <AccordionCard title="My Businesses">
        <p className="text-sm leading-6 text-[#64748b]">
          No businesses are currently tied to this account.
        </p>
      </AccordionCard>
    );
  }

  return (
    <AccordionCard title="My Businesses">
      <div className="space-y-2">
        {businesses.map((b) => {
          const name = b.entity_name ?? b.entity_id;
          const businessId = b.entity_id;
          return (
            <div
              key={`${b.entity_id}-${b.role}`}
              className="rounded-2xl border border-[#d7dce5] bg-[#f8fafc] px-4 py-3"
            >
              {businessId ? (
                <Link
                  href={`/businesses/${businessId}`}
                  className="text-sm font-semibold text-[#0f172a] hover:text-[#1d4ed8] hover:underline"
                >
                  {name}
                </Link>
              ) : (
                <div className="text-sm font-semibold text-[#0f172a]">{name}</div>
              )}
              <div className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-[#64748b]">
                Role: {b.role}
              </div>
            </div>
          );
        })}
      </div>
    </AccordionCard>
  );
}

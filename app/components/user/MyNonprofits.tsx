"use client";

import { useUser } from "@/app/hooks/useUser";
import AccordionCard from "@/app/components/user/AccordionCard";
import Link from "next/link";
import { EntityUser } from "@/app/lib/types/types";

export default function MyNonprofits() {
  const { user } = useUser();

  const nonprofits = (user?.entity_users ?? []).filter(
    (eu) => eu.entity_type === "nonprofit",
  ) as EntityUser[];

  if (nonprofits.length === 0) {
    return (
      <AccordionCard title="My Nonprofits">
        <p className="text-sm leading-6 text-[#64748b]">
          No nonprofits are currently tied to this account.
        </p>
      </AccordionCard>
    );
  }

  return (
    <AccordionCard title="My Nonprofits">
      <div className="space-y-2">
        {nonprofits.map((n) => {
          const name = n.entity_name ?? n.entity_id;
          const nonprofitId = n.entity_id;
          return (
            <div
              key={`${n.entity_id}-${n.role}`}
              className="rounded-2xl border border-[#d7dce5] bg-[#f8fafc] px-4 py-3"
            >
              {nonprofitId ? (
                <Link
                  href={`/nonprofits/${nonprofitId}`}
                  className="text-sm font-semibold text-[#0f172a] hover:text-[#1d4ed8] hover:underline"
                >
                  {name}
                </Link>
              ) : (
                <div className="text-sm font-semibold text-[#0f172a]">
                  {name}
                </div>
              )}
              <div className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-[#64748b]">
                Role: {n.role}
              </div>
            </div>
          );
        })}
      </div>
    </AccordionCard>
  );
}

"use client";

import { useUser } from "@/app/hooks/useUser";
import AccordionCard from "@/app/components/user/AccordionCard";
import Link from "next/link";
import { EntityUser } from "@/app/lib/types/types";

export default function MyDistricts() {
  const { user } = useUser();

  const districts = (user?.entity_users ?? []).filter(
    (eu) => eu.entity_type === "district",
  ) as EntityUser[];

  if (districts.length === 0) {
    return (
      <AccordionCard title="My Districts">
        <p className="text-sm leading-6 text-[#64748b]">
          No districts are currently tied to this account.
        </p>
      </AccordionCard>
    );
  }

  return (
    <AccordionCard title="My Districts">
      <div className="space-y-2">
        {districts.map((d) => {
          const shortname = d.entity_name ?? d.entity_id;
          const districtId = d.entity_id;
          return (
            <div
              key={`${d.entity_id}-${d.role}`}
              className="rounded-2xl border border-[#d7dce5] bg-[#f8fafc] px-4 py-3"
            >
              {districtId ? (
                <Link
                  href={`/districts/${districtId}`}
                  className="text-sm font-semibold text-[#0f172a] hover:text-[#1d4ed8] hover:underline"
                >
                  {shortname}
                </Link>
              ) : (
                <div className="text-sm font-semibold text-[#0f172a]">
                  {shortname}
                </div>
              )}
              <div className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-[#64748b]">
                Role: {d.role}
              </div>
            </div>
          );
        })}
      </div>
    </AccordionCard>
  );
}

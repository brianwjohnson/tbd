"use client";
import { Profile } from "@/app/lib/types/types";
import MyProfile from "@/app/components/user/MyProfile";
import MyDistricts from "@/app/components/user/MyDistricts";
import MyBusinesses from "@/app/components/user/MyBusinesses";
import MyNonprofits from "@/app/components/user/MyNonprofits";
import MyServices from "@/app/components/user/MyServices";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function AccountForm({ user }: { user: Profile | null }) {
  return (
    <div className="mx-auto mt-8 w-full max-w-6xl px-4 pb-10">
      <section className="rounded-[28px] border border-white/70 bg-[rgba(255,255,255,0.82)] px-6 py-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur md:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#475569]">
          Account
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0f172a]">
          Manage your profile and memberships
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#475569]">
          Update the details tied to your account and review the businesses,
          nonprofits, and districts where you currently have access.
        </p>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="space-y-4">
          <MyProfile />
        </div>
        <div className="space-y-4">
          <MyServices />
          <MyBusinesses />
          <MyNonprofits />
          <MyDistricts />
        </div>
      </div>
    </div>
  );
}

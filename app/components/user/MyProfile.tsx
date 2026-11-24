"use client";

import Avatar from "@/app/components/ui/avatar";
import { useUser } from "@/app/hooks/useUser";
import React, { useEffect, useRef, useState } from "react";
import AccordionCard from "@/app/components/user/AccordionCard";

type ProfileUpdatePayload = {
  full_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  website?: string | null;
  avatar_url?: string | null;
};

type ProfileSaveState = "idle" | "saving" | "saved";

export default function MyProfile({
  defaultOpen = true,
}: {
  defaultOpen?: boolean;
}) {
  const { user, refreshUser } = useUser();
  const [saveState, setSaveState] = useState<ProfileSaveState>("idle");
  const savedStateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(defaultOpen);
  const [fullname, setFullname] = useState<string>(user?.full_name ?? "");
  const [firstName, setFirstName] = useState<string | null>(
    user?.first_name ?? ""
  );
  const [lastName, setLastName] = useState<string | null>(
    user?.last_name ?? ""
  );
  const [username, setUsername] = useState<string | null>(user?.username ?? "");
  const [website, setWebsite] = useState<string | null>(user?.website ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user?.avatar_url ?? ""
  );

  const initialValuesRef = useRef({
    full_name: user?.full_name ?? "",
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    username: user?.username ?? "",
    website: user?.website ?? "",
    avatar_url: user?.avatar_url ?? "",
  });

  useEffect(() => {
    const snapshot = {
      full_name: user?.full_name ?? "",
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      username: user?.username ?? "",
      website: user?.website ?? "",
      avatar_url: user?.avatar_url ?? "",
    };
    initialValuesRef.current = snapshot;
    setFullname(snapshot.full_name);
    setFirstName(snapshot.first_name);
    setLastName(snapshot.last_name);
    setUsername(snapshot.username);
    setWebsite(snapshot.website);
    setAvatarUrl(snapshot.avatar_url);
  }, [user]);

  useEffect(() => {
    return () => {
      if (savedStateTimerRef.current) {
        clearTimeout(savedStateTimerRef.current);
      }
    };
  }, []);

  const hasChanges = (() => {
    if (!user) return false;
    const initial = initialValuesRef.current;
    return (
      (fullname ?? "") !== initial.full_name ||
      (firstName ?? "") !== initial.first_name ||
      (lastName ?? "") !== initial.last_name ||
      (username ?? "") !== initial.username ||
      (website ?? "") !== initial.website
    );
  })();

  async function patchProfile(update: ProfileUpdatePayload) {
    const response = await fetch("/api/me/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(update),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Failed to update profile");
    }
  }

  function setSavedState() {
    if (savedStateTimerRef.current) {
      clearTimeout(savedStateTimerRef.current);
    }
    setSaveState("saved");
    savedStateTimerRef.current = setTimeout(() => {
      setSaveState("idle");
      savedStateTimerRef.current = null;
    }, 2000);
  }

  async function updateProfile({
    username,
    fullname,
    website,
    avatar_url,
    firstName,
    lastName,
  }: {
    username: string | null;
    fullname: string | null;
    website: string | null;
    avatar_url: string | null;
    firstName: string | null;
    lastName: string | null;
  }) {
    if (!user) return;
    try {
      if (savedStateTimerRef.current) {
        clearTimeout(savedStateTimerRef.current);
        savedStateTimerRef.current = null;
      }
      setSaveState("saving");
      await patchProfile({
        full_name: fullname,
        first_name: firstName,
        last_name: lastName,
        username,
        website,
        avatar_url,
      });

      initialValuesRef.current = {
        full_name: fullname ?? "",
        first_name: firstName ?? "",
        last_name: lastName ?? "",
        username: username ?? "",
        website: website ?? "",
        avatar_url: avatar_url ?? "",
      };
      await refreshUser();
      setSavedState();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : JSON.stringify(error);
      setSaveState("idle");
      alert("Error updating the data: " + message);
    }
  }

  async function updateAvatarUrl(url: string | null) {
    if (!user) return;
    try {
      if (savedStateTimerRef.current) {
        clearTimeout(savedStateTimerRef.current);
        savedStateTimerRef.current = null;
      }
      setSaveState("saving");
      await patchProfile({ avatar_url: url });
      initialValuesRef.current.avatar_url = url ?? "";
      await refreshUser();
      setSavedState();
    } catch (error: unknown) {
      console.error("Error updating avatar:", error);
      setSaveState("idle");
      alert("Error updating avatar");
    }
  }

  const profileButtonLabel =
    saveState === "saving"
      ? "Saving..."
      : "Update Profile";
  const showSavedState = saveState === "saved" && !hasChanges;
  const profileButtonDisabled = saveState === "saving" || !hasChanges;

  const inputClasses =
    "h-11 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 text-sm text-[#0f172a] shadow-sm transition placeholder:text-[#94a3b8] focus:border-[#2563eb] focus:outline-none focus:ring-4 focus:ring-[#bfdbfe]";
  const labelClasses =
    "m-0 flex flex-col gap-1.5 text-sm font-medium normal-case tracking-normal text-[#334155]";

  return (
    <AccordionCard title="My Profile" defaultOpen={open} onToggle={setOpen}>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[220px,1fr]">
        <div className="flex flex-col items-start gap-3">
          <Avatar
            uid={user?.id ?? null}
            url={avatarUrl}
            size={220}
            onUpload={(url) => {
              setAvatarUrl(url);
              updateAvatarUrl(url);
            }}
            secondaryAction={
              <button
                onClick={() =>
                  updateProfile({
                    username,
                    fullname,
                    website,
                    avatar_url: avatarUrl,
                    firstName,
                    lastName,
                  })
                }
                disabled={profileButtonDisabled}
                className={`relative inline-flex w-full min-w-[140px] items-center justify-center overflow-hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all duration-500 ease-in-out disabled:cursor-not-allowed disabled:bg-[#94a3b8] ${
                  showSavedState
                    ? "bg-emerald-600 hover:bg-emerald-600"
                    : "bg-[#0f172a] hover:bg-[#1e293b]"
                }`}
              >
                <span
                  className={`inline-flex items-center transition-all duration-500 ease-in-out ${
                    showSavedState
                      ? "-translate-y-2 opacity-0"
                      : "translate-y-0 opacity-100"
                  }`}
                >
                  {profileButtonLabel}
                </span>
                <span
                  aria-hidden={!showSavedState}
                  className={`absolute inset-0 inline-flex items-center justify-center gap-1.5 transition-all duration-500 ease-in-out ${
                    showSavedState
                      ? "translate-y-0 opacity-100"
                      : "translate-y-2 opacity-0"
                  }`}
                >
                  <span aria-hidden="true">✓</span>
                  Saved
                </span>
              </button>
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={`${labelClasses} sm:col-span-2`} htmlFor="fullName">
            <span>Full Name</span>
            <input
              id="fullName"
              type="text"
              className={inputClasses}
              value={fullname || ""}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="How your name should appear"
            />
          </label>

          <label className={labelClasses} htmlFor="firstName">
            <span>First Name</span>
            <input
              id="firstName"
              type="text"
              className={inputClasses}
              value={firstName || ""}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
            />
          </label>

          <label className={labelClasses} htmlFor="lastName">
            <span>Last Name</span>
            <input
              id="lastName"
              type="text"
              className={inputClasses}
              value={lastName || ""}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
            />
          </label>

          <label className={labelClasses} htmlFor="username">
            <span>Username</span>
            <input
              id="username"
              type="text"
              className={inputClasses}
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </label>

          <label className={labelClasses} htmlFor="website">
            <span>Website</span>
            <input
              id="website"
              type="url"
              className={inputClasses}
              value={website || ""}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.org"
            />
          </label>

          <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 sm:col-span-2">
            <p className="text-sm font-medium text-[#334155]">Profile photo</p>
            <p className="mt-1 text-sm leading-6 text-[#64748b]">
              Upload a square image for the clearest crop across navigation and
              account views.
            </p>
          </div>
        </div>
      </div>
    </AccordionCard>
  );
}

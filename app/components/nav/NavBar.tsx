"use client";

import React, { useEffect, useState } from "react";
import AUNLogo from "@/app/components/AUNLogo";
import Menus from "@/app/lib/menus";
import DesktopMenu from "@/app/components/DesktopMenu";
import { Menu } from "@/app/lib/types/types";
import MobMenu from "@/app/components/MobMenu";
import { useUser } from "@/app/hooks/useUser";
import { SmallAvatar } from "@/app/components/ui/avatar";
import { User as UserIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function NavBarComponent() {
  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    async function fetchMenus() {
      const result = await Menus();
      setMenus(result);
    }
    fetchMenus();
  }, []);

  const { user, logout, refreshUser } = useUser();
  const isLoggedIn = !!user;

  const filteredMenus = menus
    .filter((menu: Menu) => {
      return (
        !menu.authRequired ||
        (isLoggedIn &&
          (!menu.roles || menu.roles.includes(user?.global_role || "")))
      );
    })
    .map((menu) => ({
      ...menu,
      subMenu: (menu.subMenu || []).filter((item) => {
        if (item.authRequired && !isLoggedIn) return false;
        if (
          item.roles &&
          !item.roles.includes(user?.global_role || "")
        ) {
          return false;
        }
        return true;
      }),
    }));
  // .map((menu: Menu) => {
  //   if (menu.name === "Account" && user?.username) {
  //     return { ...menu, name: user.username };
  //   }
  //   return menu;
  // });

  return (
    <nav className="w-full bg-surface-nav text-brand-primary-1 border-b border-subtle">
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-6 h-16 flex items-center gap-4">
        {/* Left: Logo */}
        <div className="flex items-center justify-start shrink-0 gap-3">
          <AUNLogo />
        </div>

        {/* Center: Desktop Menu (truly centered between left & right) */}
        <div className="flex-1 hidden lg:flex justify-center">
          <ul className="flex items-center gap-x-7">
            {filteredMenus.map((menu: Menu) => (
              <DesktopMenu
                menu={JSON.stringify(menu)}
                user={user}
                key={menu.name}
              />
            ))}
          </ul>
        </div>

        {/* Right: Profile / Mobile */}
        <div className="flex items-center justify-end gap-x-2 sm:gap-x-3 shrink-0 ml-auto">
          <UserPopover user={user} logout={logout} refreshUser={refreshUser} />
          <div className="lg:hidden">
            <MobMenu Menus={filteredMenus} />
          </div>
        </div>
      </div>
    </nav>
  );
}

function UserPopover({
  user,
  logout,
  refreshUser,
}: {
  user: ReturnType<typeof useUser>["user"];
  logout: () => void;
  refreshUser: () => Promise<void>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const label = user?.full_name ?? user?.username ?? "Account";

  const handleSignOut = async () => {
    setOpen(false);
    await fetch("/auth/signout", { method: "POST" });
    logout();
    await refreshUser();
    router.refresh();
    router.push("/auth/sign-in");
  };

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const popoverRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        open &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const menuItemClass =
    "flex items-center gap-2 px-3 py-2 text-base hover:bg-brand-secondary-0";

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full px-2 py-1 text-brand-primary-1 hover:bg-brand-secondary-0 transition-colors"
      >
        {user ? (
          <SmallAvatar name={label} url={user.avatar_url ?? null} size={30} />
        ) : (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-secondary-0">
            <UserIcon className="w-4 h-4 text-brand-primary-1" />
          </div>
        )}
        <span className="hidden sm:inline text-sm font-medium">{label}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-md border border-brand-secondary-0 bg-brand-secondary-1 text-brand-primary-1 shadow-xl z-50">
          <ul className="py-2 text-sm">
            {user ? (
              <>
                <li>
                  <a
                    href="/account"
                    className={menuItemClass}
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    className={`${menuItemClass} w-full text-left`}
                    onClick={handleSignOut}
                  >
                    Log out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <a
                  href="/auth/sign-in"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-brand-secondary-0"
                  onClick={() => setOpen(false)}
                >
                  Sign in
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

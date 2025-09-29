"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import Logo from "../ui/Logo";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAppDispatch } from "@/redux/hooks";
import { logOut } from "@/redux/features/auth/authSlice";
import { useLogoutUserMutation } from "@/redux/features/auth/authApi";

type TUser = {
  email?: string;
  name?: string;
  role?: "user" | "receptionist" | "admin";
} | null;

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<TUser>(null);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [logoutUser] = useLogoutUserMutation();

  useEffect(() => {
    setMounted(true);
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        setUser(null);
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser({});
    } finally {
      dispatch(logOut());
      router.push("/login");
      setIsOpen(false);
    }
  };

  const navLinks = useMemo(() => {
    const base = [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Services", path: "/services" },
      { name: "Contact", path: "/contact" },
      { name: "Medicine", path: "/medicine" },
      { name: "Cart", path: "/cart" },
    ];

    if (!user) {
      base.push({ name: "Sign up", path: "/register" });
    }

    if (user?.role === "user") {
      base.push({ name: "Dashboard", path: "/patient" });
    } else if (user?.role === "receptionist") {
      base.push({ name: "Dashboard", path: "/receptionist" });
    } else if (user?.role === "admin") {
      base.push({ name: "Dashboard", path: "/admin/dashboard" });
    }

    return base;
  }, [user]);

  const renderLink = ({ name, path }: (typeof navLinks)[number]) => {
    const isActive = pathname === path;
    return (
      <Link
        key={name}
        href={path}
        onClick={() => setIsOpen(false)}
        className={[
          "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
          isActive
            ? "bg-white text-violet-600 shadow-sm"
            : "text-slate-600 hover:text-violet-600",
        ].join(" ")}
      >
        {name}
      </Link>
    );
  };

  if (!mounted) {
    return (
      <header className="border-b border-white/30 bg-gradient-to-br from-white/95 via-white/85 to-violet-50/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-gradient-to-br from-white/95 via-white/85 to-violet-50/80 shadow-[0_10px_30px_-20px_rgba(79,70,229,0.45)] backdrop-blur">
      <div className="mx-auto flex h-20 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex items-center rounded-2xl border border-violet-200 bg-white/80 p-2 text-violet-600 shadow-sm transition hover:bg-white md:hidden"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <Link href="/" className="flex items-center gap-3">
            <Logo />
            <div className="hidden flex-col text-left text-xs font-medium text-slate-500 sm:flex">
              <span className="uppercase tracking-[0.4em] text-violet-500">
                HealthSync
              </span>
              <span className="tracking-[0.05em] text-slate-400">
                Hospital & Research Network
              </span>
            </div>
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {navLinks.map(renderLink)}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white p-0 shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt={user.name}
                      />
                      <AvatarFallback>
                        <UserIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end">
                  <DropdownMenuLabel>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/patient/billing">Billing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-full border-violet-200 px-4 text-sm font-semibold text-violet-600 hover:border-violet-300 hover:bg-white"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <Button
              asChild
              className="rounded-full bg-violet-600 px-5 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700"
            >
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile sheet */}
      {isOpen && (
        <div className="border-t border-white/30 bg-white/95 shadow-lg backdrop-blur md:hidden">
          <div className="flex flex-col gap-2 px-4 py-4">
            {navLinks.map(renderLink)}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

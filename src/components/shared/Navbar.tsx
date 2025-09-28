"use client";

import React, { useEffect, useState } from "react";
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

  const routes = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
    { name: "Medicine Store", path: "/medicine" },
    { name: "Cart", path: "/cart" },
  ];

  if (!user) {
    routes.push({ name: "Login", path: "/login" });
    routes.push({ name: "Signup", path: "/register" });
  }

  if (user?.role === "user") {
    routes.push({ name: "Dashboard", path: "/patient" });
  } else if (user?.role === "receptionist") {
    routes.push({ name: "Dashboard", path: "/receptionist" });
  } else if (user?.role === "admin") {
    routes.push({ name: "Dashboard", path: "/admin/dashboard" });
  }

  const renderLink = ({ name, path }: (typeof routes)[number]) => {
    const isActive = pathname === path;
    return (
      <Link
        key={name}
        href={path}
        onClick={() => setIsOpen(false)}
        className={[
          "px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "text-blue-600 dark:text-blue-400"
            : "text-slate-600 hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400",
        ].join(" ")}
      >
        {name}
      </Link>
    );
  };

  if (!mounted) {
    return (
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-11/12 items-center justify-between">
          <Logo />
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mx-auto flex h-16 w-11/12 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex items-center rounded-md border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-semibold text-slate-800 dark:text-white">
              HealthSync Hospital
            </span>
          </Link>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          {routes.map(renderLink)}
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
                      <AvatarImage src="https://github.com/shadcn.png" alt={user.name} />
                      <AvatarFallback>
                        <UserIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end">
                  <DropdownMenuLabel>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{user.name || "User"}</p>
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
                className="flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile sheet */}
      {isOpen && (
        <div className="border-t border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 md:hidden">
          <div className="flex flex-col gap-2 px-4 py-3">{routes.map(renderLink)}</div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

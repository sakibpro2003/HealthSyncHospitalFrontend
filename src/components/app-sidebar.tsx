"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Bot,
  GalleryVerticalEnd,
  SquareTerminal,
  Users,
  Settings,
  ClipboardList,
  // UserPlus,
  Pill,
  Home,
  // Heart,
  HeartPulse,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  url: string;
  icon?: any;
  isActive?: boolean;
  items?: { title: string; url: string }[];
};

const teams = [
  {
    name: "HealthSync Hospital",
    logo: GalleryVerticalEnd,
    plan: "Enterprise",
  },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<{
    email?: string;
    name?: string;
    role?: "receptionist" | "admin" | "user";
  } | null>(null);

  const [navItems, setNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUser(data.user);

        // Load sidebar menu based on role
        const role = data.user.role;
        switch (role) {
          case "receptionist":
            setNavItems([
              {
                title: "Patient",
                url: "#",
                icon: SquareTerminal,
                items: [
                  { title: "Register", url: "/receptionist/patient-register" },
                  { title: "Patients", url: "/receptionist/patients" },
                ],
              },
              {
                title: "Blood Donor",
                url: "#",
                icon: Bot,
                items: [
                  {
                    title: "Register Donor",
                    url: "/receptionist/register-donor",
                  },
                  { title: "View Donor", url: "/receptionist/donors" },
                ],
              },
              {
                title: "Blood Bank",
                url: "#",
                icon: Bot,
                items: [
                  { title: "View Blood Bank", url: "/receptionist/blood-bank" },
                ],
              },
            ]);
            break;
          case "admin":
            setNavItems([
              {
                title: "Medicines",
                url: "#",
                icon: Pill,
                items: [
                  {
                    title: "Add Medicine",
                    url: "/admin/create-new-medicine",
                  },
                  { title: "Manage Medicines", url: "/admin/manage-medicine" },
                ],
              },
              {
                title: "Users",
                url: "/admin/users",
                icon: Users,
              },
              {
                title: "Settings",
                url: "/admin/settings",
                icon: Settings,
              },
            ]);
            break;
          case "user":
            setNavItems([
              {
                title: "My Health Packages",
                url: "/patient",
                icon: HeartPulse,
                items: [
                  { title: "My Subscription", url: "/patient/my-subscription" },
                ],
              },
              {
                title: "Appointments",
                url: "/patient/appointments",
                icon: ClipboardList,
              },
            ]);
            break;
          default:
            setNavItems([]);
        }
      } catch (error) {
        console.error("Not logged in");
      }
    };

    fetchUser();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name || "Guest",
            email: user?.email || "unknown@example.com",
            avatar: "https://i.ibb.co/WNTsHZq2/9434621.png",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

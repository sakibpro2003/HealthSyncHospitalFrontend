/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  GalleryVerticalEnd,
  SquareTerminal,
  Users,
  ClipboardList,
  Pill,
  HeartPulse,
  Receipt,
  Droplet,
  BarChart3,
  Stethoscope,
  FileText,
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
import { useClientUser } from "@/hooks/useClientUser";

type NavItem = {
  title: string;
  url: string;
  icon?: any;
  isActive?: boolean;
  items?: { title: string; url: string; isActive?: boolean }[];
};

const teams = [
  {
    name: "HealthSync Hospital",
    logo: GalleryVerticalEnd,
    plan: "Enterprise",
  },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user } = useClientUser();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      setNavItems([]);
      return;
    }

    switch (user.role) {
      case "receptionist":
        setNavItems([
          {
            title: "Appointments",
            url: "/receptionist/appointments",
            icon: ClipboardList,
            items: [
              { title: "Book appointment", url: "/receptionist/appointments" },
              { title: "Doctor appointment list", url: "/receptionist/doctor-appointments" },
            ],
          },
          {
            title: "Patient",
            url: "#",
            icon: SquareTerminal,
            items: [
              { title: "Register", url: "/receptionist/patient-register" },
              { title: "Patients", url: "/receptionist/patients" },
            ],
          },
        ]);
        break;
      case "admin":
        setNavItems([
          {
            title: "Dashboard",
            url: "/admin/dashboard",
            icon: BarChart3,
          },
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
            title: "Doctors",
            url: "/admin/doctors",
            icon: Stethoscope,
            items: [
              {
                title: "Manage doctors",
                url: "/admin/doctors",
              },
            ],
          },
          {
            title: "Blood Bank",
            url: "#",
            icon: Droplet,
            items: [
              { title: "Inventory", url: "/admin/blood-bank" },
              { title: "Requests", url: "/admin/blood-requests" },
            ],
          },
          {
            title: "Users",
            url: "/admin/manage-user",
            icon: Users,
            items: [
              {
                title: "Manage Users",
                url: "/admin/manage-user",
              },
            ],
          },
         
        ]);
        break;
      case "doctor":
        setNavItems([
          {
            title: "Appointments",
            url: "/doctor/appointments",
            icon: ClipboardList,
            items: [
              {
                title: "Schedule overview",
                url: "/doctor/appointments",
              },
            ],
          },
        ]);
        break;
      case "user":
      case "patient":
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
            items: [{ title: "Appointment", url: "/patient/appointments" }],
          },
          {
            title: "Billing & Receipts",
            url: "/patient/billing",
            icon: Receipt,
            items: [
              { title: "Billing & Receipts", url: "/patient/billing" },
            ],
          },
          {
            title: "Prescriptions",
            url: "/patient/prescriptions",
            icon: FileText,
            items: [
              { title: "Prescriptions", url: "/patient/prescriptions" },
            ],
          },
          {
            title: "Blood Requests",
            url: "/patient/blood-requests",
            icon: Droplet,
            items: [
              {
                title: "Request Blood",
                url: "/patient/blood-requests",
              },
            ],
          },
        ]);
        break;
      default:
        setNavItems([]);
    }
  }, [user]);

  const enhancedNavItems = React.useMemo<NavItem[]>(() => {
    return navItems.map((item) => {
      const childItems = item.items?.map((subItem) => {
        const activeSub =
          pathname === subItem.url || pathname.startsWith(`${subItem.url}/`);
        return { ...subItem, isActive: activeSub };
      });

      const hasActiveChild = childItems?.some((child) => child.isActive);
      const isSelfActive =
        pathname === item.url || pathname.startsWith(`${item.url}/`);

      return {
        ...item,
        isActive: isSelfActive || hasActiveChild,
        items: childItems,
      };
    });
  }, [navItems, pathname]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={enhancedNavItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name || "Guest",
            email: user?.email || "unknown@example.com",
            avatar: "https://i.ibb.co/WNTsHZq2/9434621.png",
            role: user?.role,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

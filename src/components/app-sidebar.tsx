"use client";

import * as React from "react";
import {
  Bot,
  GalleryVerticalEnd,
  
  SquareTerminal,
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

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://i.ibb.co/WNTsHZq2/9434621.png",
  },
  teams: [
    {
      name: "HealthSync Hospital",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    }
  ],
  navMain: [
    {
      title: "Patient",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Register",
          url: "/receptionist/patient-register",
        },
        {
          title: "Patients",
          url: "/receptionist/patients",
        }
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
        {
          title: "View Donor",
          url: "/receptionist/donors",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

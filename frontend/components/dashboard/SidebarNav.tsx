"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Home,
  Activity,
  Search as SearchIcon,
  Bell,
  Plug,
  Key,
  Settings as SettingsIcon,
  User2,
} from "lucide-react";
import Logo from "../common/logo";
import { UserButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // const { user, isLoaded } = useUser();

  const items = [
    { label: "Overview", href: "/", Icon: Home },
    { label: "Live Logs", href: "/live-logs", Icon: Activity },
    { label: "Queries", href: "/queries", Icon: SearchIcon },
    { label: "Alerts", href: "/alerts", Icon: Bell },
    { label: "Integrations", href: "/integrations", Icon: Plug },
    { label: "API Keys", href: "/api-keys", Icon: Key },
    { label: "Settings", href: "/settings", Icon: SettingsIcon },
  ];

  return (
    <SidebarProvider
      defaultOpen
      style={
        {
          "--sidebar-width": "270px",
          "--sidebar-width-icon": "80px",
        } as React.CSSProperties
      }
    >
      <Sidebar
        collapsible="icon"
        className="
          w-60
          border-r border-white/5
          bg-[linear-gradient(180deg,#0C0F12_0%,#080A0C_100%)]
          backdrop-blur supports-backdrop-filter:bg-transparent
          ring-0 shadow-none
        "
      >
        <SidebarHeader>
          <div className="group-data-[collapsible=icon]:hidden">
            <Link href="/" className="flex h-full items-center p-2">
              <Logo textClassName="text-xl" className="h-7 w-7" />
            </Link>
            <span className="px-4 -mt-2 text-sm text-white/70">
              Developer Console
            </span>
          </div>
          <Link
            href="/"
            className="hidden h-full items-center justify-center p-2 group-data-[collapsible=icon]:flex [&>div]:hidden"
          >
            <Logo textClassName="text-xl" className="h-7 w-7" />
          </Link>
        </SidebarHeader>
        <div className="w-[96%] mt-2">
          <SidebarSeparator />
        </div>
        <SidebarContent>
          <SidebarGroup>
            <div className="px-4 pt-1 pb-1 text-[11px] uppercase tracking-wider text-[#71717A] group-data-[collapsible=icon]:hidden">
              Main
            </div>
            <SidebarGroupContent>
              <SidebarMenu className="gap-4 px-3">
                {items.map(({ label, href, Icon }) => (
                  <SidebarMenuItem key={href}>
                    <Link href={href}>
                      <SidebarMenuButton
                        tooltip={label}
                        isActive={pathname === href}
                        className="
                          group
                          h-10 w-full
                          rounded-[10px]
                          px-3 gap-3
                          font-medium
                          text-zinc-300
                          hover:bg-[rgba(0,194,168,0.1)]
                          hover:text-[#00C2A8]
                          focus:bg-[rgba(0,194,168,0.1)]
                          focus:text-[#00C2A8]
                          focus-visible:ring-0
                          active:bg-[rgba(0,194,168,0.15)]
                          active:text-[#00C2A8]
                          data-[active=true]:bg-[rgba(0,194,168,0.15)]
                          data-[active=true]:text-[#00C2A8]
                          transition-colors duration-150
                          cursor-pointer
                        "
                      >
                        <Icon className="h-4.5 w-4.5 shrink-0" />
                        <span className="text-[13px]">{label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <div className="w-[96%]">
          <SidebarSeparator />
        </div>
        <SidebarFooter>
          <div className="relative mt-3 mx-3 mb-3 group-data-[collapsible=icon]:hidden">
            {/* User Plan Badge - positioned to overlap top-left of card */}
            {(() => {
              const plan = "free";
              const badgeStyles = {
                free: "bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-400 border-gray-500/30",
                starter:
                  "bg-gradient-to-r from-teal-500/20 to-emerald-500/20 text-[#00C2A8] border-[#00C2A8]/30",
                pro: "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-400/30",
              };
              const style =
                badgeStyles[plan as keyof typeof badgeStyles] ||
                badgeStyles.free;

              return (
                <span
                  className={`absolute -top-3 left-2 z-10 text-[11px] font-semibold capitalize px-2 py-0.5 rounded-lg ${style}`}
                >
                  free
                </span>
              );
            })()}
            <div className="h-16 rounded-xl border border-white/5 bg-background/30 px-3 py-2">
              {/* {!isLoaded ? (
                <div className="flex h-full items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-linear-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-[11px] font-semibold text-background">
                    N
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate text-[#A1A1AA]">
                      Loading...
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <User2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : ( */}
                <>
                  <div className="flex h-full items-center gap-3">
                    {/* <UserButton
                      appearance={{
                        theme: dark,
                        elements: {
                          avatarBox: "w-8 h-8 rounded-lg",
                          card: "shadow-xl border border-gray-200 dark:border-gray-800",
                          navbar: "hidden",
                          navbarMobileMenuButton: "hidden",
                          headerTitle: "hidden",
                          headerSubtitle: "hidden",
                        },
                      }}
                    /> */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate text-[#A1A1AA]">
                        {/* {user?.fullName} */}
                      </div>
                      <div className="text-[11px] truncate text-[#52525B]">
                        {/* {user?.emailAddresses[0].emailAddress} */}
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 hover:bg-transparent!"
                    >
                      <User2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              {/* )} */}
            </div>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarTrigger className="w-full justify-start rounded-xl hover:bg-transparent!" />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      {children}
    </SidebarProvider>
  );
}

export default DashboardSidebar;

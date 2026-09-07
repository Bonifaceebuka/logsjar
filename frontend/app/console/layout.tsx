import type { Metadata } from "next";
import "../globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardSidebar from "@/components/dashboard/SidebarNav";
import { SidebarInset } from "@/components/ui/sidebar";
import TopBar from "@/components/dashboard/TopBar";

export const metadata: Metadata = {
  title: "Logsjar",
  description: "Production-worthy Opensource real-time software logs monitoring tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
          <TooltipProvider>
            <DashboardSidebar>
              <SidebarInset>
                <TopBar />
                <div className="py-4 pr-4">
                  <div className="mx-auto max-w-7xl">{children}</div>
                </div>
              </SidebarInset>
            </DashboardSidebar>
          </TooltipProvider>
  );
}

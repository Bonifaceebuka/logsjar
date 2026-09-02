"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowUpCircle,
  Trash2,
  Check,
  Download,
  AlertTriangle,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";

export default function Page() {
  const { user, isLoaded } = useUser();
  const currentPlan = "free" as "free" | "starter" | "pro" | "enterprise";
  const [selectedPlan, setSelectedPlan] = React.useState<
    "free" | "starter" | "pro" | "enterprise"
  >(currentPlan);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  // Plan details matching the pricing page
  const planDetails = {
    free: {
      name: "Free",
      price: "$0",
      features: [
        "10k logs/month",
        "7-day retention",
        "Advanced search",
        "Email support",
        "API ACCESS",
      ],
      logsLimit: "10k logs/month",
    },
    starter: {
      name: "Starter",
      price: "$9.99",
      features: [
        "100k logs/month",
        "30-day retention",
        "Advanced search",
        "Priority support",
        "API ACCESS",
      ],
      logsLimit: "100k logs/month",
    },
    pro: {
      name: "Pro",
      price: "$19.99",
      features: [
        "1M logs/month",
        "90-day retention",
        "Real-time alerts",
        "24/7 support",
        "API ACCESS",
      ],
      logsLimit: "1M logs/month",
    },
    enterprise: {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Unlimited logs",
        "Custom retention",
        "Dedicated support",
        "SLA guarantee",
        "Advanced security",
        "On-premise option",
      ],
      logsLimit: "Unlimited logs",
    },
  };

  const currentPlanDetails = planDetails[currentPlan];

  // Design tokens for a premium look
  const TOKENS = {
    accent: "#00C2A8",
    border: "rgba(255,255,255,0.08)",
    radius: "12px",
    cardBg:
      "linear-gradient(180deg, rgba(16,20,27,0.92) 0%, rgba(16,20,27,0.78) 100%)",
    shadow: "0 10px 30px rgba(0,0,0,0.45)",
  };

  // Invoices mock data - dynamic based on plan
  const invoices: any[] = [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage billing, project configuration, and account preferences.
          </p>
        </div>
      </div>
      {/* Tabs */}
      <Tabs defaultValue="billing" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="bg-transparent border-none shadow-none p-0 h-auto rounded-none flex gap-2">
            <TabsTrigger
              value="billing"
              className="px-3 py-2 text-sm font-medium rounded-none border-b-2 border-transparent text-muted-foreground hover:text-white/90 data-[state=active]:text-white data-[state=active]:border-b-[#00C2A8]"
            >
              Billing & Plan
            </TabsTrigger>
            <TabsTrigger
              value="project"
              className="px-3 py-2 text-sm font-medium rounded-none border-b-2 border-transparent text-muted-foreground hover:text-white/90 data-[state=active]:text-white data-[state=active]:border-b-[#00C2A8]"
            >
              Project Settings
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="px-3 py-2 text-sm font-medium rounded-none border-b-2 border-transparent text-muted-foreground hover:text-white/90 data-[state=active]:text-white data-[state=active]:border-b-[#00C2A8]"
            >
              Account & Security
            </TabsTrigger>
            <TabsTrigger
              value="danger"
              className="px-3 py-2 text-sm font-medium rounded-none border-b-2 border-transparent text-muted-foreground hover:text-white/90 data-[state=active]:text-white data-[state=active]:border-b-[#00C2A8]"
            >
              Danger Zone
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Billing & Plan */}
        <TabsContent value="billing">
          <div
            className="rounded-md border p-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${TOKENS.border}`,
              borderRadius: TOKENS.radius,
            }}
          >
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Billing & Plan</h3>
              <p className="text-sm text-muted-foreground">
                Manage your subscription and usage securely. All payments are
                handled via Stripe.
              </p>

              {/* Premium two-card layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className="rounded-md border p-5 transition-all hover:border-white/20"
                  style={{
                    background: TOKENS.cardBg,
                    border: `1px solid ${TOKENS.border}`,
                  }}
                >
                  <div className="text-xs text-muted-foreground mb-2">
                    Current Plan
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold capitalize">
                      {!isLoaded ? "Loading..." : currentPlanDetails.name}
                    </span>
                    <span
                      className="text-[11px] px-2 py-0.5 rounded-full border"
                      style={{
                        background: "rgba(0,194,168,0.12)",
                        borderColor: "rgba(0,194,168,0.35)",
                        color: TOKENS.accent,
                      }}
                    >
                      Active
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-sm">
                    {currentPlanDetails.features
                      .slice(0, 3)
                      .map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-white/85"
                        >
                          <Check className="h-4 w-4" color={TOKENS.accent} />
                          {feature}
                        </div>
                      ))}
                  </div>
                </div>

                {/* Change Plan selector */}
                <div
                  className="rounded-md border p-5 transition-all hover:border-white/20"
                  style={{
                    background: TOKENS.cardBg,
                    border: `1px solid ${TOKENS.border}`,
                  }}
                >
                  <div className="text-xs text-muted-foreground mb-2">
                    Change Plan
                  </div>
                  <Select
                    value={selectedPlan}
                    onValueChange={(v) =>
                      setSelectedPlan(v as typeof selectedPlan)
                    }
                  >
                    <SelectTrigger className="w-full rounded-md">
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="starter">Starter</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Usage</div>
                      <div className="font-medium">
                        {currentPlanDetails.logsLimit}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Next Invoice
                      </div>
                      <div className="font-medium">
                        {currentPlan === "free" ? "N/A" : "Nov 30, 2025"}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <Button
                      className="rounded-md"
                      disabled={
                        selectedPlan === currentPlan ||
                        currentPlan === "enterprise"
                      }
                    >
                      <ArrowUpCircle className="mr-2 h-4 w-4" />
                      {selectedPlan === currentPlan
                        ? "Current Plan"
                        : "Upgrade Plan"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Invoices table (polished) */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Invoices</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {invoices.length} invoices
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg hover:bg-white/10"
                    >
                      <Download className="h-4 w-4" />
                      Export CSV
                    </Button>
                  </div>
                </div>
                <div
                  className="mt-2 rounded-md border"
                  style={{
                    border: `1px solid ${TOKENS.border}`,
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow className="border-b-[0.5px] border-white/10">
                        <TableHead className="text-xs text-white/60">
                          Invoice ID
                        </TableHead>
                        <TableHead className="text-xs text-white/60">
                          Date
                        </TableHead>
                        <TableHead className="text-xs text-white/60">
                          Amount
                        </TableHead>
                        <TableHead className="text-xs text-white/60">
                          Status
                        </TableHead>
                        <TableHead className="text-xs text-white/60">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices?.length > 0 ? (
                        <>
                          {invoices.map((inv) => (
                            <TableRow
                              key={inv.id}
                              className="group transition-all hover:bg-white/3"
                            >
                              <TableCell className="font-mono text-xs text-white/90">
                                {inv.id}
                              </TableCell>
                              <TableCell className="text-white/80">
                                {inv.date}
                              </TableCell>
                              <TableCell className="text-white/80">
                                {inv.amount}
                              </TableCell>
                              <TableCell>
                                <span
                                  className="text-[11px] px-2 py-0.5 rounded-full border"
                                  style={{
                                    background: "rgba(0,194,168,0.12)",
                                    borderColor: "rgba(0,194,168,0.35)",
                                    color: TOKENS.accent,
                                  }}
                                >
                                  {inv.status}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-lg opacity-80 group-hover:opacity-100 hover:bg-[rgba(0,194,168,0.15)]"
                                >
                                  <Download className="h-4 w-4" />
                                  Download PDF
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No invoices available yet!
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Project Settings */}
        <TabsContent value="project">
          <div
            className="rounded-md border p-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${TOKENS.border}`,
              borderRadius: TOKENS.radius,
            }}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium">Project Settings</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  View your project configuration details.
                </p>
              </div>

              {/* Clean list-style layout */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <div className="text-sm font-medium text-white/90">
                      Project Name
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      The name of your project
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-white">
                    Default Project
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <div className="text-sm font-medium text-white/90">
                      Region
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Data center location
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-white">
                      US-East-1
                    </div>
                    <div className="text-xs text-muted-foreground">
                      N. Virginia
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm font-medium text-white/90">
                      Timezone
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Used for log timestamps
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-white">
                      EST (UTC-5)
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Eastern Standard Time
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Account & Security */}
        <TabsContent value="account">
          <div
            className="rounded-md border p-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${TOKENS.border}`,
              borderRadius: TOKENS.radius,
            }}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium">Account & Security</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  View your account information and current subscription.
                </p>
              </div>

              {/* Clean list-style layout */}
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <div className="text-sm font-medium text-white/90">
                      Name
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Your account name
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {user?.fullName || "Not set"}
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <div className="text-sm font-medium text-white/90">
                      Email
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Your account email address
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {user?.emailAddresses[0].emailAddress || "Not available"}
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <div className="text-sm font-medium text-white/90">
                      Joined
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Account creation date
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Not available"}
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm font-medium text-white/90">
                      Plan
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Current subscription tier
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white capitalize">
                      {currentPlanDetails.name}
                    </span>
                    <span
                      className="text-[11px] px-2 py-0.5 rounded-full border capitalize"
                      style={{
                        background: "rgba(0,194,168,0.12)",
                        borderColor: "rgba(0,194,168,0.35)",
                        color: TOKENS.accent,
                      }}
                    >
                      {currentPlan}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Danger Zone */}
        <TabsContent value="danger">
          <div
            className="rounded-md border p-6"
            style={{
              border: "1px solid rgba(248,113,113,0.3)",
              background: "rgba(248,113,113,0.05)",
              borderRadius: "12px",
            }}
          >
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Danger Zone</h3>
              <p className="text-sm text-muted-foreground">
                Deleting your account is irreversible. All data, logs, and API
                keys will be permanently removed after 14 days.
              </p>
              <div className="flex justify-end pt-2">
                <Dialog
                  open={deleteDialogOpen}
                  onOpenChange={setDeleteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="rounded-md">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-125">
                    <DialogHeader>
                      <div className="flex items-center gap-3">
                        <div
                          className="rounded-full p-3"
                          style={{
                            background: "rgba(248,113,113,0.15)",
                            border: "1px solid rgba(248,113,113,0.3)",
                          }}
                        >
                          <AlertTriangle className="h-6 w-6 text-red-400" />
                        </div>
                        <div>
                          <DialogTitle className="text-lg font-semibold">
                            Delete Account
                          </DialogTitle>
                        </div>
                      </div>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                        This action cannot be undone. Your account deletion
                        request will be processed with the following timeline:
                      </DialogDescription>

                      <div
                        className="rounded-md border p-4 space-y-3"
                        style={{
                          background: "rgba(248,113,113,0.05)",
                          border: "1px solid rgba(248,113,113,0.2)",
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <div className="h-2 w-2 rounded-full bg-red-400" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-white/90">
                              14-Day Security Hold
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Your account will be marked for deletion and
                              inaccessible immediately. However, for security
                              purposes, all data will be retained for 14 days.
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <div className="h-2 w-2 rounded-full bg-red-400" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-white/90">
                              Complete Data Deletion
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              After 14 days, all account data, logs, API keys,
                              and associated information will be permanently
                              deleted from our systems.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        If you change your mind within the 14-day period, please
                        contact support to restore your account.
                      </div>
                    </div>
                    <DialogFooter className="gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setDeleteDialogOpen(false)}
                        className="rounded-md hover:bg-black/10"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          console.log("Account deletion requested");
                          setDeleteDialogOpen(false);
                        }}
                        className="rounded-md"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete My Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

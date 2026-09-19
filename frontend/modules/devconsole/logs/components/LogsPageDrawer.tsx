import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/common/components/ui/tabs";
import { Button } from "@/common/components/ui/button";
import { Clipboard } from "lucide-react";
import { levelColor } from "../pages/LogsPage";
import { formatShortDate } from "@/common/utils/date.util";

export default function LogsPageDrawer({
    setSelected,
    selected
}: {
    setSelected: any,
    selected: any
}) {
    return (
        <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setSelected(null)}
        >
            <div
                className="fixed right-0 top-0 h-full w-[420px] border-l bg-background p-4"
                style={{ background: "#0E1117" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Log Details</h3>
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        onClick={() =>
                            navigator.clipboard.writeText(
                                JSON.stringify(selected, null, 2)
                            )
                        }
                    >
                        <Clipboard className="mr-2 h-3.5 w-3.5" />
                        Copy JSON
                    </Button>
                </div>

                <Tabs defaultValue="formatted" className="mt-3">
                    <TabsList>
                        <TabsTrigger value="formatted">Formatted</TabsTrigger>
                        <TabsTrigger value="raw">Raw JSON</TabsTrigger>
                    </TabsList>
                    <TabsContent value="formatted" className="mt-3">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Timestamp</span>
                                <span>{formatShortDate(selected.timestamp) ?? "—"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Loge level</span>
                                <span
                                    className="font-medium"
                                    style={{
                                        color:
                                            levelColor[
                                            String(
                                                selected.level || ""
                                            ).toLowerCase() as keyof typeof levelColor
                                            ] ?? "inherit",
                                    }}
                                >
                                    {String(selected.level || "").toUpperCase() || "—"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Type</span>
                                <span
                                    className="font-medium"
                                    style={{
                                        color:
                                            levelColor[
                                            String(
                                                selected.type || ""
                                            ).toLowerCase() as keyof typeof levelColor
                                            ] ?? "inherit",
                                    }}
                                >
                                    {String(selected.type || "").toUpperCase() || "—"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Project</span>
                                <span>{selected.apiKey_name ?? "—"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Service</span>
                                <span>{selected.service ?? "—"}</span>
                            </div>
                            <div>
                                <div className="text-muted-foreground mb-1">Message</div>
                                <div className="rounded-lg border border-white/10 bg-black/20 p-2">
                                    {selected.message ?? "—"}
                                </div>
                            </div>
                            <div>
                                <div className="text-muted-foreground mb-1">
                                    Environment
                                </div>
                                <div className="rounded-lg border border-white/10 bg-black/20 p-2">
                                    {selected.logs_environment ?? "—"}
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="raw" className="mt-3">
                        <pre className="rounded-lg border border-white/10 bg-black/20 p-2 overflow-x-auto text-xs">
                            {JSON.stringify(selected, null, 2)}
                        </pre>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

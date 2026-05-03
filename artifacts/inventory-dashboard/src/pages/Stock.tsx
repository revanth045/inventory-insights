import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { MOCK_PRODUCTS } from "@/data/mockData";
import { AlertTriangle, TrendingDown, RefreshCw, CheckCircle2, XCircle, Package, Zap, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

function StatusBadge({ status }: { status: string }) {
  if (status === "healthy") return <Badge className="bg-teal-500 text-white gap-1 text-[11px]"><CheckCircle2 className="h-2.5 w-2.5" /> In Stock</Badge>;
  if (status === "low") return <Badge className="bg-amber-500 text-white gap-1 text-[11px]"><AlertTriangle className="h-2.5 w-2.5" /> Low</Badge>;
  if (status === "critical") return <Badge variant="destructive" className="gap-1 text-[11px]"><XCircle className="h-2.5 w-2.5" /> Critical</Badge>;
  return null;
}

function DaysUntilEmpty({ quantity, dailyUsage }: { quantity: number; dailyUsage: number }) {
  if (quantity === 0) {
    return <span className="text-destructive font-bold text-xs flex items-center gap-1"><XCircle className="h-3 w-3" /> Out of stock</span>;
  }
  if (!dailyUsage || dailyUsage === 0) return <span className="text-muted-foreground text-xs">N/A</span>;
  const days = Math.floor(quantity / dailyUsage);
  if (days <= 3) return <span className="text-destructive font-bold text-xs flex items-center gap-1"><Timer className="h-3 w-3" /> {days}d</span>;
  if (days <= 14) return <span className="text-amber-500 font-semibold text-xs">{days}d</span>;
  return <span className="text-teal-600 dark:text-teal-400 text-xs">{days}d</span>;
}

export default function Stock() {
  const { toast } = useToast();
  const [syncing, setSyncing] = useState(false);
  const [restockingAll, setRestockingAll] = useState(false);

  const needsReorder = MOCK_PRODUCTS.filter(p => p.quantity <= p.reorderPoint);
  const criticalItems = MOCK_PRODUCTS.filter(p => p.status === "critical");
  const healthy = MOCK_PRODUCTS.filter(p => p.status === "healthy").length;
  const low = MOCK_PRODUCTS.filter(p => p.status === "low").length;
  const critical = MOCK_PRODUCTS.filter(p => p.status === "critical").length;

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast({ title: "ERP sync complete", description: "Stock levels updated successfully." });
    }, 1800);
  };

  const handleRestockAll = () => {
    setRestockingAll(true);
    setTimeout(() => {
      setRestockingAll(false);
      toast({
        title: `${criticalItems.length} POs drafted`,
        description: "Purchase orders created for all critical items."
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Levels</h1>
          <p className="text-muted-foreground mt-1 text-sm">Monitor capacity and restock alerts</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 shrink-0" onClick={handleSync} disabled={syncing} data-testid="button-sync">
          <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing..." : "Sync ERP"}
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "In Stock", count: healthy, icon: CheckCircle2, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-950/40", border: "border-teal-200 dark:border-teal-900" },
          { label: "Low Stock", count: low, icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/40", border: "border-amber-200 dark:border-amber-900" },
          { label: "Critical", count: critical, icon: XCircle, color: "text-destructive", bg: "bg-destructive/5", border: "border-destructive/20" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className={`border ${s.border}`}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${s.bg}`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{s.count}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Capacity overview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Capacity Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[160px]">Stock Level</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Daily Use</TableHead>
                    <TableHead className="text-right">Days Left</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_PRODUCTS.map((product, i) => {
                    const max = product.maxCapacity || Math.max(product.quantity, product.reorderPoint * 3, 1);
                    const pct = Math.min(100, Math.max(0, (product.quantity / max) * 100));
                    const barColor =
                      product.status === "critical" ? "bg-destructive" :
                      product.status === "low" ? "bg-amber-500" :
                      "bg-teal-500";

                    return (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 + i * 0.04 }}
                        className="border-b border-border/60 last:border-0 hover:bg-muted/40 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{product.name}</div>
                              <div className="text-xs text-muted-foreground font-mono">{product.sku}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><StatusBadge status={product.status} /></TableCell>
                        <TableCell>
                          <div className="space-y-1.5">
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.7, delay: 0.15 + i * 0.04, ease: "easeOut" }}
                                className={`h-full ${barColor} rounded-full`}
                              />
                            </div>
                            <div className="text-[10px] text-muted-foreground">{Math.round(pct)}%</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-sm">{product.quantity}</TableCell>
                        <TableCell className="text-right text-muted-foreground text-sm">{product.dailyUsage ?? "—"}/day</TableCell>
                        <TableCell className="text-right">
                          <DaysUntilEmpty quantity={product.quantity} dailyUsage={product.dailyUsage ?? 0} />
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Restock alerts */}
        <div>
          <Card className="border-destructive/30">
            <CardHeader className="bg-destructive/5 border-b border-border rounded-t-xl">
              <div className="flex items-center justify-between">
                <CardTitle className="text-destructive flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  Action Required
                  <span className="ml-auto bg-destructive text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{needsReorder.length}</span>
                </CardTitle>
              </div>
              {criticalItems.length > 0 && (
                <Button
                  size="sm"
                  className="w-full mt-2 h-8 text-xs gap-1.5 bg-destructive hover:bg-destructive/90"
                  onClick={handleRestockAll}
                  disabled={restockingAll}
                  data-testid="button-restock-all-critical"
                >
                  <Zap className="h-3.5 w-3.5" />
                  {restockingAll ? "Drafting POs..." : `Restock All Critical (${criticalItems.length})`}
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {needsReorder.map((product, i) => {
                  const daysLeft = product.dailyUsage ? Math.floor(product.quantity / product.dailyUsage) : null;
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.08 }}
                      className="p-4 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-semibold text-sm leading-tight">{product.name}</div>
                        <div className={`font-bold text-sm ${product.status === "critical" ? "text-destructive" : "text-amber-500"}`}>
                          {product.quantity} left
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><TrendingDown className="h-3 w-3 text-destructive" /> Reorder at {product.reorderPoint}</span>
                        {daysLeft !== null && (
                          <span className={`font-medium ${daysLeft <= 3 ? "text-destructive" : "text-amber-500"}`}>
                            ~{daysLeft}d remaining
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="w-full h-7 text-xs"
                        onClick={() => toast({ title: "PO drafted", description: `Purchase order created for ${product.name}` })}
                        data-testid={`button-draft-po-${product.id}`}
                      >
                        Draft Purchase Order
                      </Button>
                    </motion.div>
                  );
                })}
                {needsReorder.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-teal-500 opacity-60" />
                    <div className="text-sm">All stock levels are healthy</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

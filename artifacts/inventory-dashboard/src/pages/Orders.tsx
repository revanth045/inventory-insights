import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_ORDERS } from "@/data/mockData";
import { Clock, CheckCircle2, RefreshCw, XCircle, Truck, Plus, Search, ArrowRight, Download, CalendarDays, Package, DollarSign } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

const ORDER_STEPS = [
  { key: "placed", label: "Order Placed", icon: Package },
  { key: "processing", label: "Processing", icon: RefreshCw },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

function getTimelineStep(status: string): number {
  if (status === "cancelled") return -1;
  if (status === "pending") return 0;
  if (status === "processing") return 1;
  if (status === "delivered") return 3;
  return 0;
}

function OrderStatus({ status }: { status: string }) {
  if (status === "delivered") return <Badge className="bg-teal-500 hover:bg-teal-600 text-white gap-1.5 text-[11px] w-max"><CheckCircle2 className="h-3 w-3" /> Delivered</Badge>;
  if (status === "processing") return <Badge className="bg-blue-500 hover:bg-blue-600 text-white gap-1.5 text-[11px] w-max"><RefreshCw className="h-3 w-3" /> Processing</Badge>;
  if (status === "pending") return <Badge className="bg-amber-500 hover:bg-amber-600 text-white gap-1.5 text-[11px] w-max"><Clock className="h-3 w-3" /> Pending</Badge>;
  if (status === "cancelled") return <Badge variant="destructive" className="gap-1.5 text-[11px] w-max"><XCircle className="h-3 w-3" /> Cancelled</Badge>;
  return null;
}

function OrderTimeline({ status }: { status: string }) {
  const step = getTimelineStep(status);
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
        <XCircle className="h-5 w-5 text-destructive shrink-0" />
        <div>
          <div className="font-medium text-sm text-destructive">Order Cancelled</div>
          <div className="text-xs text-muted-foreground">This order was cancelled and will not be fulfilled.</div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order Progress</div>
      <div className="relative">
        {/* Track line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-muted rounded-full" />
        <motion.div
          className="absolute top-5 left-5 h-0.5 bg-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${step === 0 ? 0 : step >= 3 ? 100 : step === 1 ? 33 : 66}%` }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        />
        {/* Steps */}
        <div className="relative flex justify-between">
          {ORDER_STEPS.map((s, i) => {
            const done = i <= step;
            const active = i === step;
            const Icon = s.icon;
            return (
              <div key={s.key} className="flex flex-col items-center gap-1.5">
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 ${
                    done
                      ? "bg-accent border-accent text-white"
                      : "bg-card border-border text-muted-foreground"
                  } ${active ? "ring-2 ring-accent/30 ring-offset-2" : ""}`}
                >
                  <Icon className="h-4 w-4" />
                </motion.div>
                <span className={`text-[10px] font-medium text-center leading-tight max-w-[52px] ${done ? "text-accent" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function downloadCSV(orders: typeof MOCK_ORDERS) {
  const headers = ["Order ID", "Supplier", "Status", "Order Date", "Expected", "Items", "Value ($)"];
  const rows = orders.map(o => [o.id, o.supplier, o.status, o.date, o.expected, o.items, o.value.toFixed(2)]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "orders-export.csv"; a.click();
  URL.revokeObjectURL(url);
}

export default function Orders() {
  const { toast } = useToast();
  const [statusTab, setStatusTab] = useState("all");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [selected, setSelected] = useState<(typeof MOCK_ORDERS)[0] | null>(null);

  const filtered = MOCK_ORDERS.filter(o => {
    const matchTab = statusTab === "all" || o.status === statusTab;
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.supplier.toLowerCase().includes(search.toLowerCase());
    const matchDate = dateRange === "all" || (() => {
      const date = new Date(o.date);
      const now = new Date();
      const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
      if (dateRange === "7") return diff <= 7;
      if (dateRange === "30") return diff <= 30;
      if (dateRange === "90") return diff <= 90;
      return true;
    })();
    return matchTab && matchSearch && matchDate;
  });

  const totalValue = filtered.reduce((acc, o) => acc + o.value, 0);
  const pendingCount = MOCK_ORDERS.filter(o => o.status === "pending").length;
  const processingCount = MOCK_ORDERS.filter(o => o.status === "processing").length;
  const deliveredCount = MOCK_ORDERS.filter(o => o.status === "delivered").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1 text-sm">Purchase orders and inbound shipments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { downloadCSV(filtered); toast({ title: "Orders exported" }); }} data-testid="button-export-orders">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button size="sm" className="gap-1.5 shrink-0" onClick={() => toast({ title: "New order", description: "Order creation form would open here." })} data-testid="button-new-order">
            <Plus className="h-4 w-4" /> New Order
          </Button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Orders", value: MOCK_ORDERS.length, icon: Package, color: "text-foreground", bg: "bg-muted" },
          { label: "Pending", value: pendingCount, icon: Clock, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/40" },
          { label: "Processing", value: processingCount, icon: RefreshCw, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/40" },
          { label: "Delivered", value: deliveredCount, icon: CheckCircle2, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-950/40" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${s.bg} shrink-0`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className={`text-2xl font-bold mt-0.5 ${s.color !== "text-foreground" ? s.color : ""}`}>{s.value}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit flex-wrap">
        {STATUS_TABS.map(tab => (
          <button key={tab.key} onClick={() => setStatusTab(tab.key)} data-testid={`tab-order-${tab.key}`}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${statusTab === tab.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            {tab.label}
            {tab.key !== "all" && (
              <span className="ml-1.5 text-[10px] bg-muted-foreground/20 px-1.5 py-0.5 rounded-full">
                {MOCK_ORDERS.filter(o => o.status === tab.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search + date filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID or supplier..." className="pl-9" data-testid="input-order-search" />
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-date-range-orders">
            <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Order ID</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Expected</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((order, i) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.035 }}
                className="cursor-pointer hover:bg-muted/50 transition-colors border-b border-border/60 last:border-0"
                onClick={() => setSelected(order)}
                data-testid={`row-order-${order.id}`}
              >
                <TableCell className="font-mono font-medium text-sm">{order.id}</TableCell>
                <TableCell className="font-medium">{order.supplier}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{order.date}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <Truck className="h-3.5 w-3.5" />
                    {order.expected}
                  </div>
                </TableCell>
                <TableCell className="text-right text-sm">{order.items}</TableCell>
                <TableCell className="text-right font-medium">${order.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
                <TableCell><OrderStatus status={order.status} /></TableCell>
                <TableCell><ArrowRight className="h-4 w-4 text-muted-foreground/50" /></TableCell>
              </motion.tr>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-28 text-center text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {filtered.length > 0 && (
          <div className="flex justify-between px-4 py-3 border-t border-border bg-muted/30 text-sm text-muted-foreground">
            <span>{filtered.length} order{filtered.length !== 1 ? "s" : ""} shown</span>
            <span>Total value: <span className="font-semibold text-foreground">${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></span>
          </div>
        )}
      </div>

      {/* Order detail sheet */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="sm:max-w-[440px] overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="pb-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <ShoppingCart className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <SheetTitle className="font-mono text-xl">{selected.id}</SheetTitle>
                    <div className="mt-1.5"><OrderStatus status={selected.status} /></div>
                  </div>
                </div>
              </SheetHeader>

              <div className="py-5 space-y-5">
                {/* Timeline */}
                <OrderTimeline status={selected.status} />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Supplier", value: selected.supplier, icon: Truck },
                    { label: "Order Date", value: selected.date, icon: CalendarDays },
                    { label: "Expected Delivery", value: selected.expected, icon: CalendarDays },
                    { label: "Item Count", value: `${selected.items} items`, icon: Package },
                    { label: "Total Value", value: `$${selected.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: DollarSign },
                    { label: "Avg. Unit Cost", value: `$${(selected.value / selected.items).toFixed(2)}`, icon: DollarSign },
                  ].map(item => (
                    <div key={item.label} className="bg-muted/50 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                      <div className="font-semibold text-sm mt-0.5">{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Value bar */}
                <div className="p-3 bg-muted/30 rounded-xl border border-border">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-muted-foreground">Order value vs. avg ($3,870)</span>
                    <span className={`font-medium ${selected.value > 3870 ? "text-teal-500" : "text-amber-500"}`}>
                      {selected.value > 3870 ? "Above" : "Below"} average
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (selected.value / 12000) * 100)}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full bg-accent rounded-full"
                    />
                  </div>
                  <div className="text-right text-xs text-muted-foreground mt-1">${selected.value.toLocaleString()}</div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-border space-y-2">
                  <h4 className="font-semibold text-sm">Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" onClick={() => toast({ title: "Order updated" })} data-testid="button-edit-order">Edit Order</Button>
                    {selected.status !== "delivered" && selected.status !== "cancelled" && (
                      <Button size="sm" className="gap-1.5" onClick={() => toast({ title: "Marked delivered!", description: selected.id + " marked as delivered." })} data-testid="button-mark-delivered">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Mark Delivered
                      </Button>
                    )}
                    {selected.status === "pending" && (
                      <Button size="sm" variant="destructive" onClick={() => toast({ title: "Order cancelled", variant: "destructive" })} data-testid="button-cancel-order">Cancel Order</Button>
                    )}
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast({ title: "Receipt downloaded" })} data-testid="button-download-receipt">
                      <Download className="h-3.5 w-3.5" /> Receipt
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ShoppingCart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
    </svg>
  );
}

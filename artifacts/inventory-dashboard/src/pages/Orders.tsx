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
import { Clock, CheckCircle2, RefreshCw, XCircle, Truck, Plus, Search, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

function OrderStatus({ status }: { status: string }) {
  if (status === "delivered") return <Badge className="bg-teal-500 hover:bg-teal-600 text-white gap-1.5 text-[11px] w-max"><CheckCircle2 className="h-3 w-3" /> Delivered</Badge>;
  if (status === "processing") return <Badge className="bg-blue-500 hover:bg-blue-600 text-white gap-1.5 text-[11px] w-max"><RefreshCw className="h-3 w-3" /> Processing</Badge>;
  if (status === "pending") return <Badge className="bg-amber-500 hover:bg-amber-600 text-white gap-1.5 text-[11px] w-max"><Clock className="h-3 w-3" /> Pending</Badge>;
  if (status === "cancelled") return <Badge variant="destructive" className="gap-1.5 text-[11px] w-max"><XCircle className="h-3 w-3" /> Cancelled</Badge>;
  return null;
}

const SUMMARY = [
  { label: "Total Orders", value: MOCK_ORDERS.length, color: "text-foreground" },
  { label: "Pending", value: MOCK_ORDERS.filter(o => o.status === "pending").length, color: "text-amber-600 dark:text-amber-400" },
  { label: "Processing", value: MOCK_ORDERS.filter(o => o.status === "processing").length, color: "text-blue-600 dark:text-blue-400" },
  { label: "Delivered", value: MOCK_ORDERS.filter(o => o.status === "delivered").length, color: "text-teal-600 dark:text-teal-400" },
];

export default function Orders() {
  const { toast } = useToast();
  const [statusTab, setStatusTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<(typeof MOCK_ORDERS)[0] | null>(null);

  const filtered = MOCK_ORDERS.filter(o => {
    const matchTab = statusTab === "all" || o.status === statusTab;
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.supplier.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalValue = filtered.reduce((acc, o) => acc + o.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1 text-sm">Purchase orders and inbound shipments</p>
        </div>
        <Button size="sm" className="gap-1.5 shrink-0" onClick={() => toast({ title: "New order", description: "Order creation form would open here." })} data-testid="button-new-order">
          <Plus className="h-4 w-4" /> New Order
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SUMMARY.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit flex-wrap">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusTab(tab.key)}
            data-testid={`tab-order-${tab.key}`}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
              statusTab === tab.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by ID or supplier..."
          className="pl-9"
          data-testid="input-order-search"
        />
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
              <TableHead className="text-right">Total Value</TableHead>
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
                transition={{ delay: i * 0.04 }}
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
                <TableCell>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
                </TableCell>
              </motion.tr>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-28 text-center text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {filtered.length > 0 && (
          <div className="flex justify-end px-4 py-3 border-t border-border bg-muted/30 text-sm text-muted-foreground">
            Showing {filtered.length} orders · Total value: <span className="font-semibold text-foreground ml-1">${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </div>
        )}
      </div>

      {/* Order detail sheet */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="sm:max-w-[420px]">
          {selected && (
            <>
              <SheetHeader className="pb-5 border-b border-border">
                <SheetTitle className="font-mono text-xl">{selected.id}</SheetTitle>
                <div className="mt-2"><OrderStatus status={selected.status} /></div>
              </SheetHeader>
              <div className="py-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Supplier", value: selected.supplier },
                    { label: "Order Date", value: selected.date },
                    { label: "Expected Delivery", value: selected.expected },
                    { label: "Item Count", value: `${selected.items} items` },
                    { label: "Total Value", value: `$${selected.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
                    { label: "Avg. Unit Cost", value: `$${(selected.value / selected.items).toFixed(2)}` },
                  ].map(item => (
                    <div key={item.label} className="bg-muted/50 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                      <div className="font-semibold text-sm mt-0.5">{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-border space-y-2">
                  <h4 className="font-semibold text-sm">Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" onClick={() => toast({ title: "Order updated" })}>Edit Order</Button>
                    {selected.status !== "delivered" && (
                      <Button size="sm" onClick={() => toast({ title: "Marked delivered!", description: selected.id + " marked as delivered." })}>Mark Delivered</Button>
                    )}
                    {selected.status === "pending" && (
                      <Button size="sm" variant="destructive" onClick={() => toast({ title: "Order cancelled", variant: "destructive" })}>Cancel Order</Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => toast({ title: "Receipt downloaded" })}>Download Receipt</Button>
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

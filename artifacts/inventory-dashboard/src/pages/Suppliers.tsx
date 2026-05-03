import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_SUPPLIERS, MOCK_ORDERS } from "@/data/mockData";
import { Star, Mail, Truck, Package, Building2, Search, Plus, Phone, Globe, LayoutGrid, LayoutList, ChevronUp, ChevronDown, CheckCircle2, AlertTriangle, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`} />
      ))}
      <span className="ml-1 text-sm font-semibold">{rating}</span>
    </div>
  );
}

function OnTimeBar({ pct }: { pct: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">On-time delivery</span>
        <span className={`font-semibold ${pct >= 90 ? "text-teal-500" : pct >= 80 ? "text-amber-500" : "text-destructive"}`}>{pct}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={`h-full rounded-full ${pct >= 90 ? "bg-teal-500" : pct >= 80 ? "bg-amber-500" : "bg-destructive"}`}
        />
      </div>
    </div>
  );
}

type SortKey = "rating" | "leadTime" | "onTimeDelivery" | "activeOrders";

export default function Suppliers() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<(typeof MOCK_SUPPLIERS)[0] | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortKey, setSortKey] = useState<SortKey>("rating");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const filtered = MOCK_SUPPLIERS
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "rating") return (a.rating - b.rating) * dir;
      if (sortKey === "leadTime") return (parseInt(a.leadTime) - parseInt(b.leadTime)) * dir;
      if (sortKey === "onTimeDelivery") return (a.onTimeDelivery - b.onTimeDelivery) * dir;
      if (sortKey === "activeOrders") return (a.activeOrders - b.activeOrders) * dir;
      return 0;
    });

  const reliabilityColor = (r: number) =>
    r >= 4.7 ? "text-teal-500" : r >= 4.4 ? "text-blue-500" : "text-amber-500";

  const avgOnTime = Math.round(MOCK_SUPPLIERS.reduce((a, s) => a + s.onTimeDelivery, 0) / MOCK_SUPPLIERS.length);

  const SortIcon = ({ key }: { key: SortKey }) => sortKey === key
    ? sortDir === "desc" ? <ChevronDown className="h-3 w-3 inline ml-0.5" /> : <ChevronUp className="h-3 w-3 inline ml-0.5" />
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage vendor relationships and performance</p>
        </div>
        <Button size="sm" className="gap-1.5 shrink-0" onClick={() => toast({ title: "Add supplier" })} data-testid="button-add-supplier">
          <Plus className="h-4 w-4" /> Add Supplier
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Suppliers", value: MOCK_SUPPLIERS.length, sub: "Active vendors" },
          { label: "Active Orders", value: MOCK_SUPPLIERS.reduce((a, s) => a + s.activeOrders, 0), sub: "In progress" },
          { label: "Avg. Rating", value: (MOCK_SUPPLIERS.reduce((a, s) => a + s.rating, 0) / MOCK_SUPPLIERS.length).toFixed(1), sub: "Out of 5.0" },
          { label: "Avg. On-Time", value: `${avgOnTime}%`, sub: "Delivery rate" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="text-2xl font-bold mt-1">{s.value}</div>
              <div className="text-[10px] text-muted-foreground/70 mt-0.5">{s.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search + sort + view toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search suppliers..." className="pl-9" data-testid="input-supplier-search" />
        </div>
        <Select value={sortKey} onValueChange={v => { setSortKey(v as SortKey); setSortDir("desc"); }}>
          <SelectTrigger className="w-full sm:w-[160px]" data-testid="select-supplier-sort">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">By Rating</SelectItem>
            <SelectItem value="onTimeDelivery">By On-Time %</SelectItem>
            <SelectItem value="leadTime">By Lead Time</SelectItem>
            <SelectItem value="activeOrders">By Active Orders</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-1 p-1 bg-muted rounded-lg h-9 self-start sm:self-auto">
          <button onClick={() => setViewMode("grid")} className={`px-2 rounded-md transition-all ${viewMode === "grid" ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"}`} data-testid="button-view-grid">
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button onClick={() => setViewMode("list")} className={`px-2 rounded-md transition-all ${viewMode === "list" ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground"}`} data-testid="button-view-list">
            <LayoutList className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grid view */}
      {viewMode === "grid" && (
        <div className="grid gap-5 sm:grid-cols-2">
          {filtered.map((supplier, i) => (
            <motion.div key={supplier.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group" onClick={() => setSelected(supplier)}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent/20 transition-colors">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-base leading-tight">{supplier.name}</CardTitle>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Badge variant="secondary" className="text-[11px]">{supplier.category}</Badge>
                          <Badge variant="outline" className="text-[11px]">{supplier.country}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${reliabilityColor(supplier.rating)}`}>{supplier.rating}</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <RatingStars rating={supplier.rating} />
                  <OnTimeBar pct={supplier.onTimeDelivery} />
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Truck className="w-4 h-4 shrink-0" /><span>{supplier.leadTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Package className="w-4 h-4 shrink-0" /><span>{supplier.activeOrders} orders</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                      <Mail className="w-4 h-4 shrink-0" /><span className="truncate text-xs">{supplier.contact}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-3 border-t border-border gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={e => { e.stopPropagation(); setSelected(supplier); }} data-testid={`button-view-supplier-${supplier.id}`}>View Details</Button>
                  <Button size="sm" className="flex-1" onClick={e => { e.stopPropagation(); toast({ title: "PO created", description: `New purchase order for ${supplier.name}` }); }} data-testid={`button-order-supplier-${supplier.id}`}>New Order</Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* List view */}
      {viewMode === "list" && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Supplier</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("rating")}>
                  Rating <SortIcon key="rating" />
                </TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("onTimeDelivery")}>
                  On-Time <SortIcon key="onTimeDelivery" />
                </TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("leadTime")}>
                  Lead Time <SortIcon key="leadTime" />
                </TableHead>
                <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("activeOrders")}>
                  Active Orders <SortIcon key="activeOrders" />
                </TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((supplier, i) => (
                <motion.tr
                  key={supplier.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="cursor-pointer hover:bg-muted/50 transition-colors border-b border-border/60 last:border-0"
                  onClick={() => setSelected(supplier)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                        <Building2 className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{supplier.name}</div>
                        <div className="text-xs text-muted-foreground">{supplier.country}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary" className="text-[11px]">{supplier.category}</Badge></TableCell>
                  <TableCell><RatingStars rating={supplier.rating} /></TableCell>
                  <TableCell>
                    <span className={`font-semibold text-sm ${supplier.onTimeDelivery >= 90 ? "text-teal-500" : supplier.onTimeDelivery >= 80 ? "text-amber-500" : "text-destructive"}`}>
                      {supplier.onTimeDelivery}%
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{supplier.leadTime}</TableCell>
                  <TableCell className="text-sm">{supplier.activeOrders}</TableCell>
                  <TableCell><Button variant="ghost" size="sm" className="text-xs">Details</Button></TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Supplier detail sheet */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="sm:max-w-[460px] overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="pb-5 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Building2 className="h-7 w-7 text-accent" />
                  </div>
                  <div>
                    <SheetTitle className="text-lg">{selected.name}</SheetTitle>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Badge variant="secondary">{selected.category}</Badge>
                      <Badge variant="outline" className="text-[11px]">{selected.country}</Badge>
                    </div>
                  </div>
                </div>
              </SheetHeader>

              <div className="py-5 space-y-5">
                {/* Rating + on-time */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <RatingStars rating={selected.rating} />
                    <span className="text-sm text-muted-foreground">supplier rating</span>
                  </div>
                  <OnTimeBar pct={selected.onTimeDelivery} />
                </div>

                {/* Performance badge */}
                <div className={`flex items-center gap-3 p-3 rounded-xl ${
                  selected.onTimeDelivery >= 90 ? "bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900" :
                  selected.onTimeDelivery >= 80 ? "bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900" :
                  "bg-destructive/5 border border-destructive/20"
                }`}>
                  {selected.onTimeDelivery >= 90
                    ? <CheckCircle2 className="h-5 w-5 text-teal-500 shrink-0" />
                    : <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />}
                  <div>
                    <div className={`font-semibold text-sm ${selected.onTimeDelivery >= 90 ? "text-teal-700 dark:text-teal-300" : "text-amber-700 dark:text-amber-300"}`}>
                      {selected.onTimeDelivery >= 90 ? "Top Performer" : selected.onTimeDelivery >= 80 ? "Average Performance" : "Underperforming"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {selected.onTimeDelivery >= 90 ? "Excellent reliability — trusted supplier" : "Delivery rate below benchmark (90%)"}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Lead Time", value: selected.leadTime },
                    { label: "Active Orders", value: `${selected.activeOrders} orders` },
                    { label: "Email", value: selected.contact },
                    { label: "Phone", value: selected.phone || "—" },
                    { label: "Country", value: selected.country || "—" },
                    { label: "Category", value: selected.category },
                  ].map(item => (
                    <div key={item.label} className="bg-muted/50 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                      <div className="font-semibold text-sm mt-0.5 truncate">{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Recent orders from this supplier */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Recent Orders</h4>
                  <div className="space-y-1.5">
                    {MOCK_ORDERS.filter(o => o.supplier === selected.name).slice(0, 3).map(order => (
                      <div key={order.id} className="flex items-center justify-between p-2.5 bg-muted/40 rounded-lg text-sm">
                        <span className="font-mono text-xs text-muted-foreground">{order.id}</span>
                        <span className="text-xs">${order.value.toLocaleString()}</span>
                        <span className={`text-[11px] font-medium ${
                          order.status === "delivered" ? "text-teal-500" :
                          order.status === "processing" ? "text-blue-500" :
                          order.status === "pending" ? "text-amber-500" : "text-destructive"
                        }`}>{order.status}</span>
                      </div>
                    ))}
                    {MOCK_ORDERS.filter(o => o.supplier === selected.name).length === 0 && (
                      <div className="text-sm text-muted-foreground py-2">No recent orders</div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-border space-y-2">
                  <h4 className="font-semibold text-sm">Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast({ title: `Emailing ${selected.name}` })} data-testid={`button-contact-supplier-${selected.id}`}>
                      <Mail className="h-3.5 w-3.5" /> Contact
                    </Button>
                    <Button size="sm" className="gap-1.5" onClick={() => toast({ title: "PO created", description: `Order placed with ${selected.name}` })} data-testid={`button-new-order-supplier-${selected.id}`}>
                      <Package className="h-3.5 w-3.5" /> New Order
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5 col-span-2" onClick={() => toast({ title: "Report downloaded" })} data-testid={`button-report-supplier-${selected.id}`}>
                      <Download className="h-3.5 w-3.5" /> Download Performance Report
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

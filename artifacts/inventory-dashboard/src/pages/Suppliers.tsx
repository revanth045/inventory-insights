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
import { MOCK_SUPPLIERS } from "@/data/mockData";
import { Star, Mail, Truck, Package, Building2, Search, Plus, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          className={`h-3.5 w-3.5 ${s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`}
        />
      ))}
      <span className="ml-1 text-sm font-semibold">{rating}</span>
    </div>
  );
}

export default function Suppliers() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<(typeof MOCK_SUPPLIERS)[0] | null>(null);

  const filtered = MOCK_SUPPLIERS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  const reliabilityColor = (r: number) =>
    r >= 4.7 ? "text-teal-500" : r >= 4.4 ? "text-blue-500" : "text-amber-500";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage vendor relationships and performance</p>
        </div>
        <Button size="sm" className="gap-1.5 shrink-0" onClick={() => toast({ title: "Add supplier", description: "Supplier form would open here." })} data-testid="button-add-supplier">
          <Plus className="h-4 w-4" /> Add Supplier
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Suppliers", value: MOCK_SUPPLIERS.length },
          { label: "Active Orders", value: MOCK_SUPPLIERS.reduce((a, s) => a + s.activeOrders, 0) },
          { label: "Avg. Rating", value: (MOCK_SUPPLIERS.reduce((a, s) => a + s.rating, 0) / MOCK_SUPPLIERS.length).toFixed(1) },
          { label: "Fastest Lead Time", value: "3 days" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="text-2xl font-bold mt-1">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search suppliers..."
          className="pl-9"
          data-testid="input-supplier-search"
        />
      </div>

      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-2">
        {filtered.map((supplier, i) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group" onClick={() => setSelected(supplier)}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent/20 transition-colors">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-base leading-tight">{supplier.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1.5 text-[11px]">{supplier.category}</Badge>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${reliabilityColor(supplier.rating)}`}>{supplier.rating}</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-1.5">
                  <RatingStars rating={supplier.rating} />
                  <span className="text-xs text-muted-foreground ml-1">reliability score</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Truck className="w-4 h-4 shrink-0" />
                    <span>{supplier.leadTime} lead time</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="w-4 h-4 shrink-0" />
                    <span>{supplier.activeOrders} active orders</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span className="truncate text-xs">{supplier.contact}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-3 border-t border-border gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={e => { e.stopPropagation(); setSelected(supplier); }}
                  data-testid={`button-view-supplier-${supplier.id}`}
                >
                  View Details
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={e => {
                    e.stopPropagation();
                    toast({ title: "PO created", description: `New purchase order for ${supplier.name}` });
                  }}
                  data-testid={`button-order-supplier-${supplier.id}`}
                >
                  New Order
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Supplier detail sheet */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="sm:max-w-[420px]">
          {selected && (
            <>
              <SheetHeader className="pb-5 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Building2 className="h-7 w-7 text-accent" />
                  </div>
                  <div>
                    <SheetTitle className="text-lg">{selected.name}</SheetTitle>
                    <Badge variant="secondary" className="mt-1">{selected.category}</Badge>
                  </div>
                </div>
              </SheetHeader>
              <div className="py-5 space-y-4">
                <div className="flex items-center gap-2">
                  <RatingStars rating={selected.rating} />
                  <span className="text-sm text-muted-foreground">supplier rating</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Lead Time", value: selected.leadTime },
                    { label: "Active Orders", value: selected.activeOrders },
                    { label: "Contact", value: selected.contact },
                    { label: "Category", value: selected.category },
                  ].map(item => (
                    <div key={item.label} className="bg-muted/50 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                      <div className="font-semibold text-sm mt-0.5 truncate">{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-border space-y-2">
                  <h4 className="font-semibold text-sm">Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast({ title: `Emailing ${selected.name}` })}>
                      <Mail className="h-3.5 w-3.5" /> Contact
                    </Button>
                    <Button size="sm" className="gap-1.5" onClick={() => toast({ title: "PO created", description: `Order placed with ${selected.name}` })}>
                      <Package className="h-3.5 w-3.5" /> New Order
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

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Package,
  Download,
  ChevronUp,
  ChevronDown,
  Trash2,
  ShoppingCart,
  Archive,
  Square,
  CheckSquare
} from "lucide-react";
import { MOCK_PRODUCTS } from "@/data/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

type SortField = "name" | "quantity" | "unitCost" | "status";
type SortDir = "asc" | "desc";

const STATUS_TABS = [
  { key: "all", label: "All Products" },
  { key: "healthy", label: "In Stock" },
  { key: "low", label: "Low Stock" },
  { key: "critical", label: "Critical" },
];

function StatusBadge({ status }: { status: string }) {
  if (status === "healthy") return <Badge className="bg-teal-500 hover:bg-teal-600 text-white gap-1.5 text-[11px]"><CheckCircle2 className="h-3 w-3" /> In Stock</Badge>;
  if (status === "low") return <Badge className="bg-amber-500 hover:bg-amber-600 text-white gap-1.5 text-[11px]"><AlertTriangle className="h-3 w-3" /> Low Stock</Badge>;
  if (status === "critical") return <Badge variant="destructive" className="gap-1.5 text-[11px]"><XCircle className="h-3 w-3" /> Critical</Badge>;
  return null;
}

function downloadCSV(products: typeof MOCK_PRODUCTS) {
  const headers = ["SKU", "Name", "Category", "Qty", "Reorder At", "Unit Cost ($)", "Total Value ($)", "Status"];
  const rows = products.map(p => [p.sku, p.name, p.category, p.quantity, p.reorderPoint, p.unitCost.toFixed(2), (p.quantity * p.unitCost).toFixed(2), p.status]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "products-export.csv"; a.click();
  URL.revokeObjectURL(url);
}

export default function Products() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusTab, setStatusTab] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<(typeof MOCK_PRODUCTS)[0] | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [sort, setSort] = useState<{ field: SortField; dir: SortDir }>({ field: "name", dir: "asc" });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [newProduct, setNewProduct] = useState({ name: "", sku: "", category: "Electronics", quantity: "", reorderPoint: "", unitCost: "" });

  const filtered = MOCK_PRODUCTS
    .filter(p => {
      const s = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const c = categoryFilter === "all" || p.category === categoryFilter;
      const t = statusTab === "all" || p.status === statusTab;
      return s && c && t;
    })
    .sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1;
      if (sort.field === "name") return a.name.localeCompare(b.name) * dir;
      if (sort.field === "quantity") return (a.quantity - b.quantity) * dir;
      if (sort.field === "unitCost") return (a.unitCost - b.unitCost) * dir;
      return 0;
    });

  const allSelected = filtered.length > 0 && filtered.every(p => selectedIds.has(p.id));
  const someSelected = selectedIds.size > 0;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(p => p.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSort = (field: SortField) => {
    setSort(prev => prev.field === field ? { field, dir: prev.dir === "asc" ? "desc" : "asc" } : { field, dir: "asc" });
  };

  const SortIcon = ({ field }: { field: SortField }) => sort.field === field
    ? sort.dir === "asc" ? <ChevronUp className="h-3 w-3 inline ml-0.5" /> : <ChevronDown className="h-3 w-3 inline ml-0.5" />
    : null;

  const stockPct = (p: (typeof MOCK_PRODUCTS)[0]) => {
    const max = Math.max(p.quantity, p.reorderPoint * 3, 1);
    return Math.min(100, Math.round((p.quantity / max) * 100));
  };

  const selectedProducts = MOCK_PRODUCTS.filter(p => selectedIds.has(p.id));

  const handleBulkExport = () => {
    downloadCSV(selectedProducts);
    toast({ title: `${selectedIds.size} products exported`, description: "CSV downloaded." });
    setSelectedIds(new Set());
  };

  const handleBulkOrder = () => {
    toast({ title: `${selectedIds.size} purchase orders drafted`, description: "POs created for selected products." });
    setSelectedIds(new Set());
  };

  const handleBulkArchive = () => {
    toast({ title: `${selectedIds.size} products archived`, description: "Items moved to archive." });
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1 text-sm">{MOCK_PRODUCTS.length} total SKUs in catalog</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { downloadCSV(filtered); toast({ title: "Export started" }); }} data-testid="button-export">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button size="sm" className="gap-1.5" onClick={() => setAddOpen(true)} data-testid="button-add-product">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => { setStatusTab(tab.key); setSelectedIds(new Set()); }}
            data-testid={`tab-status-${tab.key}`}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
              statusTab === tab.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.key !== "all" && (
              <span className="ml-1.5 text-[10px] bg-muted-foreground/20 px-1.5 py-0.5 rounded-full">
                {MOCK_PRODUCTS.filter(p => p.status === tab.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or SKU..."
            className="pl-9"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            data-testid="input-product-search"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-category">
            <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Furniture">Furniture</SelectItem>
            <SelectItem value="Accessories">Accessories</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk action bar */}
      <AnimatePresence>
        {someSelected && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 bg-accent/10 border border-accent/30 rounded-xl">
              <span className="text-sm font-semibold text-accent">{selectedIds.size} selected</span>
              <div className="flex gap-2 ml-2">
                <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={handleBulkExport} data-testid="button-bulk-export">
                  <Download className="h-3.5 w-3.5" /> Export CSV
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={handleBulkOrder} data-testid="button-bulk-order">
                  <ShoppingCart className="h-3.5 w-3.5" /> Draft POs
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 text-muted-foreground" onClick={handleBulkArchive} data-testid="button-bulk-archive">
                  <Archive className="h-3.5 w-3.5" /> Archive
                </Button>
                <Button size="sm" variant="ghost" className="h-8 text-xs gap-1.5 text-destructive hover:text-destructive" onClick={() => setSelectedIds(new Set())} data-testid="button-bulk-clear">
                  <Trash2 className="h-3.5 w-3.5" /> Clear
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10">
                <button onClick={toggleAll} className="text-muted-foreground hover:text-foreground transition-colors" data-testid="button-select-all">
                  {allSelected ? <CheckSquare className="h-4 w-4 text-accent" /> : <Square className="h-4 w-4" />}
                </button>
              </TableHead>
              <TableHead className="w-[90px]">SKU</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("name")}>
                Name <SortIcon field="name" />
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="w-[180px]">Stock Level</TableHead>
              <TableHead className="text-right cursor-pointer select-none" onClick={() => toggleSort("quantity")}>
                Qty <SortIcon field="quantity" />
              </TableHead>
              <TableHead className="text-right">Reorder At</TableHead>
              <TableHead className="text-right cursor-pointer select-none" onClick={() => toggleSort("unitCost")}>
                Unit Cost <SortIcon field="unitCost" />
              </TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product, i) => {
              const isSelected = selectedIds.has(product.id);
              return (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`cursor-pointer hover:bg-muted/50 transition-colors border-b border-border/60 last:border-0 ${isSelected ? "bg-accent/5" : ""}`}
                  data-testid={`row-product-${product.id}`}
                >
                  <TableCell>
                    <button
                      onClick={e => { e.stopPropagation(); toggleOne(product.id); }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      data-testid={`checkbox-product-${product.id}`}
                    >
                      {isSelected ? <CheckSquare className="h-4 w-4 text-accent" /> : <Square className="h-4 w-4" />}
                    </button>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground" onClick={() => setSelectedProduct(product)}>{product.sku}</TableCell>
                  <TableCell className="font-medium" onClick={() => setSelectedProduct(product)}>{product.name}</TableCell>
                  <TableCell onClick={() => setSelectedProduct(product)}>
                    <Badge variant="secondary" className="text-[11px] font-normal">{product.category}</Badge>
                  </TableCell>
                  <TableCell onClick={() => setSelectedProduct(product)}>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${product.status === "critical" ? "bg-destructive" : product.status === "low" ? "bg-amber-500" : "bg-teal-500"}`}
                          style={{ width: `${stockPct(product)}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-6 text-right">{stockPct(product)}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium" onClick={() => setSelectedProduct(product)}>{product.quantity}</TableCell>
                  <TableCell className="text-right text-muted-foreground" onClick={() => setSelectedProduct(product)}>{product.reorderPoint}</TableCell>
                  <TableCell className="text-right" onClick={() => setSelectedProduct(product)}>${product.unitCost.toFixed(2)}</TableCell>
                  <TableCell onClick={() => setSelectedProduct(product)}><StatusBadge status={product.status} /></TableCell>
                </motion.tr>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  No products match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Footer summary */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/30 text-xs text-muted-foreground">
            <span>{filtered.length} product{filtered.length !== 1 ? "s" : ""} shown</span>
            <span>Total value: <span className="font-semibold text-foreground">${filtered.reduce((a, p) => a + p.quantity * p.unitCost, 0).toLocaleString("en-US", { maximumFractionDigits: 0 })}</span></span>
          </div>
        )}
      </div>

      {/* Product Detail Sheet */}
      <Sheet open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <SheetContent className="sm:max-w-[440px] overflow-y-auto">
          {selectedProduct && (
            <>
              <SheetHeader className="pb-5 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Package className="h-7 w-7 text-accent" />
                  </div>
                  <div>
                    <SheetTitle className="text-lg">{selectedProduct.name}</SheetTitle>
                    <SheetDescription className="font-mono text-xs mt-0.5">{selectedProduct.sku}</SheetDescription>
                    <div className="mt-2"><StatusBadge status={selectedProduct.status} /></div>
                  </div>
                </div>
              </SheetHeader>

              <div className="py-5 space-y-5">
                {/* Stock progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Stock Level</span>
                    <span className="font-medium">{selectedProduct.quantity} / {selectedProduct.maxCapacity ?? selectedProduct.reorderPoint * 3} units</span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stockPct(selectedProduct)}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className={`h-full rounded-full ${selectedProduct.status === "critical" ? "bg-destructive" : selectedProduct.status === "low" ? "bg-amber-500" : "bg-teal-500"}`}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Reorder point: {selectedProduct.reorderPoint}</span>
                    <span>{stockPct(selectedProduct)}% capacity</span>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Category", value: selectedProduct.category },
                    { label: "Unit Cost", value: `$${selectedProduct.unitCost.toFixed(2)}` },
                    { label: "Current Stock", value: `${selectedProduct.quantity} units` },
                    { label: "Reorder Point", value: `${selectedProduct.reorderPoint} units` },
                    { label: "Total Value", value: `$${(selectedProduct.unitCost * selectedProduct.quantity).toFixed(2)}` },
                    { label: "Supplier", value: selectedProduct.supplier || "—" },
                    { label: "Daily Usage", value: `${selectedProduct.dailyUsage ?? "—"} units/day` },
                    { label: "Last Restocked", value: selectedProduct.lastRestocked || "—" },
                  ].map(item => (
                    <div key={item.label} className="bg-muted/50 rounded-lg p-3 space-y-0.5">
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                      <div className="font-semibold text-sm">{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Days until stockout */}
                {selectedProduct.dailyUsage > 0 && (
                  <div className={`rounded-lg p-3 border ${
                    Math.floor(selectedProduct.quantity / selectedProduct.dailyUsage) <= 5
                      ? "border-destructive/30 bg-destructive/5"
                      : "border-border bg-muted/30"
                  }`}>
                    <div className="text-xs text-muted-foreground mb-1">Estimated Days Until Stockout</div>
                    <div className={`text-2xl font-bold ${Math.floor(selectedProduct.quantity / selectedProduct.dailyUsage) <= 5 ? "text-destructive" : "text-foreground"}`}>
                      {selectedProduct.quantity === 0 ? "Out of stock" : `${Math.floor(selectedProduct.quantity / selectedProduct.dailyUsage)} days`}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <h4 className="font-semibold text-sm">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => toast({ title: "Edit mode", description: `Editing ${selectedProduct.name}` })} data-testid="button-edit-product">Edit Details</Button>
                    <Button size="sm" className="w-full" onClick={() => toast({ title: "Order drafted", description: `PO created for ${selectedProduct.name}` })} data-testid="button-create-order">Create PO</Button>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => toast({ title: "Stock adjusted", description: "Quantity updated." })} data-testid="button-adjust-stock">Adjust Stock</Button>
                    <Button variant="destructive" size="sm" className="w-full" data-testid="button-delete-product">Archive</Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Product Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Product Name</Label>
                <Input id="new-name" placeholder="e.g. Wireless Headphones" value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} data-testid="input-new-name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-sku">SKU</Label>
                <Input id="new-sku" placeholder="e.g. SKU-2001" value={newProduct.sku} onChange={e => setNewProduct(p => ({ ...p, sku: e.target.value }))} data-testid="input-new-sku" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={newProduct.category} onValueChange={v => setNewProduct(p => ({ ...p, category: v }))}>
                <SelectTrigger data-testid="select-new-category"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-qty">Quantity</Label>
                <Input id="new-qty" type="number" placeholder="0" value={newProduct.quantity} onChange={e => setNewProduct(p => ({ ...p, quantity: e.target.value }))} data-testid="input-new-quantity" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-reorder">Reorder At</Label>
                <Input id="new-reorder" type="number" placeholder="0" value={newProduct.reorderPoint} onChange={e => setNewProduct(p => ({ ...p, reorderPoint: e.target.value }))} data-testid="input-new-reorder" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-cost">Unit Cost ($)</Label>
                <Input id="new-cost" type="number" placeholder="0.00" value={newProduct.unitCost} onChange={e => setNewProduct(p => ({ ...p, unitCost: e.target.value }))} data-testid="input-new-cost" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              toast({ title: "Product added", description: `${newProduct.name || "New product"} added to catalog.` });
              setAddOpen(false);
              setNewProduct({ name: "", sku: "", category: "Electronics", quantity: "", reorderPoint: "", unitCost: "" });
            }} data-testid="button-confirm-add">Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

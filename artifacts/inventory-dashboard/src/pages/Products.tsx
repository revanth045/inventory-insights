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
  ChevronDown
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
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
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

export default function Products() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusTab, setStatusTab] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<(typeof MOCK_PRODUCTS)[0] | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [sort, setSort] = useState<{ field: SortField; dir: SortDir }>({ field: "name", dir: "asc" });

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1 text-sm">{MOCK_PRODUCTS.length} total SKUs in catalog</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast({ title: "Export started", description: "CSV will download shortly." })} data-testid="button-export">
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
            onClick={() => setStatusTab(tab.key)}
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

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px]">SKU</TableHead>
              <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("name")}>
                Name <SortIcon field="name" />
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="w-[200px]">Stock Level</TableHead>
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
            {filtered.map((product, i) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="cursor-pointer hover:bg-muted/50 transition-colors border-b border-border/60 last:border-0"
                onClick={() => setSelectedProduct(product)}
                data-testid={`row-product-${product.id}`}
              >
                <TableCell className="font-mono text-xs text-muted-foreground">{product.sku}</TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[11px] font-normal">{product.category}</Badge>
                </TableCell>
                <TableCell>
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
                <TableCell className="text-right font-medium">{product.quantity}</TableCell>
                <TableCell className="text-right text-muted-foreground">{product.reorderPoint}</TableCell>
                <TableCell className="text-right">${product.unitCost.toFixed(2)}</TableCell>
                <TableCell><StatusBadge status={product.status} /></TableCell>
              </motion.tr>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  No products match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
                    <span className="font-medium">{selectedProduct.quantity} / {selectedProduct.reorderPoint * 3} units</span>
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
                    { label: "Supplier", value: "TechSource Global" },
                  ].map(item => (
                    <div key={item.label} className="bg-muted/50 rounded-lg p-3 space-y-0.5">
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                      <div className="font-semibold text-sm">{item.value}</div>
                    </div>
                  ))}
                </div>

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
                <SelectTrigger data-testid="select-new-category">
                  <SelectValue />
                </SelectTrigger>
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

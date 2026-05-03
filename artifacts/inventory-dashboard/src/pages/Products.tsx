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
  Package
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

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-teal-500 hover:bg-teal-600 text-white flex w-max gap-1.5"><CheckCircle2 className="h-3 w-3" /> In Stock</Badge>;
      case "low":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white flex w-max gap-1.5"><AlertTriangle className="h-3 w-3" /> Low Stock</Badge>;
      case "critical":
        return <Badge variant="destructive" className="flex w-max gap-1.5"><XCircle className="h-3 w-3" /> Critical</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your inventory catalog</p>
        </div>
        <Button className="shrink-0 gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border border-border">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search SKU or name..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
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
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Reorder At</TableHead>
              <TableHead className="text-right">Unit Cost</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow 
                key={product.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedProduct(product)}
              >
                <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right font-medium">{product.quantity}</TableCell>
                <TableCell className="text-right text-muted-foreground">{product.reorderPoint}</TableCell>
                <TableCell className="text-right">${product.unitCost.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(product.status)}</TableCell>
              </TableRow>
            ))}
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {selectedProduct && (
            <>
              <SheetHeader className="pb-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <SheetTitle className="text-xl">{selectedProduct.name}</SheetTitle>
                    <SheetDescription className="font-mono mt-1">{selectedProduct.sku}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              
              <div className="py-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <div>{getStatusBadge(selectedProduct.status)}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <div className="font-medium">{selectedProduct.category}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Current Stock</span>
                    <div className="font-medium text-lg">{selectedProduct.quantity} units</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Reorder Point</span>
                    <div className="font-medium text-lg">{selectedProduct.reorderPoint} units</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Unit Cost</span>
                    <div className="font-medium text-lg">${selectedProduct.unitCost.toFixed(2)}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-muted-foreground">Total Value</span>
                    <div className="font-medium text-lg">${(selectedProduct.unitCost * selectedProduct.quantity).toFixed(2)}</div>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-border">
                  <h4 className="font-semibold">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full">Edit Details</Button>
                    <Button className="w-full">Create Order</Button>
                    <Button variant="outline" className="w-full">Adjust Stock</Button>
                    <Button variant="destructive" className="w-full">Delete</Button>
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

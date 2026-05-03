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
import { Progress } from "@/components/ui/progress";
import { MOCK_PRODUCTS } from "@/data/mockData";
import { AlertTriangle, TrendingDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Stock() {
  const needsReorder = MOCK_PRODUCTS.filter(p => p.quantity <= p.reorderPoint);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Levels</h1>
          <p className="text-muted-foreground mt-1">Monitor capacity and restock alerts</p>
        </div>
        <Button variant="outline" className="shrink-0 gap-2">
          <RefreshCw className="h-4 w-4" /> Sync ERP
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Capacity Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="w-[40%]">Capacity Status</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_PRODUCTS.map((product) => {
                    const capacityMax = Math.max(product.quantity, product.reorderPoint * 3);
                    const percentage = Math.min(100, Math.max(0, (product.quantity / capacityMax) * 100));
                    
                    let progressColor = "bg-teal-500";
                    if (product.status === 'low') progressColor = "bg-amber-500";
                    if (product.status === 'critical') progressColor = "bg-destructive";

                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground">{product.sku}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${progressColor} transition-all duration-500`} 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                              <span>0</span>
                              <span>Target: {capacityMax}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {product.quantity}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-destructive/30 shadow-sm">
            <CardHeader className="bg-destructive/5 border-b border-border">
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Action Required
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {needsReorder.map(product => (
                  <div key={product.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-sm">{product.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <TrendingDown className="h-3 w-3 text-destructive" />
                          Below reorder point ({product.reorderPoint})
                        </div>
                      </div>
                      <div className="font-bold text-destructive">{product.quantity} left</div>
                    </div>
                    <Button size="sm" className="w-full mt-3">Draft PO</Button>
                  </div>
                ))}
                {needsReorder.length === 0 && (
                  <div className="p-6 text-center text-muted-foreground">
                    All stock levels are healthy.
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

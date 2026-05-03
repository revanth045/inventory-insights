import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MOCK_ORDERS } from "@/data/mockData";
import { Clock, CheckCircle2, RefreshCw, XCircle, Truck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Orders() {
  const getOrderStatus = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-teal-500 hover:bg-teal-600 text-white flex w-max gap-1.5"><CheckCircle2 className="h-3 w-3" /> Delivered</Badge>;
      case "processing":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white flex w-max gap-1.5"><RefreshCw className="h-3 w-3" /> Processing</Badge>;
      case "pending":
        return <Badge className="bg-slate-500 hover:bg-slate-600 text-white flex w-max gap-1.5"><Clock className="h-3 w-3" /> Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive" className="flex w-max gap-1.5"><XCircle className="h-3 w-3" /> Cancelled</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage purchase orders and inbound shipments</p>
        </div>
        <Button className="shrink-0 gap-2">
          <Plus className="h-4 w-4" /> New Order
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Expected</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Total Value</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_ORDERS.map((order) => (
              <TableRow key={order.id} className="hover:bg-muted/50 cursor-pointer">
                <TableCell className="font-mono font-medium">{order.id}</TableCell>
                <TableCell className="font-medium">{order.supplier}</TableCell>
                <TableCell className="text-muted-foreground">{order.date}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Truck className="h-3 w-3" />
                    {order.expected}
                  </div>
                </TableCell>
                <TableCell className="text-right">{order.items}</TableCell>
                <TableCell className="text-right font-medium">${order.value.toFixed(2)}</TableCell>
                <TableCell>{getOrderStatus(order.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

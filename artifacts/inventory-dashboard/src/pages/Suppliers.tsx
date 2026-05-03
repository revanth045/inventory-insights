import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_SUPPLIERS } from "@/data/mockData";
import { Star, Mail, Truck, Package, Building2 } from "lucide-react";

export default function Suppliers() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground mt-1">Manage vendor relationships and performance</p>
        </div>
        <Button className="shrink-0">Add Supplier</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {MOCK_SUPPLIERS.map((supplier) => (
          <Card key={supplier.id} className="hover-elevate transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">{supplier.category}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-muted-foreground flex items-center gap-1">
                    <Truck className="w-4 h-4" /> Lead Time
                  </div>
                  <div className="font-medium">{supplier.leadTime}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Rating
                  </div>
                  <div className="font-medium">{supplier.rating} / 5.0</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground flex items-center gap-1">
                    <Package className="w-4 h-4" /> Active Orders
                  </div>
                  <div className="font-medium">{supplier.activeOrders}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground flex items-center gap-1">
                    <Mail className="w-4 h-4" /> Contact
                  </div>
                  <a href={`mailto:${supplier.contact}`} className="font-medium text-primary hover:underline truncate block">
                    Email
                  </a>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t border-border">
              <Button variant="outline" className="w-full">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

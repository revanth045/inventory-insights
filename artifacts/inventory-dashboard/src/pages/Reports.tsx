import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Clock,
  Loader2
} from "lucide-react";
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_SUPPLIERS } from "@/data/mockData";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

type ReportType = "inventory-summary" | "low-stock" | "order-history" | "supplier-performance" | "valuation";

const REPORT_TYPES: { value: ReportType; label: string; description: string; icon: React.ElementType; color: string }[] = [
  { value: "inventory-summary", label: "Inventory Summary", description: "Full list of all SKUs with quantities, status and value", icon: Package, color: "text-accent" },
  { value: "low-stock", label: "Low Stock Report", description: "Items at or below reorder point requiring action", icon: FileText, color: "text-amber-500" },
  { value: "order-history", label: "Order History", description: "All purchase orders with status and value breakdown", icon: ShoppingCart, color: "text-blue-500" },
  { value: "supplier-performance", label: "Supplier Performance", description: "Supplier ratings, lead times and delivery rates", icon: Users, color: "text-purple-500" },
  { value: "valuation", label: "Inventory Valuation", description: "Total asset value by category and supplier", icon: BarChart3, color: "text-teal-500" },
];

const DATE_RANGES = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 3 months" },
  { value: "365", label: "Last year" },
];

type RecentReport = {
  id: string;
  name: string;
  type: ReportType;
  date: string;
  rows: number;
  size: string;
};

const RECENT: RecentReport[] = [
  { id: "r1", name: "Inventory Summary — Apr 2026", type: "inventory-summary", date: "May 2, 2026", rows: 12, size: "8.4 KB" },
  { id: "r2", name: "Low Stock Report — Apr 2026", type: "low-stock", date: "Apr 28, 2026", rows: 4, size: "2.1 KB" },
  { id: "r3", name: "Order History — Q1 2026", type: "order-history", date: "Apr 1, 2026", rows: 10, size: "5.7 KB" },
];

function generateCSV(type: ReportType): string {
  if (type === "inventory-summary") {
    const headers = ["SKU", "Name", "Category", "Quantity", "Reorder Point", "Unit Cost ($)", "Total Value ($)", "Status", "Supplier"];
    const rows = MOCK_PRODUCTS.map(p => [
      p.sku, p.name, p.category, p.quantity, p.reorderPoint,
      p.unitCost.toFixed(2), (p.quantity * p.unitCost).toFixed(2), p.status, p.supplier
    ]);
    return [headers, ...rows].map(r => r.join(",")).join("\n");
  }
  if (type === "low-stock") {
    const headers = ["SKU", "Name", "Category", "Current Qty", "Reorder Point", "Shortfall", "Status", "Supplier"];
    const rows = MOCK_PRODUCTS.filter(p => p.status !== "healthy").map(p => [
      p.sku, p.name, p.category, p.quantity, p.reorderPoint,
      Math.max(0, p.reorderPoint - p.quantity), p.status, p.supplier
    ]);
    return [headers, ...rows].map(r => r.join(",")).join("\n");
  }
  if (type === "order-history") {
    const headers = ["Order ID", "Supplier", "Status", "Order Date", "Expected Date", "Items", "Value ($)"];
    const rows = MOCK_ORDERS.map(o => [o.id, o.supplier, o.status, o.date, o.expected, o.items, o.value.toFixed(2)]);
    return [headers, ...rows].map(r => r.join(",")).join("\n");
  }
  if (type === "supplier-performance") {
    const headers = ["Supplier", "Category", "Country", "Rating", "Lead Time", "Active Orders", "On-Time Delivery (%)"];
    const rows = MOCK_SUPPLIERS.map(s => [s.name, s.category, s.country, s.rating, s.leadTime, s.activeOrders, s.onTimeDelivery]);
    return [headers, ...rows].map(r => r.join(",")).join("\n");
  }
  if (type === "valuation") {
    const headers = ["Category", "SKU Count", "Total Units", "Total Value ($)", "Avg Unit Cost ($)"];
    const cats: Record<string, { count: number; units: number; value: number }> = {};
    MOCK_PRODUCTS.forEach(p => {
      if (!cats[p.category]) cats[p.category] = { count: 0, units: 0, value: 0 };
      cats[p.category].count++;
      cats[p.category].units += p.quantity;
      cats[p.category].value += p.quantity * p.unitCost;
    });
    const rows = Object.entries(cats).map(([cat, d]) => [
      cat, d.count, d.units, d.value.toFixed(2), (d.value / d.units || 0).toFixed(2)
    ]);
    return [headers, ...rows].map(r => r.join(",")).join("\n");
  }
  return "";
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<ReportType>("inventory-summary");
  const [dateRange, setDateRange] = useState("30");
  const [generating, setGenerating] = useState(false);

  const selected = REPORT_TYPES.find(r => r.value === selectedType)!;

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const csv = generateCSV(selectedType);
      const today = new Date().toISOString().split("T")[0];
      downloadCSV(csv, `${selectedType}-${today}.csv`);
      setGenerating(false);
      toast({ title: "Report downloaded", description: `${selected.label} exported as CSV` });
    }, 900);
  };

  const totalValue = MOCK_PRODUCTS.reduce((a, p) => a + p.quantity * p.unitCost, 0);
  const previewRows = selectedType === "inventory-summary" ? MOCK_PRODUCTS.length
    : selectedType === "low-stock" ? MOCK_PRODUCTS.filter(p => p.status !== "healthy").length
    : selectedType === "order-history" ? MOCK_ORDERS.length
    : selectedType === "supplier-performance" ? MOCK_SUPPLIERS.length
    : 4;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground mt-1 text-sm">Generate and export inventory reports as CSV</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total SKUs", value: MOCK_PRODUCTS.length },
          { label: "Inventory Value", value: `$${(totalValue / 1000).toFixed(0)}k` },
          { label: "Active Orders", value: MOCK_ORDERS.filter(o => o.status !== "delivered" && o.status !== "cancelled").length },
          { label: "Reports Generated", value: "14" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs text-muted-foreground">{s.label}</div>
            <div className="text-2xl font-bold mt-1">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Report builder */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Generate Report</CardTitle>
              <CardDescription>Select a report type and date range, then export as CSV</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Report type selection */}
              <div className="grid gap-3">
                {REPORT_TYPES.map((type, i) => (
                  <motion.button
                    key={type.value}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => setSelectedType(type.value)}
                    data-testid={`report-type-${type.value}`}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                      selectedType === type.value
                        ? "border-accent bg-accent/5 shadow-sm"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${selectedType === type.value ? "bg-accent/15" : "bg-muted"} shrink-0 mt-0.5`}>
                      <type.icon className={`h-4 w-4 ${selectedType === type.value ? "text-accent" : type.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm flex items-center gap-2">
                        {type.label}
                        {selectedType === type.value && <Badge className="bg-accent text-white text-[10px]">Selected</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{type.description}</div>
                    </div>
                    {selectedType === type.value && <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />}
                  </motion.button>
                ))}
              </div>

              {/* Date range */}
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-[180px]" data-testid="select-date-range">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DATE_RANGES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">· {previewRows} rows estimated</span>
              </div>

              {/* Generate button */}
              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full gap-2"
                size="lg"
                data-testid="button-generate-report"
              >
                {generating ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
                ) : (
                  <><Download className="h-4 w-4" /> Download {selected.label} CSV</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent reports */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Reports</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {RECENT.map((r, i) => {
                  const rt = REPORT_TYPES.find(t => t.value === r.type)!;
                  return (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      className="p-4 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded-md bg-muted shrink-0 mt-0.5">
                          <rt.icon className={`h-3.5 w-3.5 ${rt.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium leading-tight truncate">{r.name}</div>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {r.date}</span>
                            <span>· {r.rows} rows</span>
                            <span>· {r.size}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-3 h-7 text-xs gap-1.5"
                        onClick={() => {
                          const csv = generateCSV(r.type);
                          downloadCSV(csv, `${r.type}-redownload.csv`);
                          toast({ title: "Report re-downloaded" });
                        }}
                        data-testid={`button-redownload-${r.id}`}
                      >
                        <Download className="h-3 w-3" /> Re-download
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

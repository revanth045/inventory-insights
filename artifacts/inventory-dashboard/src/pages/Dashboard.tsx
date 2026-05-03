import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Package,
  TrendingUp,
  AlertCircle,
  ShoppingCart,
  ArrowRight,
  Clock,
  Truck,
  Plus,
  RefreshCw,
  BarChart3,
  Trophy,
  Download,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadialBarChart,
  RadialBar
} from "recharts";
import { MOCK_PRODUCTS, MOCK_ORDERS } from "@/data/mockData";
import { motion } from "framer-motion";
import { Link } from "wouter";

const TREND_DATA = [
  { name: "Mon", value: 4000 },
  { name: "Tue", value: 3200 },
  { name: "Wed", value: 5100 },
  { name: "Thu", value: 4600 },
  { name: "Fri", value: 5800 },
  { name: "Sat", value: 4900 },
  { name: "Sun", value: 6200 },
];

const CATEGORY_DATA = [
  { name: "Electronics", value: 45 },
  { name: "Furniture", value: 25 },
  { name: "Accessories", value: 20 },
  { name: "Apparel", value: 10 },
];
const PIE_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

const ACTIVITY = [
  { icon: CheckCircle2, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-950/40", label: "ORD-501 delivered", sub: "TechSource Global · 150 items", time: "10 min ago" },
  { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/40", label: "Office Chair low stock", sub: "12 units remaining · Reorder at 20", time: "32 min ago" },
  { icon: Truck, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/40", label: "ORD-508 dispatched", sub: "TechSource Global · ETA May 5", time: "1 hr ago" },
  { icon: XCircle, color: "text-destructive", bg: "bg-destructive/5", label: "Standing Desk critical", sub: "3 units left · Reorder required", time: "2 hr ago" },
  { icon: Plus, color: "text-accent", bg: "bg-accent/10", label: "New supplier approved", sub: "ElectroDepot added to network", time: "1 day ago" },
];

const QUICK_ACTIONS = [
  { label: "New Order", icon: ShoppingCart, href: "/orders", variant: "default" as const },
  { label: "Add Product", icon: Plus, href: "/products", variant: "outline" as const },
  { label: "View Alerts", icon: AlertCircle, href: "/stock", variant: "outline" as const },
  { label: "Analytics", icon: BarChart3, href: "/analytics", variant: "outline" as const },
];

function AnimatedCounter({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const duration = 900;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * to));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to]);
  return <>{prefix}{val.toLocaleString()}{suffix}</>;
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35 } }),
};

function HealthRing({ score }: { score: number }) {
  const color = score >= 75 ? "hsl(var(--chart-1))" : score >= 50 ? "hsl(var(--chart-2))" : "hsl(var(--chart-3))";
  const label = score >= 75 ? "Excellent" : score >= 50 ? "Fair" : "Needs Attention";
  const data = [{ value: score, fill: color }, { value: 100 - score, fill: "hsl(var(--muted))" }];
  return (
    <div className="relative h-[180px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="62%" outerRadius="85%" startAngle={210} endAngle={-30} data={data}>
          <RadialBar dataKey="value" cornerRadius={6} background={false} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold">{score}%</div>
        <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const criticalItems = MOCK_PRODUCTS.filter(p => p.status === "critical").length;
  const lowItems = MOCK_PRODUCTS.filter(p => p.status === "low").length;
  const healthyItems = MOCK_PRODUCTS.filter(p => p.status === "healthy").length;
  const pendingOrders = MOCK_ORDERS.filter(o => o.status === "pending" || o.status === "processing").length;
  const totalValue = MOCK_PRODUCTS.reduce((acc, p) => acc + p.quantity * p.unitCost, 0);
  const healthScore = Math.round((healthyItems / MOCK_PRODUCTS.length) * 100);

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchCategory && matchStatus;
  });

  const filteredValue = filteredProducts.reduce((acc, p) => acc + p.quantity * p.unitCost, 0);
  const filteredHealthy = filteredProducts.filter(p => p.status === "healthy").length;
  const filteredHealth = filteredProducts.length ? Math.round((filteredHealthy / filteredProducts.length) * 100) : 0;

  // Top 5 products by total value
  const topProducts = [...filteredProducts]
    .map(p => ({ ...p, totalValue: p.quantity * p.unitCost }))
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5);

  const exportDashboardData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      filter: { category: categoryFilter, status: statusFilter },
      summary: {
        totalSkus: filteredProducts.length,
        inventoryValue: filteredValue,
        healthScore: filteredHealth,
        criticalItems: filteredProducts.filter(p => p.status === "critical").length,
        lowItems: filteredProducts.filter(p => p.status === "low").length,
      }
    };
    const csv = "Dashboard Export\n" + new Date().toLocaleString() + "\n\n" +
      `Category Filter: ${categoryFilter}\nStatus Filter: ${statusFilter}\n\n` +
      `Total SKUs: ${data.summary.totalSkus}\nInventory Value: $${filteredValue.toLocaleString()}\nHealth Score: ${filteredHealth}%\n` +
      `Critical Items: ${data.summary.criticalItems}\nLow Items: ${data.summary.lowItems}\n\nTop 5 Products\n` +
      topProducts.map(p => `${p.name},${p.quantity},$${p.totalValue.toFixed(2)}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="space-y-6">
      {/* Welcome banner + filters */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{greeting}, Alex</h1>
            <p className="text-muted-foreground mt-1 text-sm">{dateStr} — Here's what's happening in your warehouse.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map(action => (
              <Link key={action.label} href={action.href}>
                <Button variant={action.variant} size="sm" className="gap-1.5 text-xs" data-testid={`button-quick-${action.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  <action.icon className="h-3.5 w-3.5" />
                  {action.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Filters + Export */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex gap-2 flex-wrap">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px] h-9" data-testid="select-dashboard-category">
                <Filter className="h-4 w-4 mr-2" /><SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Furniture">Furniture</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] h-9" data-testid="select-dashboard-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="healthy">Healthy</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 h-9 text-xs" onClick={exportDashboardData} data-testid="button-export-dashboard">
            <Download className="h-3.5 w-3.5" /> Export View
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total SKUs",
            value: filteredProducts.length,
            prefix: "", suffix: "",
            sub: `${categoryFilter !== "all" ? "Filtered: " : ""}${filteredProducts.length} visible`,
            subColor: "text-teal-600 dark:text-teal-400",
            icon: Package, iconColor: "text-accent", iconBg: "bg-accent/10",
            href: "/products",
          },
          {
            title: "Inventory Value",
            value: Math.round(filteredValue / 1000),
            prefix: "$", suffix: "k",
            sub: `${statusFilter !== "all" ? "Filtered" : "Total"} value in view`,
            subColor: "text-teal-600 dark:text-teal-400",
            icon: TrendingUp, iconColor: "text-blue-500", iconBg: "bg-blue-50 dark:bg-blue-950/40",
            href: "/analytics",
          },
          {
            title: "Stock Alerts",
            value: filteredProducts.filter(p => p.status !== "healthy").length,
            prefix: "", suffix: "",
            sub: `${filteredProducts.filter(p => p.status === "critical").length} critical in view`,
            subColor: "text-destructive",
            icon: AlertCircle, iconColor: "text-destructive", iconBg: "bg-destructive/10",
            href: "/stock",
            alert: filteredProducts.filter(p => p.status !== "healthy").length > 0,
          },
          {
            title: "Orders Pending",
            value: pendingOrders,
            prefix: "", suffix: "",
            sub: "Requires action today",
            subColor: "text-amber-600 dark:text-amber-400",
            icon: ShoppingCart, iconColor: "text-amber-500", iconBg: "bg-amber-50 dark:bg-amber-950/40",
            href: "/orders",
          },
        ].map((card, i) => (
          <motion.div key={card.title} custom={i} variants={cardVariants} initial="hidden" animate="visible">
            <Link href={card.href}>
              <Card className={`cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 ${card.alert ? "border-destructive/30 bg-destructive/5" : ""}`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className={`text-sm font-medium ${card.alert ? "text-destructive" : "text-muted-foreground"}`}>{card.title}</CardTitle>
                  <div className={`p-1.5 rounded-md ${card.iconBg}`}>
                    <card.icon className={`h-4 w-4 ${card.iconColor}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${card.alert ? "text-destructive" : ""}`}>
                    <AnimatedCounter to={card.value} prefix={card.prefix} suffix={card.suffix} />
                  </div>
                  <p className={`text-xs mt-1 ${card.subColor}`}>{card.sub}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-7">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }} className="lg:col-span-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Inventory Value Trend</CardTitle>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">This week</span>
            </CardHeader>
            <CardContent className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND_DATA}>
                  <defs>
                    <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }}
                    formatter={(v: number) => [`$${v.toLocaleString()}`, "Value"]}
                  />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={2.5} fill="url(#trendGrad)" dot={{ r: 3, strokeWidth: 0, fill: "hsl(var(--accent))" }} activeDot={{ r: 5, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Inventory Health Score */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.4 }} className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" /> Inventory Health Score
                {(categoryFilter !== "all" || statusFilter !== "all") && (
                  <Badge variant="secondary" className="ml-auto text-[10px]">Filtered</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <HealthRing score={filteredHealth} />
              <div className="grid grid-cols-3 gap-2 mt-1">
                {[
                  { label: "In Stock", count: filteredProducts.filter(p => p.status === "healthy").length, color: "bg-chart-1" },
                  { label: "Low", count: filteredProducts.filter(p => p.status === "low").length, color: "bg-chart-2" },
                  { label: "Critical", count: filteredProducts.filter(p => p.status === "critical").length, color: "bg-chart-3" },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className={`h-1.5 rounded-full ${s.color} mb-1`} />
                    <div className="text-lg font-bold">{s.count}</div>
                    <div className="text-[10px] text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top products + Activity + Attention */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top products by value */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38, duration: 0.4 }}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Top Products by Value</CardTitle>
              <Link href="/products">
                <Button variant="ghost" size="sm" className="text-xs gap-1">View all <ArrowRight className="h-3 w-3" /></Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/60">
                {topProducts.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.42 + i * 0.06 }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                      i === 0 ? "bg-amber-400 text-amber-900" : i === 1 ? "bg-muted-foreground/20 text-muted-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.quantity} units</div>
                    </div>
                    <div className="text-sm font-semibold shrink-0">${(p.totalValue / 1000).toFixed(1)}k</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity feed */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1">
                <RefreshCw className="h-3 w-3" /> Refresh
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {ACTIVITY.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + i * 0.06 }}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-default"
                  >
                    <div className={`p-1.5 rounded-md ${item.bg} shrink-0 mt-0.5`}>
                      <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium leading-none">{item.label}</div>
                      <div className="text-xs text-muted-foreground mt-1 truncate">{item.sub}</div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground shrink-0">
                      <Clock className="h-3 w-3" /> {item.time}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Needs attention */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.4 }}>
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Needs Attention</CardTitle>
              <Link href="/stock">
                <Button variant="ghost" size="sm" className="text-xs gap-1">View all <ArrowRight className="h-3 w-3" /></Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {MOCK_PRODUCTS.filter(p => p.status !== "healthy").map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.06 }}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center shrink-0">
                        <Package className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-xs truncate">{product.name}</div>
                        <div className="text-[10px] text-muted-foreground">{product.quantity} / {product.reorderPoint} units</div>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {product.status === "critical" && (
                        <Badge variant="destructive" className="flex gap-1 text-[10px]">
                          <XCircle className="h-2.5 w-2.5" /> Critical
                        </Badge>
                      )}
                      {product.status === "low" && (
                        <Badge className="bg-amber-500 text-white text-[10px] flex gap-1">
                          <AlertTriangle className="h-2.5 w-2.5" /> Low
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

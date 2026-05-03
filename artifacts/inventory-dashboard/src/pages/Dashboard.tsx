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
  Users
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
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
  { icon: Truck, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/40", label: "ORD-508 dispatched", sub: "TechSource Global · ETA Nov 3", time: "1 hr ago" },
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

export default function Dashboard() {
  const criticalItems = MOCK_PRODUCTS.filter(p => p.status === "critical").length;
  const lowItems = MOCK_PRODUCTS.filter(p => p.status === "low").length;
  const pendingOrders = MOCK_ORDERS.filter(o => o.status === "pending" || o.status === "processing").length;
  const totalValue = MOCK_PRODUCTS.reduce((acc, p) => acc + p.quantity * p.unitCost, 0);

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {greeting}, Alex
          </h1>
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
      </motion.div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total SKUs",
            value: 1248,
            prefix: "",
            suffix: "",
            sub: "+12% from last month",
            subColor: "text-teal-600 dark:text-teal-400",
            icon: Package,
            iconColor: "text-accent",
            iconBg: "bg-accent/10",
            href: "/products",
          },
          {
            title: "Inventory Value",
            value: Math.round(totalValue / 1000),
            prefix: "$",
            suffix: "k",
            sub: "+4.1% from last month",
            subColor: "text-teal-600 dark:text-teal-400",
            icon: TrendingUp,
            iconColor: "text-blue-500",
            iconBg: "bg-blue-50 dark:bg-blue-950/40",
            href: "/analytics",
          },
          {
            title: "Stock Alerts",
            value: criticalItems + lowItems,
            prefix: "",
            suffix: "",
            sub: `${criticalItems} critical, ${lowItems} low`,
            subColor: "text-destructive",
            icon: AlertCircle,
            iconColor: "text-destructive",
            iconBg: "bg-destructive/10",
            href: "/stock",
            alert: true,
          },
          {
            title: "Orders Pending",
            value: pendingOrders,
            prefix: "",
            suffix: "",
            sub: "4 require action today",
            subColor: "text-amber-600 dark:text-amber-400",
            icon: ShoppingCart,
            iconColor: "text-amber-500",
            iconBg: "bg-amber-50 dark:bg-amber-950/40",
            href: "/orders",
          },
        ].map((card, i) => (
          <motion.div key={card.title} custom={i} variants={cardVariants} initial="hidden" animate="visible">
            <Link href={card.href}>
              <Card className={`cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group ${card.alert ? "border-destructive/30 bg-destructive/5" : ""}`}>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="lg:col-span-4"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Inventory Value Trend</CardTitle>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">This week</span>
            </CardHeader>
            <CardContent className="h-[260px]">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="lg:col-span-3"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Category Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {CATEGORY_DATA.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }}
                    formatter={(v: number) => [`${v}%`, "Share"]}
                  />
                  <Legend verticalAlign="bottom" height={36} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom row: Activity + Attention */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
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
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-default"
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

        {/* Products needing attention */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Needs Attention</CardTitle>
              <Link href="/stock">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {MOCK_PRODUCTS.filter(p => p.status !== "healthy").map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.06 }}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.quantity} / {product.reorderPoint} units</div>
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

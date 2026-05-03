import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Package, ShoppingCart, AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MOCK_PRODUCTS } from "@/data/mockData";

const DATE_RANGES = ["Week", "Month", "Quarter", "Year"];

const TURNOVER_DATA = [
  { month: "Jan", rate: 2.4 },
  { month: "Feb", rate: 2.8 },
  { month: "Mar", rate: 3.2 },
  { month: "Apr", rate: 3.1 },
  { month: "May", rate: 3.5 },
  { month: "Jun", rate: 4.0 },
];

const VALUE_DATA = [
  { month: "Jan", value: 800000 },
  { month: "Feb", value: 850000 },
  { month: "Mar", value: 750000 },
  { month: "Apr", value: 900000 },
  { month: "May", value: 1100000 },
  { month: "Jun", value: 1200000 },
];

const CATEGORY_DATA = [
  { name: "Electronics", value: 45 },
  { name: "Furniture", value: 25 },
  { name: "Accessories", value: 20 },
  { name: "Apparel", value: 10 },
];

const SUPPLIER_DATA = [
  { name: "AccessoryHub", onTime: 98 },
  { name: "TechSource", onTime: 95 },
  { name: "ElectroDepot", onTime: 91 },
  { name: "FurniPro", onTime: 78 },
];

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

const METRICS = [
  { label: "Avg Turnover Rate", value: "3.5x", change: "+0.5x", up: true, icon: TrendingUp },
  { label: "Total Stock Value", value: "$64k", change: "+$2.6k", up: true, icon: Package },
  { label: "Orders This Month", value: "24", change: "+6", up: true, icon: ShoppingCart },
  { label: "Stockout Events", value: "2", change: "-1", up: false, icon: TrendingDown },
];

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: 12,
};

// Build stockout forecast from mockData
function buildForecast() {
  const today = new Date();
  return MOCK_PRODUCTS
    .filter(p => p.dailyUsage > 0)
    .map(p => {
      const daysLeft = Math.floor(p.quantity / p.dailyUsage);
      const stockoutDate = new Date(today);
      stockoutDate.setDate(today.getDate() + daysLeft);
      const urgency = daysLeft === 0 ? "out" : daysLeft <= 5 ? "critical" : daysLeft <= 14 ? "warning" : "ok";
      return { ...p, daysLeft, stockoutDate, urgency };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

function UrgencyBadge({ urgency, days }: { urgency: string; days: number }) {
  if (urgency === "out") return <Badge variant="destructive" className="gap-1 text-[11px]"><XCircle className="h-2.5 w-2.5" /> Out of Stock</Badge>;
  if (urgency === "critical") return <Badge variant="destructive" className="gap-1 text-[11px]"><AlertTriangle className="h-2.5 w-2.5" /> {days}d left</Badge>;
  if (urgency === "warning") return <Badge className="bg-amber-500 text-white gap-1 text-[11px]"><AlertTriangle className="h-2.5 w-2.5" /> {days}d left</Badge>;
  return <Badge className="bg-teal-500 text-white gap-1 text-[11px]"><CheckCircle2 className="h-2.5 w-2.5" /> {days}d left</Badge>;
}

export default function Analytics() {
  const [range, setRange] = useState("Month");
  const forecast = buildForecast();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1 text-sm">Performance metrics and historical data</p>
        </div>
        <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
          {DATE_RANGES.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              data-testid={`tab-range-${r.toLowerCase()}`}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
                range === r
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card className="hover:shadow-sm transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground">{m.label}</CardTitle>
                <div className={`p-1.5 rounded-md ${m.up ? "bg-teal-50 dark:bg-teal-950/40" : "bg-destructive/10"}`}>
                  <m.icon className={`h-4 w-4 ${m.up ? "text-teal-500" : "text-destructive"}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{m.value}</div>
                <div className={`text-xs mt-1 font-medium ${m.up ? "text-teal-600 dark:text-teal-400" : "text-destructive"}`}>
                  {m.change} vs last {range.toLowerCase()}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Turnover */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Inventory Turnover Rate</CardTitle>
              <CardDescription className="text-xs">How often inventory is sold and replaced per month</CardDescription>
            </CardHeader>
            <CardContent className="h-[230px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TURNOVER_DATA} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }} contentStyle={tooltipStyle} formatter={(v: number) => [`${v}x`, "Turnover"]} />
                  <Bar dataKey="rate" fill="hsl(var(--accent))" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stock value */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Total Stock Value</CardTitle>
              <CardDescription className="text-xs">Asset valuation over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="h-[230px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={VALUE_DATA} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${v / 1000}k`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${(v / 1000).toFixed(0)}k`, "Value"]} />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" strokeWidth={2.5} fill="url(#valueGrad)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category distribution */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Category Distribution</CardTitle>
              <CardDescription className="text-xs">Value breakdown by product category (%)</CardDescription>
            </CardHeader>
            <CardContent className="h-[230px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={CATEGORY_DATA} cx="50%" cy="45%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" strokeWidth={0}>
                    {CATEGORY_DATA.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, "Share"]} />
                  <Legend verticalAlign="bottom" iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Supplier on-time delivery */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Supplier On-Time Delivery</CardTitle>
              <CardDescription className="text-xs">Percentage of orders delivered on schedule</CardDescription>
            </CardHeader>
            <CardContent className="h-[230px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SUPPLIER_DATA} layout="vertical" margin={{ top: 4, right: 40, left: 8, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={72} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, "On-time"]} cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }} />
                  <Bar dataKey="onTime" radius={[0, 5, 5, 0]} label={{ position: "right", fontSize: 11, fill: "hsl(var(--muted-foreground))", formatter: (v: number) => `${v}%` }}>
                    {SUPPLIER_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.onTime >= 90 ? "hsl(var(--chart-1))" : entry.onTime >= 80 ? "hsl(var(--chart-2))" : "hsl(var(--chart-3))"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Stockout Forecast Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Stockout Forecast
            </CardTitle>
            <CardDescription className="text-xs">Predicted dates when items will run out, based on average daily usage</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Product</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Current Stock</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Daily Usage</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Days Left</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Est. Stockout Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Urgency</th>
                  </tr>
                </thead>
                <tbody>
                  {forecast.map((item, i) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 + i * 0.04 }}
                      className={`border-b border-border/60 last:border-0 hover:bg-muted/40 transition-colors ${
                        item.urgency === "out" || item.urgency === "critical" ? "bg-destructive/5" :
                        item.urgency === "warning" ? "bg-amber-50/50 dark:bg-amber-950/20" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-medium">
                        <div>{item.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{item.sku}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{item.dailyUsage}/day</td>
                      <td className={`px-4 py-3 text-right font-bold ${
                        item.urgency === "out" || item.urgency === "critical" ? "text-destructive" :
                        item.urgency === "warning" ? "text-amber-500" : "text-teal-600 dark:text-teal-400"
                      }`}>
                        {item.daysLeft}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {item.daysLeft === 0 ? "Already out" : item.stockoutDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <UrgencyBadge urgency={item.urgency} days={item.daysLeft} />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

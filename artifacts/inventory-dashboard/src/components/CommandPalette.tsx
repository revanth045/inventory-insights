import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Search,
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  BarChart3,
  Users,
  Settings,
  FileText,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Truck,
  X
} from "lucide-react";
import { MOCK_PRODUCTS, MOCK_ORDERS, MOCK_SUPPLIERS } from "@/data/mockData";

type Item = {
  id: string;
  label: string;
  sub?: string;
  icon: React.ElementType;
  iconColor?: string;
  href?: string;
  group: string;
  action?: () => void;
};

const NAV_ITEMS: Item[] = [
  { id: "nav-dashboard", label: "Dashboard", sub: "Overview and KPIs", icon: LayoutDashboard, href: "/", group: "Pages" },
  { id: "nav-products", label: "Products", sub: "Product catalog", icon: Package, href: "/products", group: "Pages" },
  { id: "nav-stock", label: "Stock Levels", sub: "Inventory capacity", icon: Layers, href: "/stock", group: "Pages" },
  { id: "nav-orders", label: "Orders", sub: "Purchase orders", icon: ShoppingCart, href: "/orders", group: "Pages" },
  { id: "nav-analytics", label: "Analytics", sub: "Charts and metrics", icon: BarChart3, href: "/analytics", group: "Pages" },
  { id: "nav-suppliers", label: "Suppliers", sub: "Vendor management", icon: Users, href: "/suppliers", group: "Pages" },
  { id: "nav-reports", label: "Reports", sub: "Export and generate reports", icon: FileText, href: "/reports", group: "Pages" },
  { id: "nav-settings", label: "Settings", sub: "Account and preferences", icon: Settings, href: "/settings", group: "Pages" },
];

function statusIcon(status: string) {
  if (status === "healthy") return { icon: CheckCircle2, color: "text-teal-500" };
  if (status === "low") return { icon: AlertTriangle, color: "text-amber-500" };
  return { icon: XCircle, color: "text-destructive" };
}

function orderStatusIcon(status: string) {
  if (status === "delivered") return { icon: CheckCircle2, color: "text-teal-500" };
  if (status === "processing") return { icon: Clock, color: "text-blue-500" };
  if (status === "pending") return { icon: Truck, color: "text-amber-500" };
  return { icon: XCircle, color: "text-destructive" };
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [, setLocation] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  const allItems: Item[] = [
    ...NAV_ITEMS,
    ...MOCK_PRODUCTS.map(p => {
      const { icon, color } = statusIcon(p.status);
      return {
        id: `product-${p.id}`,
        label: p.name,
        sub: `${p.sku} · ${p.category} · ${p.quantity} units`,
        icon,
        iconColor: color,
        href: "/products",
        group: "Products",
      };
    }),
    ...MOCK_ORDERS.map(o => {
      const { icon, color } = orderStatusIcon(o.status);
      return {
        id: `order-${o.id}`,
        label: o.id,
        sub: `${o.supplier} · $${o.value.toLocaleString()} · ${o.status}`,
        icon,
        iconColor: color,
        href: "/orders",
        group: "Orders",
      };
    }),
    ...MOCK_SUPPLIERS.map(s => ({
      id: `supplier-${s.id}`,
      label: s.name,
      sub: `${s.category} · ${s.leadTime} lead time · ${s.rating}/5 rating`,
      icon: Users,
      iconColor: "text-accent",
      href: "/suppliers",
      group: "Suppliers",
    })),
  ];

  const filtered = query.trim() === ""
    ? NAV_ITEMS
    : allItems.filter(item => {
        const q = query.toLowerCase();
        return item.label.toLowerCase().includes(q) || (item.sub ?? "").toLowerCase().includes(q);
      }).slice(0, 10);

  const grouped = filtered.reduce<Record<string, Item[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const flat = Object.values(grouped).flat();

  const select = useCallback((item: Item) => {
    if (item.href) setLocation(item.href);
    if (item.action) item.action();
    onClose();
  }, [setLocation, onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, flat.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && flat[activeIndex]) {
        select(flat[activeIndex]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, flat, activeIndex, select, onClose]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-active="true"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  let globalIndex = 0;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative w-full max-w-xl mx-4 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search pages, products, orders, suppliers..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                data-testid="input-command-palette"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
              <kbd className="text-[10px] bg-muted border border-border px-1.5 py-0.5 rounded font-mono text-muted-foreground">ESC</kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[400px] overflow-y-auto py-2">
              {Object.entries(grouped).length === 0 && (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No results for "{query}"
                </div>
              )}
              {Object.entries(grouped).map(([group, items]) => (
                <div key={group}>
                  <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    {group}
                  </div>
                  {items.map(item => {
                    const thisIndex = globalIndex++;
                    const isActive = thisIndex === activeIndex;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        data-active={isActive}
                        onClick={() => select(item)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          isActive ? "bg-accent/10 text-accent" : "hover:bg-muted/50"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive ? "bg-accent/15" : "bg-muted"
                        }`}>
                          <Icon className={`h-4 w-4 ${item.iconColor ?? (isActive ? "text-accent" : "text-muted-foreground")}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium ${isActive ? "text-accent" : "text-foreground"}`}>{item.label}</div>
                          {item.sub && <div className="text-xs text-muted-foreground truncate">{item.sub}</div>}
                        </div>
                        <ArrowRight className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-accent" : "text-muted-foreground/40"}`} />
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer hints */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border bg-muted/30 text-[10px] text-muted-foreground">
              <span><kbd className="bg-background border border-border px-1 rounded font-mono">↑↓</kbd> navigate</span>
              <span><kbd className="bg-background border border-border px-1 rounded font-mono">↵</kbd> select</span>
              <span><kbd className="bg-background border border-border px-1 rounded font-mono">ESC</kbd> close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

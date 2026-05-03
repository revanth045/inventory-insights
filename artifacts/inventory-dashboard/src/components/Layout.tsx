import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  BarChart3,
  Users,
  Settings as SettingsIcon,
  HelpCircle,
  Search,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCircle,
  Bell,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ThemeProvider";
import NotificationBell from "./NotificationBell";
import ChatBox from "./ChatBox";
import HelpModal from "./HelpModal";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MOCK_PRODUCTS, MOCK_ORDERS } from "@/data/mockData";

const alertCount = MOCK_PRODUCTS.filter(p => p.status !== "healthy").length;
const pendingCount = MOCK_ORDERS.filter(o => o.status === "pending" || o.status === "processing").length;

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, badge: null },
  { href: "/products", label: "Products", icon: Package, badge: null },
  { href: "/stock", label: "Stock Levels", icon: Layers, badge: alertCount > 0 ? alertCount : null },
  { href: "/orders", label: "Orders", icon: ShoppingCart, badge: pendingCount > 0 ? pendingCount : null },
  { href: "/analytics", label: "Analytics", icon: BarChart3, badge: null },
  { href: "/suppliers", label: "Suppliers", icon: Users, badge: null },
  { href: "/settings", label: "Settings", icon: SettingsIcon, badge: null },
];

const PAGE_LABELS: Record<string, string> = {
  "/": "Dashboard",
  "/products": "Products",
  "/stock": "Stock Levels",
  "/orders": "Orders",
  "/analytics": "Analytics",
  "/suppliers": "Suppliers",
  "/settings": "Settings",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const pageLabel = PAGE_LABELS[location] ?? "Page";

  return (
    <div className="min-h-screen bg-background flex overflow-hidden" style={{ height: "100dvh" }}>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 72 : 240 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden md:flex flex-col border-r border-border bg-card z-20 h-screen sticky top-0 shrink-0"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-3 border-b border-border shrink-0">
          <AnimatePresence initial={false}>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2 overflow-hidden"
              >
                <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center shrink-0">
                  <Layers className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-base tracking-tight text-foreground truncate">StockCommand</span>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`shrink-0 ${sidebarCollapsed ? "mx-auto" : ""}`}
            data-testid="button-sidebar-toggle"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 flex flex-col gap-0.5 px-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;

            const inner = (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                  isActive
                    ? "bg-accent text-white font-semibold shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <AnimatePresence initial={false}>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.badge !== null && !sidebarCollapsed && (
                  <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/25 text-white" : "bg-destructive text-white"}`}>
                    {item.badge}
                  </span>
                )}
                {item.badge !== null && sidebarCollapsed && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
                )}
              </Link>
            );

            if (sidebarCollapsed) {
              return (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>{inner}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }
            return inner;
          })}
        </nav>

        {/* Help */}
        <div className="p-2 border-t border-border shrink-0">
          {sidebarCollapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full text-muted-foreground"
                  onClick={() => setHelpOpen(true)}
                  data-testid="button-help"
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Help Center</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground text-sm"
              onClick={() => setHelpOpen(true)}
              data-testid="button-help"
            >
              <HelpCircle className="h-4 w-4" />
              Help Center
            </Button>
          )}
        </div>
      </motion.aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10 shrink-0 gap-4">
          {/* Left: mobile brand + breadcrumb */}
          <div className="flex items-center gap-3">
            <div className="md:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
                <Layers className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-sm">StockCommand</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-muted-foreground text-sm">
              <span className="text-foreground font-semibold">{pageLabel}</span>
            </div>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-sm hidden sm:block">
            {searchOpen ? (
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  autoFocus
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder="Search products, orders, suppliers..."
                  className="pl-9 pr-9 h-9 text-sm"
                  data-testid="input-global-search"
                  onBlur={() => { if (!searchVal) setSearchOpen(false); }}
                />
                <button
                  className="absolute right-2.5 text-muted-foreground hover:text-foreground"
                  onClick={() => { setSearchVal(""); setSearchOpen(false); }}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 w-full px-3 h-9 rounded-md border border-border bg-muted/50 text-sm text-muted-foreground hover:bg-muted transition-colors"
                data-testid="button-open-search"
              >
                <Search className="h-4 w-4" />
                <span>Search...</span>
                <kbd className="ml-auto text-[10px] bg-background border border-border px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
              </button>
            )}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => setSearchOpen(true)}
              data-testid="button-search-mobile"
            >
              <Search className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <NotificationBell />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 w-9 rounded-full p-0 bg-accent/15 hover:bg-accent/25 border border-accent/30"
                  data-testid="button-user-menu"
                >
                  <span className="text-accent font-bold text-sm">AL</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>
                  <div className="font-semibold">Alex Logistics</div>
                  <div className="text-xs text-muted-foreground font-normal">alex@aerologistics.com</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer flex items-center gap-2">
                    <UserCircle className="h-4 w-4" /> Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive gap-2">
                  <LogOut className="h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto pb-24">
            {children}
          </div>
        </main>
      </div>

      <ChatBox />
      <HelpModal open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
}

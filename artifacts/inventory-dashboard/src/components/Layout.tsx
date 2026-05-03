import { useState, useEffect, useCallback } from "react";
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
  Menu,
  X,
  FileText,
  Keyboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import NotificationBell from "./NotificationBell";
import ChatBox from "./ChatBox";
import HelpModal from "./HelpModal";
import { CommandPalette } from "./CommandPalette";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MOCK_PRODUCTS, MOCK_ORDERS } from "@/data/mockData";

const alertCount = MOCK_PRODUCTS.filter(p => p.status !== "healthy").length;
const pendingCount = MOCK_ORDERS.filter(o => o.status === "pending" || o.status === "processing").length;

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, badge: null },
  { href: "/products", label: "Products", icon: Package, badge: null },
  { href: "/stock", label: "Stock Levels", icon: Layers, badge: alertCount },
  { href: "/orders", label: "Orders", icon: ShoppingCart, badge: pendingCount },
  { href: "/analytics", label: "Analytics", icon: BarChart3, badge: null },
  { href: "/suppliers", label: "Suppliers", icon: Users, badge: null },
  { href: "/reports", label: "Reports", icon: FileText, badge: null },
  { href: "/settings", label: "Settings", icon: SettingsIcon, badge: null },
];

const PAGE_LABELS: Record<string, string> = {
  "/": "Dashboard",
  "/products": "Products",
  "/stock": "Stock Levels",
  "/orders": "Orders",
  "/analytics": "Analytics",
  "/suppliers": "Suppliers",
  "/reports": "Reports",
  "/settings": "Settings",
};

const SHORTCUTS = [
  { keys: ["⌘", "K"], action: "Open command palette" },
  { keys: ["?"], action: "Show keyboard shortcuts" },
  { keys: ["⌘", "D"], action: "Go to Dashboard" },
  { keys: ["⌘", "P"], action: "Go to Products" },
  { keys: ["Esc"], action: "Close any dialog" },
  { keys: ["↑", "↓"], action: "Navigate lists" },
  { keys: ["↵"], action: "Select item" },
  { keys: ["⌘", "T"], action: "Toggle dark mode" },
];

function SidebarContent({
  collapsed,
  onToggleCollapse,
  onHelpOpen,
  onClose,
}: {
  collapsed: boolean;
  onToggleCollapse?: () => void;
  onHelpOpen: () => void;
  onClose?: () => void;
}) {
  const [location] = useLocation();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-3 border-b border-border shrink-0">
        <AnimatePresence initial={false}>
          {!collapsed && (
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
        <div className="flex gap-1">
          {onClose && (
            <Button variant="ghost" size="icon" className="shrink-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className={`shrink-0 ${collapsed ? "mx-auto" : ""}`}
              data-testid="button-sidebar-toggle"
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
        </div>
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
              onClick={onClose}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                isActive
                  ? "bg-accent text-white font-semibold shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm overflow-hidden whitespace-nowrap flex-1"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {item.badge !== null && item.badge! > 0 && !collapsed && (
                <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/25 text-white" : "bg-destructive text-white"}`}>
                  {item.badge}
                </span>
              )}
              {item.badge !== null && item.badge! > 0 && collapsed && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
              )}
            </Link>
          );

          if (collapsed) {
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
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="w-full" onClick={onHelpOpen} data-testid="button-help">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Help Center</TooltipContent>
          </Tooltip>
        ) : (
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground text-sm" onClick={onHelpOpen} data-testid="button-help">
            <HelpCircle className="h-4 w-4" /> Help Center
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [clock, setClock] = useState(() => new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));

  const pageLabel = PAGE_LABELS[location] ?? "Page";

  // Clock
  useEffect(() => {
    const t = setInterval(() => {
      setClock(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    }, 30000);
    return () => clearInterval(t);
  }, []);

  // Global keyboard shortcuts
  const handleKey = useCallback((e: KeyboardEvent) => {
    const meta = e.metaKey || e.ctrlKey;
    if (meta && e.key === "k") { e.preventDefault(); setCmdOpen(true); }
    if (meta && e.key === "t") { e.preventDefault(); setTheme(theme === "dark" ? "light" : "dark"); }
    if (e.key === "?" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
      setShortcutsOpen(true);
    }
    if (e.key === "Escape") {
      setCmdOpen(false);
      setMobileOpen(false);
    }
  }, [theme, setTheme]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-background flex overflow-hidden" style={{ height: "100dvh" }}>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 72 : 240 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="hidden md:flex flex-col border-r border-border bg-card z-20 h-screen sticky top-0 shrink-0"
      >
        <SidebarContent
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(v => !v)}
          onHelpOpen={() => setHelpOpen(true)}
        />
      </motion.aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed left-0 top-0 bottom-0 w-[260px] bg-card border-r border-border z-40 md:hidden flex flex-col"
            >
              <SidebarContent
                collapsed={false}
                onHelpOpen={() => { setHelpOpen(true); setMobileOpen(false); }}
                onClose={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-3 sm:px-5 sticky top-0 z-10 shrink-0 gap-3">
          {/* Left */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
              data-testid="button-mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{pageLabel}</span>
            </div>
            <div className="md:hidden flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
                <Layers className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-sm">StockCommand</span>
            </div>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-sm hidden sm:block">
            <button
              onClick={() => setCmdOpen(true)}
              className="flex items-center gap-2 w-full px-3 h-9 rounded-lg border border-border bg-muted/50 text-sm text-muted-foreground hover:bg-muted transition-colors"
              data-testid="button-open-search"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">Search...</span>
              <kbd className="text-[10px] bg-background border border-border px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
            </button>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1">
            {/* Live clock */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-muted-foreground px-2 py-1 rounded-md bg-muted/50 border border-border/60 mr-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              {clock}
            </div>

            <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setCmdOpen(true)} data-testid="button-search-mobile">
              <Search className="h-4 w-4" />
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setShortcutsOpen(true)} data-testid="button-shortcuts">
                  <Keyboard className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Keyboard shortcuts (?)</TooltipContent>
            </Tooltip>

            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} data-testid="button-theme-toggle">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <NotificationBell />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 rounded-full p-0 bg-accent/15 hover:bg-accent/25 border border-accent/30" data-testid="button-user-menu">
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
                <DropdownMenuItem className="gap-2" onClick={() => setShortcutsOpen(true)}>
                  <Keyboard className="h-4 w-4" /> Keyboard Shortcuts
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive gap-2">
                  <LogOut className="h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content with transition */}
        <main className="flex-1 overflow-y-auto bg-background">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-28"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Overlays */}
      <ChatBox />
      <HelpModal open={helpOpen} onOpenChange={setHelpOpen} />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />

      {/* Keyboard shortcuts dialog */}
      <Dialog open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Keyboard className="h-4 w-4" /> Keyboard Shortcuts</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {SHORTCUTS.map(s => (
              <div key={s.action} className="flex items-center justify-between py-1.5 border-b border-border/60 last:border-0">
                <span className="text-sm text-muted-foreground">{s.action}</span>
                <div className="flex gap-1">
                  {s.keys.map(k => (
                    <kbd key={k} className="text-[10px] bg-muted border border-border px-1.5 py-0.5 rounded font-mono">{k}</kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

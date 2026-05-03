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
  Menu,
  Moon,
  Sun,
  HelpCircle,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import NotificationBell from "./NotificationBell";
import ChatBox from "./ChatBox";
import HelpModal from "./HelpModal";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/stock", label: "Stock Levels", icon: Layers },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/suppliers", label: "Suppliers", icon: Users },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarCollapsed ? 72 : 240 }}
        className="hidden md:flex flex-col border-r border-border bg-card z-10 sticky top-0 h-screen"
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {!sidebarCollapsed && (
            <span className="font-bold text-lg text-primary truncate">AERO LOGISTICS</span>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={sidebarCollapsed ? "mx-auto" : ""}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            const linkContent = (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                  isActive 
                    ? "bg-accent/10 text-accent font-medium" 
                    : "text-muted-foreground hover:bg-accent/5 hover:text-accent"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-accent" : ""}`} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );

            if (sidebarCollapsed) {
              return (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    {linkContent}
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }
            return linkContent;
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 text-muted-foreground"
            onClick={() => setHelpOpen(true)}
          >
            <HelpCircle className="h-5 w-5" />
            {!sidebarCollapsed && <span>Help Center</span>}
          </Button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10 shrink-0">
          <div className="flex items-center md:hidden">
            <span className="font-bold text-lg text-primary mr-4">AERO</span>
          </div>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <NotificationBell />
            
            <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-medium border border-accent/20">
              AL
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-background relative">
          <div className="max-w-7xl mx-auto pb-20">
            {children}
          </div>
        </main>
      </div>

      <ChatBox />
      <HelpModal open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
}

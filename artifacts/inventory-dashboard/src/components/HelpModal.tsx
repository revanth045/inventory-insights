import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Package, ShoppingCart, BarChart3, AlertTriangle, Settings } from "lucide-react";

type HelpModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FAQ = { q: string; a: string; tags: string[] };
type Section = { id: string; label: string; icon: React.ElementType; color: string; faqs: FAQ[] };

const SECTIONS: Section[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    icon: BookOpen,
    color: "text-accent",
    faqs: [
      { q: "How do I navigate the dashboard?", a: "Use the sidebar on the left to switch between modules — Dashboard, Products, Stock Levels, Orders, Analytics, Suppliers, Reports, and Settings. The header also has a search bar (⌘K) to jump to any item instantly.", tags: ["navigation", "sidebar"] },
      { q: "How do I switch between light and dark mode?", a: "Click the moon/sun icon in the top header, or go to Settings → Appearance. You can also use the keyboard shortcut ⌘T.", tags: ["theme", "dark mode"] },
      { q: "What does the ⌘K command palette do?", a: "Pressing ⌘K (or Ctrl+K) opens a quick-search overlay. You can search for pages, products, orders, or suppliers and navigate directly to them using your keyboard.", tags: ["search", "command palette", "keyboard"] },
      { q: "How do I export data?", a: "Go to the Reports page from the sidebar. You can select a report type (Inventory Summary, Low Stock, Order History, etc.) and click 'Download CSV' to export real data instantly.", tags: ["export", "csv", "reports"] },
    ],
  },
  {
    id: "stock",
    label: "Stock Management",
    icon: Package,
    color: "text-teal-500",
    faqs: [
      { q: "What do the stock status colours mean?", a: "All statuses use both colour AND an icon for accessibility:\n• In Stock (teal + checkmark): well above reorder point\n• Low Stock (amber + triangle): near the reorder point\n• Critical (red + X): below reorder point — immediate action needed\n• Out of Stock (red + X): zero units remaining", tags: ["status", "colorblind", "accessibility"] },
      { q: "How is 'Days Until Empty' calculated?", a: "It's calculated as: Current Quantity ÷ Average Daily Usage. This gives an estimate of how many days of stock remain. Items showing 0 days are already out of stock.", tags: ["days", "stockout", "forecast"] },
      { q: "How do I restock an item?", a: "From the Stock Levels page, click 'Draft PO' next to any critical item to create a purchase order. You can also use the 'Restock All Critical' button to draft orders for all critical items at once.", tags: ["restock", "purchase order", "po"] },
      { q: "How are reorder points set?", a: "Reorder points are configured per product. Click any product row in the Products page to open its detail panel, then use 'Edit Details' to adjust the reorder point.", tags: ["reorder", "settings"] },
    ],
  },
  {
    id: "orders",
    label: "Orders",
    icon: ShoppingCart,
    color: "text-blue-500",
    faqs: [
      { q: "How do I track an order?", a: "Go to the Orders page. Click any order row to open a detail panel showing full status, supplier, dates, and value. You can mark it as delivered or cancel it directly from there.", tags: ["track", "status", "orders"] },
      { q: "What do order statuses mean?", a: "• Pending (amber + clock): order submitted, not yet started\n• Processing (blue + refresh): order in progress or shipped\n• Delivered (teal + checkmark): received at warehouse\n• Cancelled (red + X): order was cancelled", tags: ["status", "pending", "delivered"] },
      { q: "Can I filter orders by status?", a: "Yes — use the status tabs at the top of the Orders page (All / Pending / Processing / Delivered / Cancelled). You can also search by order ID or supplier name.", tags: ["filter", "search"] },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    color: "text-purple-500",
    faqs: [
      { q: "What time ranges are available in Analytics?", a: "You can switch between Week, Month, Quarter, and Year views using the tabs in the top-right of the Analytics page. Charts and metrics update accordingly.", tags: ["date range", "time", "charts"] },
      { q: "What does the Inventory Turnover Rate mean?", a: "Turnover rate = how many times your average inventory is sold and replaced in a period. A rate of 4x means you sold and restocked your average stock 4 times. Higher is generally better.", tags: ["turnover", "kpi"] },
      { q: "What does the Stockout Forecast table show?", a: "It predicts which items will run out based on current stock and average daily usage, and shows the estimated date of stockout. Items in red need immediate attention.", tags: ["forecast", "stockout", "prediction"] },
    ],
  },
  {
    id: "troubleshooting",
    label: "Troubleshooting",
    icon: AlertTriangle,
    color: "text-amber-500",
    faqs: [
      { q: "Why are some badges showing both colour and icons?", a: "This is intentional — the dashboard is designed for colorblind accessibility. Every status indicator uses a combination of colour, icon, and text label so the information is clear regardless of colour perception.", tags: ["accessibility", "colorblind", "badges"] },
      { q: "How do I dismiss notifications?", a: "In the notification bell dropdown, hover over any notification to reveal an X button to dismiss it individually. You can also use 'Mark all read' or 'Clear all' at the top/bottom of the panel.", tags: ["notifications", "dismiss"] },
      { q: "My ERP sync isn't showing updated data. What do I do?", a: "Click the 'Sync ERP' button on the Stock Levels page. If the issue persists, check your ERP integration settings or contact your system administrator.", tags: ["sync", "erp", "data"] },
    ],
  },
];

export default function HelpModal({ open, onOpenChange }: HelpModalProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return SECTIONS;
    const q = query.toLowerCase();
    return SECTIONS
      .map(section => ({
        ...section,
        faqs: section.faqs.filter(faq =>
          faq.q.toLowerCase().includes(q) ||
          faq.a.toLowerCase().includes(q) ||
          faq.tags.some(t => t.includes(q))
        ),
      }))
      .filter(section => section.faqs.length > 0);
  }, [query]);

  const totalResults = filtered.reduce((a, s) => a + s.faqs.length, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col gap-0 p-0">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-border shrink-0">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-accent" /> Help Center
            </DialogTitle>
          </DialogHeader>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search for help topics..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              data-testid="input-help-search"
              autoFocus
            />
          </div>
          {query && (
            <p className="text-xs text-muted-foreground mt-2">
              {totalResults} result{totalResults !== 1 ? "s" : ""} for "{query}"
            </p>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-5 pt-3 space-y-5">
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
              <div className="text-sm text-muted-foreground">No results for "{query}"</div>
              <div className="text-xs text-muted-foreground/70 mt-1">Try different keywords</div>
            </div>
          )}
          {filtered.map(section => {
            const Icon = section.icon;
            return (
              <div key={section.id}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-4 w-4 ${section.color}`} />
                  <h3 className="font-semibold text-sm">{section.label}</h3>
                  <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{section.faqs.length}</Badge>
                </div>
                <Accordion type="multiple" className="w-full">
                  {section.faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`${section.id}-${i}`} className="border border-border/60 rounded-lg mb-1.5 px-1 overflow-hidden">
                      <AccordionTrigger className="text-sm text-left hover:no-underline py-3 px-2">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground px-2 pb-3 whitespace-pre-line leading-relaxed">
                        {faq.a}
                        {faq.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {faq.tags.map(tag => (
                              <button
                                key={tag}
                                onClick={() => setQuery(tag)}
                                className="text-[10px] bg-muted hover:bg-accent/10 hover:text-accent border border-border px-1.5 py-0.5 rounded-full transition-colors"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

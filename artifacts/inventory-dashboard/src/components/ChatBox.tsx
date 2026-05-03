import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "0",
    role: "assistant",
    content: "Hi! I'm your Inventory Assistant. Ask me about stock levels, orders, or supplier performance.",
  },
  {
    id: "1",
    role: "user",
    content: "Which items are below reorder point?",
  },
  {
    id: "2",
    role: "assistant",
    content: "Here are items currently below their reorder point:\n\n• **Standing Desk** — 3 units (Critical, reorder at 10)\n• **Monitor Stand** — 0 units (Out of Stock, reorder at 15)\n• **Office Chair** — 12 units (Low, reorder at 20)\n• **Ergonomic Mouse** — 34 units (Low, reorder at 50)\n\nWould you like me to draft purchase orders for any of these?",
  },
];

const SMART_RESPONSES: [RegExp, string][] = [
  [/order|purchase|po/i, "There are currently 5 active orders — 3 processing and 2 pending. The highest-value pending order is ORD-505 with TechSource Global ($5,600). Want me to surface the full list?"],
  [/supplier|vendor/i, "You have 4 registered suppliers. AccessoryHub Inc has the highest rating (4.9/5) with a 3-day lead time. FurniPro Ltd has the longest lead time at 14 days."],
  [/value|worth|cost/i, "Your total inventory is valued at approximately $182,700 across 1,248 SKUs. Electronics account for the largest share at ~45% of value."],
  [/critical|urgent|out of stock/i, "2 items are in critical state: **Standing Desk** (3 units) and **Monitor Stand** (0 units — out of stock). Both are below their reorder points and need immediate action."],
  [/low stock|low/i, "Items with low stock: **Office Chair** (12 units, reorder at 20) and **Ergonomic Mouse** (34 units, reorder at 50). These should be restocked within the week."],
  [/analytics|trend|performance/i, "Inventory turnover rate has been improving — up to 4.0x in June from 2.4x in January. Total stock value grew 50% over the same period to $1.2M."],
  [/hello|hi|hey/i, "Hello! How can I help you manage your inventory today? You can ask about stock levels, orders, suppliers, or analytics."],
  [/thank/i, "You're welcome! Let me know if there's anything else you need."],
];

const SUGGESTIONS = [
  "What's out of stock?",
  "Show pending orders",
  "Top supplier performance",
  "Total inventory value",
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function formatContent(text: string) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={i}>
        {parts.map((part, j) =>
          part.startsWith("**") && part.endsWith("**")
            ? <strong key={j}>{part.slice(2, -2)}</strong>
            : part
        )}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    );
  });
}

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, typing]);

  const getResponse = (text: string): string => {
    for (const [pattern, response] of SMART_RESPONSES) {
      if (pattern.test(text)) return response;
    }
    return "I've noted your query. In a live environment I'd pull real-time data from your ERP to answer that precisely. Is there something specific about stock, orders, or suppliers I can help with?";
  };

  const handleSend = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getResponse(msg),
      }]);
    }, 1100 + Math.random() * 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.93 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-[350px] sm:w-[380px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ height: 500 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-accent text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-sm leading-none">Inventory Assistant</div>
                  <div className="text-[10px] text-white/70 mt-0.5">Always here to help</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:bg-white/20 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={undefined}>
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="h-3.5 w-3.5 text-accent" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-accent text-white rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                    }`}
                  >
                    {formatContent(msg.content)}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm">
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 3 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-muted hover:bg-accent/10 hover:border-accent/30 transition-colors text-muted-foreground hover:text-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border bg-card shrink-0">
              <form
                onSubmit={e => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about inventory..."
                  className="flex-1 h-9 text-sm"
                  disabled={typing}
                  data-testid="input-chat"
                />
                <Button type="submit" size="icon" className="h-9 w-9 shrink-0" disabled={!input.trim() || typing} data-testid="button-chat-send">
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.div whileTap={{ scale: 0.93 }}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full shadow-xl bg-accent hover:bg-accent/90 relative"
          data-testid="button-chat-toggle"
        >
          <AnimatePresence mode="wait">
            {isOpen
              ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X className="h-6 w-6" /></motion.div>
              : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><MessageCircle className="h-6 w-6" /></motion.div>
            }
          </AnimatePresence>
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive border-2 border-card text-[9px] text-white font-bold flex items-center justify-center">3</span>
          )}
        </Button>
      </motion.div>
    </div>
  );
}

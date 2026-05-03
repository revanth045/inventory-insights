import { useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, XCircle, Info, X, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { INITIAL_NOTIFICATIONS, type Notification } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

function getIcon(type: Notification["type"]) {
  switch (type) {
    case "success": return <CheckCircle2 className="h-4 w-4 text-teal-500" />;
    case "warning": return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case "critical": return <XCircle className="h-4 w-4 text-destructive" />;
    default: return <Info className="h-4 w-4 text-blue-500" />;
  }
}

function getBg(type: Notification["type"]) {
  switch (type) {
    case "success": return "bg-teal-50 dark:bg-teal-950/40";
    case "warning": return "bg-amber-50 dark:bg-amber-950/40";
    case "critical": return "bg-destructive/5";
    default: return "bg-blue-50 dark:bg-blue-950/40";
  }
}

export default function NotificationBell() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [open, setOpen] = useState(false);

  const unread = notifications.filter(n => !n.read).length;

  const dismiss = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({ title: "All notifications marked as read" });
  };

  const clearAll = () => {
    setNotifications([]);
    setOpen(false);
    toast({ title: "Notifications cleared" });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
          <Bell className="h-4 w-4" />
          <AnimatePresence>
            {unread > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive border-2 border-card flex items-center justify-center text-[9px] text-white font-bold"
              >
                {unread}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[340px] p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">Notifications</span>
            {unread > 0 && (
              <span className="bg-destructive text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {unread} new
              </span>
            )}
          </div>
          {unread > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground" onClick={markAllRead} data-testid="button-mark-all-read">
              <CheckCheck className="h-3 w-3" /> Mark all read
            </Button>
          )}
        </div>

        {/* Items */}
        <div className="max-h-[360px] overflow-y-auto">
          <AnimatePresence initial={false}>
            {notifications.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-10 text-center"
              >
                <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                <div className="text-sm text-muted-foreground">No notifications</div>
              </motion.div>
            )}
            {notifications.map(notif => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className={`group relative flex items-start gap-3 px-4 py-3 border-b border-border/60 last:border-0 cursor-pointer transition-colors ${
                  notif.read ? "opacity-60" : ""
                } hover:bg-muted/40`}
                onClick={() => markRead(notif.id)}
                data-testid={`notification-${notif.id}`}
              >
                {/* Unread dot */}
                {!notif.read && (
                  <span className="absolute left-1.5 top-4 w-1.5 h-1.5 rounded-full bg-accent" />
                )}

                <div className={`p-1.5 rounded-lg ${getBg(notif.type)} shrink-0 mt-0.5`}>
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0 pr-6">
                  <div className="text-sm font-medium leading-tight">{notif.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notif.message}</div>
                  <div className="text-[10px] text-muted-foreground/70 mt-1">{notif.time}</div>
                </div>

                <button
                  onClick={e => { e.stopPropagation(); dismiss(notif.id); }}
                  className="absolute top-2.5 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                  data-testid={`button-dismiss-notif-${notif.id}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="flex border-t border-border">
            <button
              onClick={clearAll}
              className="flex-1 py-2.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors font-medium"
              data-testid="button-clear-all-notifications"
            >
              Clear all
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

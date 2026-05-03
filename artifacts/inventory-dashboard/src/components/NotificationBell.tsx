import { Bell, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MOCK_NOTIFICATIONS } from "@/data/mockData";

export default function NotificationBell() {
  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle2 className="h-4 w-4 text-teal-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "critical": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-card" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-normal flex items-center justify-between">
          <span className="font-semibold">Notifications</span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {MOCK_NOTIFICATIONS.length} new
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          {MOCK_NOTIFICATIONS.map((notif) => (
            <DropdownMenuItem key={notif.id} className="p-3 cursor-pointer items-start gap-3 focus:bg-accent/5">
              <div className="mt-0.5">{getIcon(notif.type)}</div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium leading-none">{notif.title}</span>
                <span className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {notif.message}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium mt-1">
                  {notif.time}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <Button variant="ghost" className="w-full text-xs h-8 text-primary">
          View all notifications
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

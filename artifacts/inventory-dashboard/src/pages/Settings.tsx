import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ThemeProvider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Bell, Palette, Shield, Users, Save, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const TEAM = [
  { name: "Alex Logistics", email: "alex@aerologistics.com", role: "Admin", avatar: "AL" },
  { name: "Sam Rivera", email: "sam@aerologistics.com", role: "Manager", avatar: "SR" },
  { name: "Jordan Park", email: "jordan@aerologistics.com", role: "Viewer", avatar: "JP" },
];

const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "team", label: "Team", icon: Users },
  { id: "security", label: "Security", icon: Shield },
];

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("profile");
  const [colorblind, setColorblind] = useState(true);
  const [currency, setCurrency] = useState("USD");
  const [notifs, setNotifs] = useState({ lowStock: true, orderStatus: true, weeklyReport: false, supplierAlerts: true });

  const save = () => toast({ title: "Settings saved", description: "Your preferences have been updated." });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="hidden sm:flex flex-col gap-1 w-44 shrink-0">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              data-testid={`settings-nav-${s.id}`}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                activeSection === s.id
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <s.icon className="h-4 w-4" />
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5">
          {/* Profile */}
          {activeSection === "profile" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-border">
                    <div className="w-16 h-16 rounded-full bg-accent/15 border-2 border-accent/30 flex items-center justify-center text-accent font-bold text-xl">
                      AL
                    </div>
                    <div>
                      <div className="font-semibold">Alex Logistics</div>
                      <div className="text-sm text-muted-foreground">Administrator</div>
                      <Button variant="outline" size="sm" className="mt-2 h-7 text-xs" onClick={() => toast({ title: "Upload avatar" })}>Change photo</Button>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="Alex" data-testid="input-first-name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Logistics" data-testid="input-last-name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="alex@aerologistics.com" data-testid="input-email" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger data-testid="select-currency"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD — US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR — Euro</SelectItem>
                          <SelectItem value="GBP">GBP — British Pound</SelectItem>
                          <SelectItem value="INR">INR — Indian Rupee</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Time Zone</Label>
                      <Select defaultValue="est">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="est">EST — Eastern Time</SelectItem>
                          <SelectItem value="pst">PST — Pacific Time</SelectItem>
                          <SelectItem value="gmt">GMT — Greenwich</SelectItem>
                          <SelectItem value="ist">IST — India Standard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="gap-1.5" onClick={save} data-testid="button-save-profile"><Save className="h-4 w-4" /> Save Changes</Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Appearance */}
          {activeSection === "appearance" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Appearance</CardTitle>
                  <CardDescription>Customize how the dashboard looks and feels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {[
                    {
                      label: "Dark Mode",
                      desc: "Switch between light and dark themes",
                      checked: theme === "dark",
                      onChange: (c: boolean) => setTheme(c ? "dark" : "light"),
                      id: "dark-mode",
                    },
                    {
                      label: "Colorblind Accessible Mode",
                      desc: "Uses icons and patterns alongside colour for all status indicators and charts",
                      checked: colorblind,
                      onChange: setColorblind,
                      id: "colorblind",
                    },
                  ].map(item => (
                    <div key={item.id} className="flex items-start justify-between gap-4">
                      <div className="space-y-0.5 flex-1">
                        <Label htmlFor={item.id} className="font-medium">{item.label}</Label>
                        <div className="text-sm text-muted-foreground">{item.desc}</div>
                      </div>
                      <Switch id={item.id} checked={item.checked} onCheckedChange={item.onChange} data-testid={`switch-${item.id}`} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Notifications */}
          {activeSection === "notifications" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notifications</CardTitle>
                  <CardDescription>Choose which alerts you receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {[
                    { key: "lowStock" as const, label: "Low Stock Alerts", desc: "Get notified when items drop below their reorder point" },
                    { key: "orderStatus" as const, label: "Order Status Updates", desc: "Be alerted when purchase orders change status" },
                    { key: "supplierAlerts" as const, label: "Supplier Alerts", desc: "Notifications for supplier updates and new approvals" },
                    { key: "weeklyReport" as const, label: "Weekly Summary Report", desc: "Receive a weekly digest of inventory metrics via email" },
                  ].map(n => (
                    <div key={n.key} className="flex items-start justify-between gap-4">
                      <div className="space-y-0.5">
                        <Label className="font-medium">{n.label}</Label>
                        <div className="text-sm text-muted-foreground">{n.desc}</div>
                      </div>
                      <Switch
                        checked={notifs[n.key]}
                        onCheckedChange={v => setNotifs(prev => ({ ...prev, [n.key]: v }))}
                        data-testid={`switch-notif-${n.key}`}
                      />
                    </div>
                  ))}
                  <Button className="gap-1.5" onClick={save} data-testid="button-save-notifications"><Save className="h-4 w-4" /> Save Preferences</Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Team */}
          {activeSection === "team" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Team Members</CardTitle>
                    <CardDescription>Manage access and roles</CardDescription>
                  </div>
                  <Button size="sm" className="gap-1.5" onClick={() => toast({ title: "Invite sent" })} data-testid="button-invite">
                    <Users className="h-4 w-4" /> Invite
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {TEAM.map((member, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/40 transition-colors">
                      <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center text-accent font-bold text-sm shrink-0">
                        {member.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{member.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{member.email}</div>
                      </div>
                      <Badge variant={member.role === "Admin" ? "default" : "secondary"} className="text-[11px] shrink-0">
                        {member.role}
                      </Badge>
                      {member.role !== "Admin" && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => toast({ title: `Removed ${member.name}`, variant: "destructive" })}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Security */}
          {activeSection === "security" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Security</CardTitle>
                  <CardDescription>Manage your account security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input type="password" placeholder="••••••••" data-testid="input-current-password" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input type="password" placeholder="••••••••" data-testid="input-new-password" />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm Password</Label>
                      <Input type="password" placeholder="••••••••" data-testid="input-confirm-password" />
                    </div>
                  </div>
                  <div className="flex items-start justify-between pt-2 border-t border-border">
                    <div className="space-y-0.5">
                      <Label className="font-medium">Two-Factor Authentication</Label>
                      <div className="text-sm text-muted-foreground">Add an extra layer of security to your account</div>
                    </div>
                    <Switch data-testid="switch-2fa" />
                  </div>
                  <Button className="gap-1.5" onClick={save} data-testid="button-save-security"><Save className="h-4 w-4" /> Update Password</Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

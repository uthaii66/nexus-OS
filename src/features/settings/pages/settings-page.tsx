import {
  BellRing,
  Eye,
  LayoutDashboard,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/page-header";
import { SectionCard } from "@/components/common/section-card";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ProfileForm } from "@/features/settings/components/profile-form";
import { SettingsRow } from "@/features/settings/components/settings-row";
import { useSettingsStore } from "@/store/settings-store";
import { useUiStore } from "@/store/ui-store";
import type {
  CurrencyPreference,
  DashboardWidgetId,
  DateFormatPreference,
  NotificationPreferences,
  SidebarPreference,
  ThemePreference,
  WeightUnit,
} from "@/types/settings";

const widgetOptions: {
  id: DashboardWidgetId;
  label: string;
  description: string;
}[] = [
  {
    id: "todayFocus",
    label: "Today’s Focus",
    description: "Your three highest-value priorities.",
  },
  {
    id: "lifeScore",
    label: "Life Score",
    description: "Cross-domain progress and category scores.",
  },
  {
    id: "dailySummary",
    label: "Daily Summary",
    description: "Compact finance, health, career, and study metrics.",
  },
  {
    id: "schedule",
    label: "Upcoming Schedule",
    description: "Today’s timeline and near-term events.",
  },
  {
    id: "alerts",
    label: "Attention Required",
    description: "Bills, follow-ups, missed targets, and blockers.",
  },
  {
    id: "weeklyProgress",
    label: "Weekly Progress",
    description: "Planned-versus-completed trends.",
  },
  {
    id: "recentActivity",
    label: "Recent Activity",
    description: "A stream of recent manual updates.",
  },
];

const notificationOptions: {
  id: keyof NotificationPreferences;
  label: string;
  description: string;
}[] = [
  {
    id: "reminders",
    label: "Schedule reminders",
    description: "Upcoming calendar commitments and deadlines.",
  },
  {
    id: "financeAlerts",
    label: "Finance alerts",
    description: "Bills, budget thresholds, and debt checkpoints.",
  },
  {
    id: "healthNudges",
    label: "Health nudges",
    description: "Gentle reminders for manually selected habits.",
  },
  {
    id: "careerFollowUps",
    label: "Career follow-ups",
    description: "Applications that have passed their follow-up date.",
  },
  {
    id: "weeklyDigest",
    label: "Weekly digest",
    description: "A local summary of progress across your dashboard.",
  },
];

export function SettingsPage() {
  const [resetOpen, setResetOpen] = useState(false);
  const theme = useSettingsStore((state) => state.theme);
  const sidebar = useSettingsStore((state) => state.sidebar);
  const reducedMotion = useSettingsStore((state) => state.reducedMotion);
  const currency = useSettingsStore((state) => state.currency);
  const weightUnit = useSettingsStore((state) => state.weightUnit);
  const dateFormat = useSettingsStore((state) => state.dateFormat);
  const dashboardWidgets = useSettingsStore((state) => state.dashboardWidgets);
  const notifications = useSettingsStore((state) => state.notifications);
  const setPreference = useSettingsStore((state) => state.setPreference);
  const setNotification = useSettingsStore((state) => state.setNotification);
  const setWidgetVisibility = useSettingsStore(
    (state) => state.setWidgetVisibility,
  );
  const resetPreferences = useSettingsStore((state) => state.resetPreferences);

  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed);
  const compactMode = useUiStore((state) => state.compactMode);
  const setSidebarCollapsed = useUiStore((state) => state.setSidebarCollapsed);
  const setCompactMode = useUiStore((state) => state.setCompactMode);

  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reducedMotion);
    document.documentElement.dataset.themePreference = theme;
  }, [reducedMotion, theme]);

  const handleSidebarPreference = (value: SidebarPreference) => {
    setPreference("sidebar", value);
    if (value === "expanded") setSidebarCollapsed(false);
    if (value === "collapsed") setSidebarCollapsed(true);
  };

  const handleReset = () => {
    resetPreferences();
    setSidebarCollapsed(false);
    setCompactMode(false);
    setResetOpen(false);
    toast.success("Preferences restored to defaults");
  };

  const visibleWidgetCount =
    Object.values(dashboardWidgets).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Personalize Nexus"
        title="Settings"
        description="Tune the interface around how you review, plan, and move through your day."
      />

      <SectionCard
        title={
          <span className="flex items-center gap-2">
            <UserRound className="size-4 text-primary" /> Profile
          </span>
        }
        description="Stored only in this browser for the Phase 1 experience."
      >
        <ProfileForm />
      </SectionCard>

      <div className="grid gap-5 xl:grid-cols-2">
        <SectionCard
          title={
            <span className="flex items-center gap-2">
              <Eye className="size-4 text-primary" /> Appearance
            </span>
          }
          description="Display and navigation behavior."
        >
          <SettingsRow
            title="Theme preference"
            description="Use the Nexus dark theme or follow the system preference when more themes arrive."
            control={
              <Select
                value={theme}
                onValueChange={(value) =>
                  setPreference("theme", value as ThemePreference)
                }
              >
                <SelectTrigger className="w-32" aria-label="Theme preference">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            }
          />
          <SettingsRow
            title="Sidebar behavior"
            description={`Currently ${sidebarCollapsed ? "collapsed" : "expanded"} on this device.`}
            control={
              <Select
                value={sidebar}
                onValueChange={(value) =>
                  handleSidebarPreference(value as SidebarPreference)
                }
              >
                <SelectTrigger className="w-36" aria-label="Sidebar preference">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remember">Remember</SelectItem>
                  <SelectItem value="expanded">Expanded</SelectItem>
                  <SelectItem value="collapsed">Collapsed</SelectItem>
                </SelectContent>
              </Select>
            }
          />
          <SettingsRow
            title="Compact mode"
            description="Tighten navigation and dashboard spacing for information-dense review."
            htmlFor="compact-mode"
            control={
              <Switch
                id="compact-mode"
                checked={compactMode}
                onCheckedChange={setCompactMode}
              />
            }
          />
          <SettingsRow
            title="Reduce motion"
            description="Minimize non-essential transitions in addition to your system setting."
            htmlFor="reduce-motion"
            control={
              <Switch
                id="reduce-motion"
                checked={reducedMotion}
                onCheckedChange={(value) =>
                  setPreference("reducedMotion", value)
                }
              />
            }
          />
        </SectionCard>

        <SectionCard
          title={
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-primary" /> Regional
              formats
            </span>
          }
          description="How personal metrics appear throughout Nexus."
        >
          <SettingsRow
            title="Currency"
            description="Used for finance totals, budgets, and transaction displays."
            control={
              <Select
                value={currency}
                onValueChange={(value) =>
                  setPreference("currency", value as CurrencyPreference)
                }
              >
                <SelectTrigger className="w-28" aria-label="Currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR ₹</SelectItem>
                  <SelectItem value="USD">USD $</SelectItem>
                  <SelectItem value="EUR">EUR €</SelectItem>
                  <SelectItem value="GBP">GBP £</SelectItem>
                </SelectContent>
              </Select>
            }
          />
          <SettingsRow
            title="Weight unit"
            description="Applied to health logs, averages, and target progress."
            control={
              <Select
                value={weightUnit}
                onValueChange={(value) =>
                  setPreference("weightUnit", value as WeightUnit)
                }
              >
                <SelectTrigger className="w-28" aria-label="Weight unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilograms</SelectItem>
                  <SelectItem value="lb">Pounds</SelectItem>
                </SelectContent>
              </Select>
            }
          />
          <SettingsRow
            title="Date format"
            description="Used in lists, cards, deadlines, and exported views."
            control={
              <Select
                value={dateFormat}
                onValueChange={(value) =>
                  setPreference("dateFormat", value as DateFormatPreference)
                }
              >
                <SelectTrigger className="w-36" aria-label="Date format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MMM d, yyyy">Jul 12, 2026</SelectItem>
                  <SelectItem value="dd/MM/yyyy">12/07/2026</SelectItem>
                  <SelectItem value="MM/dd/yyyy">07/12/2026</SelectItem>
                </SelectContent>
              </Select>
            }
          />
        </SectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <SectionCard
          title={
            <span className="flex items-center gap-2">
              <LayoutDashboard className="size-4 text-primary" /> Overview
              widgets
            </span>
          }
          description="Choose the sections that appear on your command center."
          action={
            <StatusBadge tone="info">{visibleWidgetCount} visible</StatusBadge>
          }
        >
          {widgetOptions.map((widget) => (
            <SettingsRow
              key={widget.id}
              title={widget.label}
              description={widget.description}
              htmlFor={`widget-${widget.id}`}
              control={
                <Switch
                  id={`widget-${widget.id}`}
                  checked={dashboardWidgets[widget.id]}
                  onCheckedChange={(value) =>
                    setWidgetVisibility(widget.id, value)
                  }
                />
              }
            />
          ))}
        </SectionCard>

        <div className="space-y-5">
          <SectionCard
            title={
              <span className="flex items-center gap-2">
                <BellRing className="size-4 text-primary" /> Notifications
              </span>
            }
            description="Frontend-only notification preferences for Phase 1."
          >
            {notificationOptions.map((notification) => (
              <SettingsRow
                key={notification.id}
                title={notification.label}
                description={notification.description}
                htmlFor={`notification-${notification.id}`}
                control={
                  <Switch
                    id={`notification-${notification.id}`}
                    checked={notifications[notification.id]}
                    onCheckedChange={(value) =>
                      setNotification(notification.id, value)
                    }
                  />
                }
              />
            ))}
          </SectionCard>

          <SectionCard
            title={
              <span className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-success" /> Local data
              </span>
            }
            description="No sensitive credentials or external accounts are stored."
          >
            <p className="text-sm leading-6 text-muted-foreground">
              Preferences persist in localStorage. Domain updates such as tasks
              and events last only for the current session and can be replaced
              by service adapters later.
            </p>
            <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-border bg-background/35 p-4">
              <div>
                <p className="text-sm font-medium">
                  Reset interface preferences
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Restore display, widget, and notification defaults.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setResetOpen(true)}
              >
                <RotateCcw /> Reset
              </Button>
            </div>
          </SectionCard>
        </div>
      </div>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset all interface preferences?</DialogTitle>
            <DialogDescription>
              This restores the default profile labels, display settings, widget
              visibility, notification choices, and shell layout.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setResetOpen(false)}>
              Keep preferences
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              <RotateCcw /> Reset preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SettingsPage;

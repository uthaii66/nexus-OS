import { NavLink } from "react-router-dom";
import { Menu, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { navigationItems } from "@/components/navigation/nav-items";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

const primaryPaths = ["/", "/finance", "/health", "/learning"];
export function MobileNavigation() {
  const open = useUiStore((state) => state.mobileNavigationOpen);
  const setOpen = useUiStore((state) => state.setMobileNavigationOpen);
  const openQuickAdd = useUiStore((state) => state.openQuickAdd);
  const primary = navigationItems.filter((item) =>
    primaryPaths.includes(item.path),
  );
  return (
    <>
      <nav
        className="fixed inset-x-3 bottom-3 z-40 flex h-16 items-center justify-around rounded-2xl border border-white/10 bg-[#11141c]/95 px-1 shadow-float backdrop-blur-xl lg:hidden"
        aria-label="Mobile navigation"
      >
        {primary.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cn(
                  "flex size-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium text-muted-foreground",
                  isActive && "bg-primary/10 text-indigo-200",
                )
              }
            >
              <Icon className="size-[18px]" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
        <Button
          size="icon"
          onClick={() => openQuickAdd({ source: "button" })}
          className="size-11 rounded-xl"
          aria-label="Quick add"
        >
          <Plus />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setOpen(true)}
          className="size-11 flex-col gap-1 rounded-xl text-[10px]"
          aria-label="Open all navigation"
        >
          <Menu className="size-[18px]" />
          <span>More</span>
        </Button>
      </nav>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bottom-0 left-0 top-auto h-[85vh] max-w-none translate-x-0 translate-y-0 rounded-b-none rounded-t-3xl p-5 data-[state=open]:slide-in-from-bottom sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl">
          <div className="flex items-center justify-between pr-8">
            <DialogTitle>Navigate Nexus</DialogTitle>
            <Button
              variant="ghost"
              size="icon-sm"
              className="hidden"
              aria-label="Close"
            >
              <X />
            </Button>
          </div>
          <div className="mt-3 grid gap-2 overflow-y-auto pb-5 sm:grid-cols-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl border border-border/70 bg-background/35 p-3.5 transition hover:bg-secondary/60",
                      isActive && "border-primary/20 bg-primary/10",
                    )
                  }
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                    <Icon className="size-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                </NavLink>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

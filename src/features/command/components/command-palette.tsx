import { Command } from "cmdk";
import {
  ArrowRight,
  Command as CommandIcon,
  FolderKanban,
  LayoutGrid,
  MoonStar,
  Search,
  SidebarClose,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { navigationItems } from "@/components/navigation/nav-items";
import { quickAddActions } from "@/features/quick-add/quick-add-actions";
import { useUiStore } from "@/store/ui-store";
import { useProjectsStore } from "@/store/projects-store";

export function CommandPalette() {
  const navigate = useNavigate();
  const open = useUiStore((state) => state.commandPaletteOpen);
  const setOpen = useUiStore((state) => state.setCommandPaletteOpen);
  const openQuickAdd = useUiStore((state) => state.openQuickAdd);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const toggleCompactMode = useUiStore((state) => state.toggleCompactMode);
  const projects = useProjectsStore((state) => state.projects);
  const run = (command: () => void) => {
    setOpen(false);
    command();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="top-[12vh] max-w-xl translate-y-0 overflow-hidden p-0 sm:top-1/2 sm:-translate-y-1/2">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <DialogDescription className="sr-only">
          Navigate Uthai Nexus or run a quick action
        </DialogDescription>
        <Command
          className="flex h-[min(32rem,76vh)] w-full flex-col bg-popover"
          loop
        >
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search className="size-4 text-muted-foreground" />
            <Command.Input
              autoFocus
              placeholder="Search pages, projects, or actions…"
              className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="rounded-md border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
              ESC
            </kbd>
          </div>
          <Command.List className="flex-1 overflow-y-auto p-2">
            <Command.Empty className="py-12 text-center text-sm text-muted-foreground">
              No command found.
            </Command.Empty>
            <Command.Group
              heading="Navigate"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Command.Item
                    key={item.path}
                    value={`navigate ${item.label} ${item.description}`}
                    onSelect={() => run(() => navigate(item.path))}
                    className="flex cursor-default items-center gap-3 rounded-xl px-3 py-2.5 text-sm aria-selected:bg-secondary"
                  >
                    <Icon className="size-4 text-muted-foreground" />
                    <span className="flex-1">{item.label}</span>
                    <ArrowRight className="size-3.5 text-muted-foreground/50" />
                  </Command.Item>
                );
              })}
            </Command.Group>
            <Command.Group
              heading="Quick add"
              className="mt-2 border-t border-border pt-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              {quickAddActions.slice(0, 9).map((action) => {
                const Icon = action.icon;
                return (
                  <Command.Item
                    key={action.id}
                    value={`add log create ${action.label} ${action.description}`}
                    onSelect={() =>
                      run(() =>
                        openQuickAdd({ action: action.id, source: "command" }),
                      )
                    }
                    className="flex cursor-default items-center gap-3 rounded-xl px-3 py-2.5 text-sm aria-selected:bg-secondary"
                  >
                    <Icon className="size-4 text-muted-foreground" />
                    <span>{action.label}</span>
                  </Command.Item>
                );
              })}
            </Command.Group>
            <Command.Group
              heading="Projects"
              className="mt-2 border-t border-border pt-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              {projects.map((project) => (
                <Command.Item
                  key={project.id}
                  value={`project ${project.name}`}
                  onSelect={() =>
                    run(() => navigate(`/projects/${project.id}`))
                  }
                  className="flex cursor-default items-center gap-3 rounded-xl px-3 py-2.5 text-sm aria-selected:bg-secondary"
                >
                  <FolderKanban className="size-4 text-muted-foreground" />
                  {project.name}
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Group
              heading="Workspace"
              className="mt-2 border-t border-border pt-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground"
            >
              <Command.Item
                onSelect={() => run(toggleSidebar)}
                className="flex cursor-default items-center gap-3 rounded-xl px-3 py-2.5 text-sm aria-selected:bg-secondary"
              >
                <SidebarClose className="size-4 text-muted-foreground" />
                Toggle sidebar
              </Command.Item>
              <Command.Item
                onSelect={() => run(toggleCompactMode)}
                className="flex cursor-default items-center gap-3 rounded-xl px-3 py-2.5 text-sm aria-selected:bg-secondary"
              >
                <LayoutGrid className="size-4 text-muted-foreground" />
                Toggle compact mode
              </Command.Item>
              <Command.Item
                onSelect={() => run(() => navigate("/settings"))}
                className="flex cursor-default items-center gap-3 rounded-xl px-3 py-2.5 text-sm aria-selected:bg-secondary"
              >
                <MoonStar className="size-4 text-muted-foreground" />
                Open appearance settings
              </Command.Item>
            </Command.Group>
          </Command.List>
          <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CommandIcon className="size-3" />
              Uthai Nexus commands
            </span>
            <span className="flex items-center gap-3">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

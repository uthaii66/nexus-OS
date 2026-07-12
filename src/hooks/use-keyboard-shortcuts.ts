import { useEffect } from "react";
import { useUiStore } from "@/store/ui-store";

export function useKeyboardShortcuts() {
  const setCommandPaletteOpen = useUiStore(
    (state) => state.setCommandPaletteOpen,
  );
  const openQuickAdd = useUiStore((state) => state.openQuickAdd);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const modifier = event.metaKey || event.ctrlKey;
      if (modifier && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (modifier && event.shiftKey && event.key.toLowerCase() === "a") {
        event.preventDefault();
        openQuickAdd({ source: "shortcut" });
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openQuickAdd, setCommandPaletteOpen]);
}

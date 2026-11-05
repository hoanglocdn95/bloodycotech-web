"use client";

import { Moon, Sun } from "lucide-react";
import { site } from "@/lib/site";

function applyTheme(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
  localStorage.setItem(site.themeStorageKey, theme);
}

export function ThemeToggle() {
  return (
    <button
      type="button"
      className="hud-button"
      aria-label="Đổi giao diện sáng hoặc tối"
      onClick={() => {
        const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
        applyTheme(next);
      }}
    >
      <Sun className="size-4 dark:hidden" aria-hidden="true" />
      <Moon className="hidden size-4 dark:block" aria-hidden="true" />
    </button>
  );
}

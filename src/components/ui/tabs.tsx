import React from "react";
import { cn } from "@/lib/utils";

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      className={cn(
        "inline-flex h-9 items-center justify-start rounded-lg bg-slate-100 p-1 text-slate-500 dark:bg-slate-800/80 dark:text-slate-400 gap-1",
        className
      )}
    >
      {children}
    </div>
  );
}

interface TabTriggerProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  badge?: number | string;
}

export function TabTrigger({
  active,
  onClick,
  children,
  className,
  badge,
}: TabTriggerProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-1.5",
        active
          ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100 font-semibold"
          : "hover:text-slate-700 dark:hover:text-slate-200 text-slate-500 dark:text-slate-400",
        className
      )}
    >
      {children}
      {badge !== undefined && (
        <span
          className={cn(
            "px-1.5 py-0.2 text-[10px] rounded-full",
            active
              ? "bg-fundu-100 text-fundu-800 dark:bg-fundu-900 dark:text-fundu-300"
              : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

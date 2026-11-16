import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "danger" | "info" | "purple" | "fundu";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900",
    fundu: "bg-fundu-50 text-fundu-700 border border-fundu-200 dark:bg-fundu-950/40 dark:text-fundu-300 dark:border-fundu-800",
    secondary: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700",
    outline: "text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 bg-transparent",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
    warning: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
    danger: "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
    info: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
    purple: "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-medium rounded-full",
    md: "px-2.5 py-0.5 text-xs font-medium rounded-md",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 transition-colors select-none font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

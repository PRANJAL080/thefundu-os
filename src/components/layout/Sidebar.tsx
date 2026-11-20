"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  Smartphone,
  ShoppingBag,
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCheck,
  Wrench,
  ReceiptText,
  FileText,
  RotateCcw,
  Truck,
  Handshake,
  Users,
  Building2,
  Headphones,
  BadgePercent,
  BarChart3,
  UserCheck,
  Bell,
  Code,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Store,
  ArrowRightLeft,
  Cpu,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: "fundu" | "warning" | "danger" | "purple";
  permissionKey?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar, qcInspections, repairs, devices, currentUser, rolePermissions, userRole } = useApp();

  const activeRole = currentUser?.role || userRole || "admin";
  const userAllowedPermissions = rolePermissions[activeRole] || rolePermissions["admin"] || [];

  const qcPendingCount = devices.filter((d) => d.status === "QC Pending").length;
  const repairsActiveCount = repairs.filter((r) => r.status === "In Progress" || r.status === "Pending").length;
  const inStockUnitsCount = devices.filter((d) => d.status === "In Stock" || d.status === "Ready for Sale").length;

  const navigationGroups: NavGroup[] = [
    {
      group: "Core Operations",
      items: [
        { title: "Overview", href: "/", icon: LayoutDashboard, permissionKey: "overview" },
        { title: "Inventory", href: "/inventory", icon: Boxes, badge: inStockUnitsCount, permissionKey: "inventory" },
        { title: "Products", href: "/products", icon: Smartphone, permissionKey: "inventory" },
        { title: "Accessories", href: "/accessories", icon: Headphones, permissionKey: "inventory" },
      ],
    },
    {
      group: "Inward & Quality",
      items: [
        { title: "Purchases", href: "/purchases", icon: ShoppingBag, permissionKey: "purchases" },
        { title: "Stock Inward", href: "/stock-inward", icon: ArrowDownToLine, permissionKey: "stock_inward" },
        { title: "Customer Buyback (Phone Sell)", href: "/buyback", icon: ArrowRightLeft, badge: "Sell Bill", badgeVariant: "fundu", permissionKey: "buyback" },
        {
          title: "Quality Check",
          href: "/quality-check",
          icon: CheckCheck,
          badge: qcPendingCount > 0 ? qcPendingCount : undefined,
          badgeVariant: "warning",
          permissionKey: "quality_check",
        },
        {
          title: "Repairs",
          href: "/repairs",
          icon: Wrench,
          badge: repairsActiveCount > 0 ? repairsActiveCount : undefined,
          badgeVariant: "purple",
          permissionKey: "repairs",
        },
        { title: "Spare Parts Desk", href: "/spare-parts", icon: Cpu, permissionKey: "spare_parts" },
      ],
    },
    {
      group: "Outward & Commerce",
      items: [
        { title: "Tax Invoice Desk", href: "/invoice", icon: FileText, badge: "GST", badgeVariant: "fundu", permissionKey: "invoice" },
        { title: "Store Sell Bills (Purchase)", href: "/buyback", icon: ReceiptText, badge: "Receipt", badgeVariant: "fundu", permissionKey: "buyback" },
        { title: "Warranty Portal", href: "/verify", icon: ShieldCheck, badge: "QR", badgeVariant: "fundu", permissionKey: "verify" },
        { title: "Day-End Closing", href: "/day-end-closing", icon: Receipt, badge: "Z-Slip", badgeVariant: "warning", permissionKey: "day_end_closing" },
        { title: "Stock Outward", href: "/stock-outward", icon: ArrowUpFromLine, permissionKey: "stock_outward" },
        { title: "Sales & Orders", href: "/sales", icon: ReceiptText, permissionKey: "sales" },
        { title: "Returns & Refunds", href: "/returns", icon: RotateCcw, permissionKey: "returns" },
      ],
    },
    {
      group: "Stores & Network",
      items: [
        { title: "Vendor Portal", href: "/vendors", icon: Handshake, badge: "VMP", badgeVariant: "fundu", permissionKey: "vendors" },
        { title: "Customers", href: "/customers", icon: Users, permissionKey: "customers" },
        { title: "Stores & Locations", href: "/warehouses", icon: Store, badge: "LKO-01", badgeVariant: "fundu", permissionKey: "stores" },
      ],
    },
    {
      group: "Finance & Intelligence",
      items: [
        { title: "Pricing & Profit", href: "/pricing-profit", icon: BadgePercent, permissionKey: "pricing_profit" },
        { title: "Reports & Analytics", href: "/reports", icon: BarChart3, permissionKey: "reports" },
      ],
    },
    {
      group: "Administration",
      items: [
        { title: "Employees", href: "/employees", icon: UserCheck, permissionKey: "employees" },
        { title: "Notifications", href: "/notifications", icon: Bell, permissionKey: "overview" },
        { title: "API Management", href: "/api-management", icon: Code, permissionKey: "settings" },
        { title: "Settings", href: "/settings", icon: Settings, permissionKey: "settings" },
      ],
    },
  ];

  const visibleGroups = React.useMemo(() => {
    return navigationGroups
      .map((grp) => ({
        ...grp,
        items: grp.items.filter((item) => {
          if (!item.permissionKey) return true;
          return userAllowedPermissions.includes(item.permissionKey);
        }),
      }))
      .filter((grp) => grp.items.length > 0);
  }, [navigationGroups, userAllowedPermissions]);

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-slate-200/80 bg-white dark:bg-slate-950 dark:border-slate-800/80 transition-all duration-300 z-30 select-none",
        isSidebarCollapsed ? "w-18" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800/80">
        {!isSidebarCollapsed ? (
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-fundu-600 text-white font-bold shadow-md shadow-fundu-600/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-1.5">
                TheFundu <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-fundu-100 dark:bg-fundu-950 text-fundu-700 dark:text-fundu-300">OS</span>
              </span>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate">
                Esterline Bonaparte Corp
              </span>
            </div>
          </Link>
        ) : (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-fundu-600 text-white font-bold shadow-md shadow-fundu-600/20">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
        )}
      </div>

      {/* Nav Items Container */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-6">
        {visibleGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {!isSidebarCollapsed && (
              <h4 className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {group.group}
              </h4>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={isSidebarCollapsed ? item.title : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium transition-all group relative",
                      isActive
                        ? "bg-fundu-50/80 text-fundu-800 dark:bg-fundu-950/40 dark:text-fundu-300 font-semibold"
                        : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100",
                      isSidebarCollapsed && "justify-center px-0"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors shrink-0",
                        isActive
                          ? "text-fundu-600 dark:text-fundu-400"
                          : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                      )}
                    />
                    {!isSidebarCollapsed && (
                      <span className="truncate flex-1">{item.title}</span>
                    )}

                    {!isSidebarCollapsed && item.badge !== undefined && (
                      <span
                        className={cn(
                          "ml-auto text-[10px] font-semibold px-1.5 py-0.2 rounded-full",
                          item.badgeVariant === "warning"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : item.badgeVariant === "purple"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}

                    {isSidebarCollapsed && item.badge !== undefined && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-fundu-500" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center gap-2 rounded-lg p-2 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

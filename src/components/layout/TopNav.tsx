"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  HelpCircle,
  Sun,
  Moon,
  Calendar,
  ChevronDown,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  LogOut,
  ExternalLink,
  ScanLine,
  Sparkles,
  Mic,
  Lock,
  KeyRound,
  Wrench,
  Shield,
  X,
  Edit2,
  Save,
  RefreshCw,
  Cloud,
  Upload,
  Download,
} from "lucide-react";
import { useApp, DateFilterType } from "@/lib/store";
import { UserRole } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface TopNavProps {
  onOpenGlobalSearch: () => void;
  onOpenBarcodeScanner?: () => void;
  onOpenAiCopilot?: () => void;
}

export function TopNav({ onOpenGlobalSearch, onOpenBarcodeScanner, onOpenAiCopilot }: TopNavProps) {
  const {
    theme,
    toggleTheme,
    dateFilter,
    setDateFilter,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    userRole,
    setUserRole,
    isCashierMode,
    showToast,
    currentUser,
    updateCurrentUserProfile,
    logout,
    devices,
    isCloudSyncing,
    syncWithCloud,
    exportStoreBackup,
    importStoreBackup,
  } = useApp();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  const handleBackupFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await importStoreBackup(file);
      setIsSyncModalOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editProfileName, setEditProfileName] = useState(currentUser?.name || "Abhay Verma");
  const [editProfileEmail, setEditProfileEmail] = useState(currentUser?.email || "admin@thefundu.com");
  const [editProfilePhone, setEditProfilePhone] = useState(currentUser?.phone || "+91 79919 90508");

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [targetRole, setTargetRole] = useState<UserRole | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const handleOpenEditProfile = () => {
    setEditProfileName(currentUser?.name || "Abhay Verma");
    setEditProfileEmail(currentUser?.email || "admin@thefundu.com");
    setEditProfilePhone(currentUser?.phone || "+91 79919 90508");
    setIsProfileOpen(false);
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProfileName.trim()) {
      showToast("Profile name cannot be blank.", "error");
      return;
    }
    updateCurrentUserProfile({
      name: editProfileName.trim(),
      email: editProfileEmail.trim(),
      phone: editProfilePhone.trim(),
    });
    setIsEditProfileOpen(false);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const dateOptions: { label: string; value: DateFilterType }[] = [
    { label: "Today", value: "today" },
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 30 Days", value: "30d" },
    { label: "This Month", value: "this_month" },
    { label: "Custom Range", value: "custom" },
  ];

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/95">
      {/* Left: Global Search trigger & Quick Date Filter */}
      <div className="flex items-center gap-3 flex-1 min-w-0 flex-nowrap">
        <button
          onClick={onOpenGlobalSearch}
          className="flex h-9 w-full max-w-xs md:max-w-sm items-center justify-between rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:bg-slate-900 transition-all shadow-xs shrink-0"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Search IMEI, SKU, customer, PO...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-500 dark:border-slate-700 dark:bg-slate-800 shrink-0">
            <span>⌘</span>K
          </kbd>
        </button>

        {/* Quick Barcode Scanner Trigger */}
        {onOpenBarcodeScanner && (
          <button
            onClick={onOpenBarcodeScanner}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-fundu-700 bg-fundu-50/80 hover:bg-fundu-100 dark:bg-fundu-950/60 dark:text-fundu-300 dark:hover:bg-fundu-900/80 border border-fundu-200/80 dark:border-fundu-800/80 rounded-lg transition-all shadow-xs shrink-0"
            title="Scan Phone IMEI with Handheld Barcode Gun (Press F2)"
          >
            <ScanLine className="h-3.5 w-3.5 text-fundu-600 dark:text-fundu-400" />
            <span>Scan Gun</span>
            <kbd className="hidden md:inline-flex items-center px-1 py-0.5 bg-white dark:bg-slate-800 border border-fundu-200 dark:border-fundu-700 rounded text-[9px] font-mono leading-none">
              F2
            </kbd>
          </button>
        )}

        {/* TheFundu AI Voice & Hindi Copilot Trigger */}
        {onOpenAiCopilot && (
          <button
            onClick={onOpenAiCopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-fundu-600 hover:from-violet-700 hover:to-fundu-700 rounded-lg transition-all shadow-xs shrink-0"
            title="Ask TheFundu AI Copilot in Hindi or English (Voice / Mic) [Press F3]"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span className="hidden sm:inline">AI Copilot</span>
            <Mic className="h-3 w-3 text-white/90" />
            <kbd className="hidden md:inline-flex items-center px-1 py-0.5 bg-white/20 border border-white/30 rounded text-[9px] font-mono leading-none">
              F3
            </kbd>
          </button>
        )}

        {/* Date Filter Badges */}
        <div className="hidden 2xl:flex items-center bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-800 shrink-0">
          {dateOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDateFilter(opt.value)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                dateFilter === opt.value
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs font-semibold"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Live Date Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-md border border-slate-200/60 dark:border-slate-800">
          <Calendar className="h-3.5 w-3.5 text-fundu-600 dark:text-fundu-400" />
          <span className="font-medium text-slate-800 dark:text-slate-200">
            Sat, 14 Nov 2026
          </span>
        </div>

        {/* Help Button */}
        <button
          onClick={() => setIsHelpOpen(true)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
          title="Help & Architecture Guide"
        >
          <HelpCircle className="h-4 w-4" />
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
          title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4 text-amber-400" />
          )}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-84 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <Badge variant="warning" size="sm">
                      {unreadCount} unread
                    </Badge>
                  )}
                </div>
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-[10px] text-fundu-600 hover:underline dark:text-fundu-400"
                >
                  Mark all read
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.slice(0, 5).map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                      notif.read
                        ? "bg-slate-50/50 border-slate-100 dark:bg-slate-900/40 dark:border-slate-800 text-slate-500"
                        : "bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-100 shadow-2xs"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {notif.type === "warning" && (
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      {notif.type === "success" && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      )}
                      {notif.type === "info" && (
                        <Info className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-xs font-semibold leading-tight">
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                          {notif.message}
                        </p>
                        <span className="text-[9px] text-slate-400 mt-1 inline-block">
                          {notif.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Multi-Laptop Cloud Sync Button */}
        <button
          onClick={() => setIsSyncModalOpen(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-all ${
            isCloudSyncing
              ? "bg-amber-50 text-amber-800 border-amber-300 animate-pulse dark:bg-amber-950/60 dark:text-amber-300"
              : "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
          }`}
          title="Multi-Laptop Cloud Sync: Keep both laptops updated with 75+ phones & store settings"
        >
          <Cloud className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden sm:inline font-bold">
            {isCloudSyncing ? "Syncing..." : `Cloud Sync (${devices.length})`}
          </span>
          <RefreshCw className={`h-3 w-3 text-emerald-600 dark:text-emerald-400 ${isCloudSyncing ? "animate-spin" : ""}`} />
        </button>

        {/* Role Switcher Pill */}
        <button
          onClick={() => {
            setIsRoleModalOpen(true);
            setTargetRole(null);
            setPinInput("");
            setPinError(false);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold shadow-xs transition-all ${
            userRole === "cashier"
              ? "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
              : userRole === "technician"
              ? "bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800"
              : userRole === "manager"
              ? "bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800"
              : "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
          }`}
          title="Switch Operating Role & Unlock Admin Mode"
        >
          {userRole === "cashier" ? (
            <Lock className="h-3.5 w-3.5 text-amber-600" />
          ) : userRole === "technician" ? (
            <Wrench className="h-3.5 w-3.5 text-purple-600" />
          ) : (
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          )}
          <span className="capitalize font-bold">
            {userRole === "cashier"
              ? "Cashier POS"
              : userRole === "technician"
              ? "Technician"
              : userRole === "manager"
              ? "Store Manager"
              : "Super Admin"}
          </span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg p-1 text-left hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center font-bold text-xs ring-2 ring-fundu-500/20">
              {(currentUser?.name || "Abhay Verma")
                .split(" ")
                .filter(Boolean)
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "AV"}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                {currentUser ? currentUser.name : "Abhay Verma"}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                {currentUser?.storeName ? `${currentUser.storeName.split(" ")[0]} • ${currentUser.role.toUpperCase()}` : "Super Admin"}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-68 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
              <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {currentUser ? currentUser.name : "Abhay Verma"}
                </p>
                <p className="text-[11px] text-slate-400">
                  {currentUser ? currentUser.email : "admin@thefundu.com"}
                </p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="h-3 w-3" />
                  <span className="capitalize">{currentUser?.role || userRole} Role</span> • {currentUser?.storeCode || "LKO-01"}
                </div>
              </div>

              {/* Quick Profile Edit Action */}
              <div className="py-1 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleOpenEditProfile}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-fundu-50 dark:hover:bg-fundu-950/40 hover:text-fundu-700 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Edit2 className="h-3.5 w-3.5 text-fundu-600" />
                    <span>Change Name &amp; Profile</span>
                  </span>
                  <span className="text-[10px] text-fundu-600 font-mono font-bold">Edit</span>
                </button>
              </div>

              <div className="py-1">
                <p className="px-2 py-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Organization
                </p>
                <p className="px-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                  Esterline Bonaparte Corp Pvt Ltd
                </p>
                <a
                  href="https://thefundu.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 flex items-center gap-1 text-xs text-fundu-600 hover:underline dark:text-fundu-400"
                >
                  <span>Visit thefundu.com</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Sign Out Button */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out of TheFundu OS</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Help Modal */}
      <Dialog
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="TheFundu Inventory OS Architecture & User Guide"
        description="Phase 1: Enterprise Refurbished Smartphone Operating System"
        maxWidth="2xl"
      >
        <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-3 bg-fundu-50 dark:bg-fundu-950/40 border border-fundu-200 dark:border-fundu-800 rounded-lg">
            <h4 className="font-semibold text-fundu-900 dark:text-fundu-300">
              Welcome to TheFundu Inventory OS
            </h4>
            <p className="mt-1">
              Engineered specifically for refurbished, open-box and pre-owned
              smartphone lifecycle management for Esterline Bonaparte Corporation Private Limited.
            </p>
          </div>

          <div>
            <h5 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Key Capabilities Built-In:
            </h5>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Individual IMEI Tracking:</strong> Every smartphone has its own unique SKU, dual IMEI, battery health, purchase cost, and condition grade (A+, A, B, C, D).
              </li>
              <li>
                <strong>13-Point Quality Inspection:</strong> Full hardware checklist: display, touch, battery, Face ID, fingerprint, dual cameras, speakers, mic, charging port, network, wifi, bluetooth, physical chassis.
              </li>
              <li>
                <strong>Multi-Warehouse Mesh:</strong> Real-time tracking across Mumbai Central Hub, Delhi NCR Depot, Bengaluru Tech Park, and Hyderabad Logistics.
              </li>
              <li>
                <strong>Landed Cost & Profit Simulator:</strong> Purchase price + testing + repair + packaging + logistics = total landed cost, with automated margin calculations.
              </li>
              <li>
                <strong>Keyboard Shortcuts:</strong> Press <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">⌘K</kbd> anywhere to search global records.
              </li>
            </ul>
          </div>
        </div>
      </Dialog>
      {/* Role Switcher & 4-Digit PIN Unlock Dialog */}
      <Dialog
        isOpen={isRoleModalOpen}
        onClose={() => {
          setIsRoleModalOpen(false);
          setTargetRole(null);
          setPinInput("");
          setPinError(false);
        }}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-fundu-50 dark:bg-fundu-950 text-fundu-600 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Switch User Role &amp; Permissions
                </h3>
                <p className="text-[11px] text-slate-500">
                  Current Role: <strong className="capitalize">{userRole}</strong>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsRoleModalOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Roles Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {[
              {
                id: "admin",
                title: "Super Admin (Vikram)",
                desc: "Full access to buy costs, margin audits & settings",
                requiresPin: true,
                badge: "PIN 1234",
              },
              {
                id: "manager",
                title: "Store Manager (Abhay)",
                desc: "Day-end closing, buyback, pricing approvals",
                requiresPin: true,
                badge: "PIN 1234",
              },
              {
                id: "cashier",
                title: "Cashier Mode (POS)",
                desc: "Hides buy costs (X) & profit margins from customer",
                requiresPin: false,
                badge: "1-Click Switch",
              },
              {
                id: "technician",
                title: "Technician Bay (Suresh)",
                desc: "Diagnostics, 42-point QC & spare parts usage",
                requiresPin: false,
                badge: "1-Click Switch",
              },
            ].map((r) => {
              const isSelected = (targetRole || userRole) === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    if (!r.requiresPin) {
                      setUserRole(r.id as UserRole);
                      showToast(`Role switched to ${r.title}!`, "success");
                      setIsRoleModalOpen(false);
                    } else {
                      setTargetRole(r.id as UserRole);
                      setPinInput("");
                      setPinError(false);
                    }
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-fundu-600 bg-fundu-50/50 dark:bg-fundu-950/40 text-fundu-900 dark:text-fundu-200 ring-2 ring-fundu-500/20"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-bold text-xs">{r.title}</p>
                    <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {r.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">{r.desc}</p>
                </button>
              );
            })}
          </div>

          {/* PIN Unlock Prompt if target role requires PIN */}
          {targetRole && (targetRole === "admin" || targetRole === "manager") && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <KeyRound className="h-4 w-4 text-fundu-600" />
                <span>Enter 4-Digit Security PIN to Unlock {targetRole.toUpperCase()}:</span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="password"
                  maxLength={4}
                  placeholder="PIN: 1234"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  className="font-mono text-center tracking-widest text-base h-9 max-w-[140px]"
                />
                <Button
                  variant="fundu"
                  size="sm"
                  onClick={() => {
                    if (pinInput === "1234") {
                      setUserRole(targetRole);
                      showToast(`Unlocked ${targetRole.toUpperCase()}! Full margin audit visible.`, "success");
                      setIsRoleModalOpen(false);
                      setTargetRole(null);
                    } else {
                      setPinError(true);
                      showToast("Invalid PIN. Default PIN is 1234.", "error");
                    }
                  }}
                  className="h-9 px-4 text-xs font-bold"
                >
                  Unlock Access
                </Button>
              </div>
              {pinError && (
                <p className="text-[10px] text-rose-600 font-semibold">
                  * Incorrect PIN. Default authorized PIN is 1234.
                </p>
              )}
            </div>
          )}
        </div>
      </Dialog>

      {/* Edit User Profile / Name Modal */}
      <Dialog
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Edit Administrator & Staff Profile"
        description="Set your own name, contact email, and mobile number. This will reflect across the entire OS and invoices."
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
              Your Full Name *
            </label>
            <Input
              value={editProfileName}
              onChange={(e) => setEditProfileName(e.target.value)}
              placeholder="e.g. Abhay Verma"
              className="font-medium text-xs"
              required
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              This name will be displayed in the top navbar, settlement logs, and reports.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Official Email
              </label>
              <Input
                type="email"
                value={editProfileEmail}
                onChange={(e) => setEditProfileEmail(e.target.value)}
                placeholder="admin@thefundu.com"
                className="text-xs"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Contact Phone
              </label>
              <Input
                value={editProfilePhone}
                onChange={(e) => setEditProfilePhone(e.target.value)}
                placeholder="+91 79919 90508"
                className="text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditProfileOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="fundu"
              size="sm"
              className="gap-1.5 font-semibold"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Profile Name</span>
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Multi-Laptop Cloud Sync & Data Migration Modal */}
      <Dialog
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        title="Multi-Laptop Cloud Sync & Data Management"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
            <Cloud className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                Live Cloud Sync Across Both Laptops
              </h4>
              <p className="text-emerald-700 dark:text-emerald-300 mt-1 leading-relaxed">
                TheFundu OS uses Supabase PostgreSQL cloud sync. When you add phones or update the store address on any laptop, click <strong>Sync With Cloud</strong> to automatically synchronize all <strong>{devices.length} handsets</strong> and store details across both laptops and mobile devices.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Action 1: Instant Cloud Sync */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <RefreshCw className={`h-4 w-4 text-fundu-600 ${isCloudSyncing ? "animate-spin" : ""}`} />
                  Automatic Cloud Sync
                </span>
                <p className="text-slate-500 text-[11px] mt-1.5 leading-snug">
                  Pulls new inventory from other laptops and uploads any new handsets added here directly to the cloud.
                </p>
              </div>
              <Button
                variant="fundu"
                size="sm"
                onClick={async () => {
                  await syncWithCloud();
                }}
                disabled={isCloudSyncing}
                className="mt-3 w-full font-bold h-8 text-xs gap-1.5"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isCloudSyncing ? "animate-spin" : ""}`} />
                <span>{isCloudSyncing ? "Synchronizing..." : "Sync With Cloud Now"}</span>
              </Button>
            </div>

            {/* Action 2: Direct Backup & Transfer File */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <Download className="h-4 w-4 text-blue-600" />
                  Manual Backup Transfer
                </span>
                <p className="text-slate-500 text-[11px] mt-1.5 leading-snug">
                  Export complete store state (all {devices.length} handsets, invoices, addresses) to a backup file to transfer between laptops.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportStoreBackup}
                  className="font-semibold h-8 text-[11px] gap-1 px-2"
                  title="Download full backup JSON"
                >
                  <Download className="h-3 w-3" />
                  <span>Export</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="font-semibold h-8 text-[11px] gap-1 px-2 border-fundu-300 text-fundu-700 bg-fundu-50/50 hover:bg-fundu-100"
                  title="Load backup JSON from another laptop"
                >
                  <Upload className="h-3 w-3" />
                  <span>Import</span>
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".json"
                  onChange={handleBackupFileChange}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 text-right">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSyncModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Dialog>
    </header>
  );
}

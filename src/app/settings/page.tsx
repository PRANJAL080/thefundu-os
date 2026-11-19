"use client";

import React, { useState } from "react";
import {
  Settings,
  Building2,
  Database,
  Printer,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Landmark,
  ScanLine,
  Sliders,
  Sun,
  Moon,
  Sparkles,
  Info,
  Store,
  FileText,
  Lock,
  UserCheck,
  Plus,
  Trash2,
  RotateCcw,
  MapPin,
  Phone,
  User,
  ShieldAlert,
  Eye,
  EyeOff,
  Edit2,
  Pencil,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { UserRole, Warehouse } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { DEFAULT_INVOICE_TERMS, COMPANY_CONFIG, DEFAULT_ROLE_PERMISSIONS, INITIAL_USERS } from "@/lib/company-config";
import { testSupabaseConnection } from "@/lib/supabase";

type SettingsTab =
  | "company"
  | "stores"
  | "terms"
  | "permissions"
  | "database"
  | "hardware"
  | "compliance"
  | "theme";

// Systematic catalog of all operational desk modules for granular RBAC
const ALL_SYSTEM_MODULES = [
  { key: "overview", label: "Overview Dashboard", category: "Core Operations", description: "Real-time revenue, stock counts, KPI widgets" },
  { key: "inventory", label: "Smartphone Stock Ledger", category: "Core Operations", description: "IMEI serial stock, battery health, status" },
  { key: "inventory_cost_view", label: "Internal Purchase Cost (X)", category: "Financial Privacy", description: "Internal buy cost & margin audit visibility" },
  { key: "purchases", label: "Purchases & Inward POs", category: "Inward & Quality", description: "B2B procurement orders from vendors" },
  { key: "stock_inward", label: "Stock Inward Desk", category: "Inward & Quality", description: "Receive batches and assign serial numbers" },
  { key: "buyback", label: "Customer Buyback / Trade-In", category: "Inward & Quality", description: "Counter exchange valuation and CEIR declaration" },
  { key: "quality_check", label: "42-Point QC Inspections", category: "Inward & Quality", description: "Diagnostics checklists and QC pass stamp" },
  { key: "repairs", label: "Technician Repair Jobs", category: "Inward & Quality", description: "Hardware work orders and repair job cards" },
  { key: "spare_parts", label: "Spare Parts & Component Stock", category: "Inward & Quality", description: "OEM batteries, displays, camera modules stock" },
  { key: "invoice", label: "Tax Invoice Desk (Rule 32)", category: "Outward & Commerce", description: "Generate GST Margin invoices and print receipts" },
  { key: "invoice_margin_breakdown", label: "Rule 32(5) Margin Calculator", category: "Financial Privacy", description: "Gross margin Z calculation & 18% tax breakdown" },
  { key: "ca_audit_export", label: "Export CA Margin Audit", category: "Financial Privacy", description: "1-click statutory Rule 32 margin audit CSV" },
  { key: "stock_outward", label: "Stock Outward Desk", category: "Outward & Commerce", description: "Dispatch handsets to customers or branches" },
  { key: "sales", label: "Sales & Orders", category: "Outward & Commerce", description: "FSO, ONS, FOR, DS order tracking" },
  { key: "returns", label: "Returns & Refunds", category: "Outward & Commerce", description: "RMA processing and replacement stock" },
  { key: "day_end_closing", label: "Store Cash Drawer (Z-Report)", category: "Outward & Commerce", description: "Evening physical cash and handset tally" },
  { key: "stores", label: "Stores & Locations", category: "Stores & Network", description: "Manage Lucknow, Kanpur, Delhi branch stores" },
  { key: "vendors", label: "Vendor Management", category: "Stores & Network", description: "B2B suppliers, consignments, payouts" },
  { key: "customers", label: "Customer Directory", category: "Stores & Network", description: "Customer history, warranties, purchase logs" },
  { key: "pricing_profit", label: "Pricing & Profit Engine", category: "Finance & Intelligence", description: "Price tiers, target margins, simulator" },
  { key: "reports", label: "Reports & Financial Analytics", category: "Finance & Intelligence", description: "Profitability reports and executive metrics" },
  { key: "employees", label: "Employee Management", category: "Administration", description: "Staff directories, roles, and store shifts" },
  { key: "settings", label: "System Master Configuration", category: "Administration", description: "Company legal profile, Supabase sync, hardware" },
];

export default function SettingsPage() {
  const {
    theme,
    toggleTheme,
    showToast,
    currentUser,
    systemUsers,
    updateSystemUser,
    updateCurrentUserProfile,
    rolePermissions,
    updateRolePermissions,
    warehouses,
    addStore,
    updateStore,
    deleteStore,
    selectedStoreId,
    setSelectedStoreId,
    invoiceSettings,
    updateInvoiceSettings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<SettingsTab>("permissions");

  // Role Assignee Editing state
  const [editingRoleAssignee, setEditingRoleAssignee] = useState<UserRole | null>(null);
  const [rolePersonName, setRolePersonName] = useState("");
  const [rolePersonEmail, setRolePersonEmail] = useState("");
  const [rolePersonPhone, setRolePersonPhone] = useState("");
  const [rolePersonPin, setRolePersonPin] = useState("1234");
  const [rolePersonPassword, setRolePersonPassword] = useState("");

  const handleOpenEditRoleAssignee = (role: UserRole) => {
    const user =
      (systemUsers && systemUsers.find((u) => u.role === role)) ||
      INITIAL_USERS.find((u) => u.role === role);
    setEditingRoleAssignee(role);
    setRolePersonName(
      user?.name || (role === "admin" ? currentUser?.name || "Abhay Verma" : "Staff Member")
    );
    setRolePersonEmail(user?.email || `${role}@thefundu.com`);
    setRolePersonPhone(user?.phone || "+91 79919 90508");
    setRolePersonPin(user?.pin || "1234");
    setRolePersonPassword(user?.password || `${role}123`);
  };

  const handleSaveRoleAssignee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoleAssignee) return;
    if (!rolePersonName.trim()) {
      showToast("Person name cannot be blank.", "error");
      return;
    }
    updateSystemUser(editingRoleAssignee, {
      name: rolePersonName.trim(),
      email: rolePersonEmail.trim(),
      phone: rolePersonPhone.trim(),
      pin: rolePersonPin.trim(),
      password: rolePersonPassword.trim() || `${editingRoleAssignee}123`,
    });
    setEditingRoleAssignee(null);
    showToast(
      `Role assignee for ${editingRoleAssignee.toUpperCase()} updated to "${rolePersonName.trim()}"!`,
      "success"
    );
  };

  // Company Profile
  const [companyName, setCompanyName] = useState(
    invoiceSettings?.companyLegalName || COMPANY_CONFIG.legalName
  );
  const [brandName, setBrandName] = useState(COMPANY_CONFIG.brandName);
  const [website, setWebsite] = useState(COMPANY_CONFIG.website);
  const [cin, setCin] = useState(invoiceSettings?.cin || COMPANY_CONFIG.cin);
  const [gstin, setGstin] = useState(invoiceSettings?.gstin || COMPANY_CONFIG.gstin);
  const [pan, setPan] = useState(invoiceSettings?.pan || COMPANY_CONFIG.pan);
  const [stateCode, setStateCode] = useState(
    `${invoiceSettings?.stateCode || COMPANY_CONFIG.stateCode} - ${invoiceSettings?.stateName || COMPANY_CONFIG.stateName}`
  );
  const [registeredAddress, setRegisteredAddress] = useState(
    invoiceSettings?.registeredAddress || COMPANY_CONFIG.registeredAddress
  );
  const [bankName, setBankName] = useState("HDFC Bank Limited");
  const [bankAccount, setBankAccount] = useState("50200084918234");
  const [bankIfsc, setBankIfsc] = useState("HDFC0000060");
  const [upiId, setUpiId] = useState("thefundu@hdfcbank");

  // Terms and conditions state
  const [terms, setTerms] = useState<string[]>(
    invoiceSettings?.termsAndConditions && invoiceSettings.termsAndConditions.length > 0
      ? invoiceSettings.termsAndConditions
      : DEFAULT_INVOICE_TERMS
  );

  // New store form state
  const [newStoreCode, setNewStoreCode] = useState("");
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreAddress, setNewStoreAddress] = useState("");
  const [newStoreCity, setNewStoreCity] = useState("Lucknow");
  const [newStoreManager, setNewStoreManager] = useState("");
  const [newStorePhone, setNewStorePhone] = useState("+91 79919 90508");

  // Edit store modal state
  const [editingStore, setEditingStore] = useState<Warehouse | null>(null);
  const [isEditStoreOpen, setIsEditStoreOpen] = useState(false);
  const [editStoreCode, setEditStoreCode] = useState("");
  const [editStoreName, setEditStoreName] = useState("");
  const [editStoreAddress, setEditStoreAddress] = useState("");
  const [editStoreCity, setEditStoreCity] = useState("Lucknow");
  const [editStoreManager, setEditStoreManager] = useState("");
  const [editStorePhone, setEditStorePhone] = useState("+91 79919 90508");
  const [editStoreStatus, setEditStoreStatus] = useState<"Active" | "Upcoming" | "Inactive">("Active");

  const handleOpenEditStore = (wh: Warehouse) => {
    setEditingStore(wh);
    setEditStoreCode(wh.code || "");
    setEditStoreName(wh.name || "");
    setEditStoreAddress(wh.address || "");
    setEditStoreCity(wh.city || wh.location || "Lucknow");
    setEditStoreManager(wh.managerName || "");
    setEditStorePhone((wh as any).managerPhone || (wh as any).phone || "+91 79919 90508");
    setEditStoreStatus(wh.status || "Active");
    setIsEditStoreOpen(true);
  };

  const handleSaveEditStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStore) return;
    if (!editStoreName.trim()) {
      showToast("Store Outlet Name is required.", "error");
      return;
    }
    const cleanCode = (editStoreCode || editingStore.code || "STORE").toUpperCase().trim();

    updateStore(editingStore.id, {
      code: cleanCode,
      name: editStoreName.trim(),
      address: editStoreAddress.trim() || `${editStoreCity}, Uttar Pradesh`,
      city: editStoreCity.trim() || "Lucknow",
      location: editStoreCity.trim() || "Lucknow",
      managerName: editStoreManager.trim() || "Store Manager",
      managerPhone: editStorePhone.trim() || "+91 79919 90508",
      status: editStoreStatus,
    });

    setIsEditStoreOpen(false);
    setEditingStore(null);
    showToast(`Store outlet "${cleanCode}" updated successfully! Invoice headers will reflect these changes.`, "success");
  };

  const handleDeleteStore = (wh: Warehouse) => {
    if (warehouses.length <= 1) {
      showToast("Cannot delete the only configured primary store outlet.", "error");
      return;
    }
    if (window.confirm(`Are you sure you want to remove store outlet "${wh.name}" (${wh.code})?`)) {
      deleteStore(wh.id);
    }
  };

  // RBAC permissions state
  const [selectedRole, setSelectedRole] = useState<UserRole>("manager");
  const [currentPerms, setCurrentPerms] = useState<string[]>(
    rolePermissions[selectedRole] || DEFAULT_ROLE_PERMISSIONS[selectedRole] || []
  );

  // When switching role in RBAC tab, update current checklist
  const handleSelectRole = (r: UserRole) => {
    setSelectedRole(r);
    setCurrentPerms(rolePermissions[r] || DEFAULT_ROLE_PERMISSIONS[r] || []);
  };

  const handleTogglePermission = (key: string) => {
    if (selectedRole === "admin" && key === "settings") {
      showToast("Settings permission cannot be revoked from Super Admin", "error");
      return;
    }
    const updated = currentPerms.includes(key)
      ? currentPerms.filter((p) => p !== key)
      : [...currentPerms, key];
    setCurrentPerms(updated);
  };

  const handleSaveRolePermissions = () => {
    updateRolePermissions(selectedRole, currentPerms);
    showToast(
      `Permissions for role "${selectedRole.toUpperCase()}" updated successfully! Menu is refreshed.`,
      "success"
    );
  };

  const handleResetRolePermissions = () => {
    const defaults = DEFAULT_ROLE_PERMISSIONS[selectedRole] || [];
    setCurrentPerms(defaults);
    updateRolePermissions(selectedRole, defaults);
    showToast(`Reset ${selectedRole.toUpperCase()} permissions to standard factory defaults.`, "info");
  };

  // Database & Cloud
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");
  const [databaseUrl, setDatabaseUrl] = useState("");
  const [dbStatus, setDbStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [dbStatusMsg, setDbStatusMsg] = useState("");
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Hardware Defaults
  const [defaultLabelSize, setDefaultLabelSize] = useState<"50x25" | "50x38" | "100x50">("50x38");
  const [scannerBeep, setScannerBeep] = useState(true);
  const [printerDpi, setPrinterDpi] = useState("203");

  // Compliance
  const [minBatteryGradeA, setMinBatteryGradeA] = useState(85);
  const [defaultTargetMargin, setDefaultTargetMargin] = useState(18);
  const [defaultWarrantyMonths, setDefaultWarrantyMonths] = useState(6);

  // Save company details
  const handleSaveCompany = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateInvoiceSettings({
      companyLegalName: companyName,
      cin,
      gstin,
      pan,
      registeredAddress,
    });
    showToast("Corporate CIN, GSTIN & Company details saved successfully!", "success");
  };

  // Store management
  const handleAddStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim()) {
      showToast("Store Outlet Name is required", "error");
      return;
    }
    const cleanCode = (newStoreCode || `LKO-0${warehouses.length + 1}`).toUpperCase().trim();
    addStore({
      code: cleanCode,
      name: newStoreName.includes(cleanCode) ? newStoreName : `${newStoreName} (${cleanCode})`,
      address: newStoreAddress.trim() || `${newStoreCity}, Uttar Pradesh`,
      city: newStoreCity.trim() || "Lucknow",
      managerName: newStoreManager.trim() || "Store Manager",
      managerPhone: newStorePhone.trim() || "+91 79919 90508",
      location: newStoreCity,
      status: "Active",
    });
    setNewStoreCode("");
    setNewStoreName("");
    setNewStoreAddress("");
    setNewStoreManager("");
    showToast(`Store outlet ${cleanCode} registered successfully!`, "success");
  };

  // Terms management
  const handleSaveTerms = () => {
    updateInvoiceSettings({ termsAndConditions: terms });
    showToast("Invoice Terms & Conditions saved successfully!", "success");
  };

  const handleTestDatabase = async () => {
    setDbStatus("testing");
    setDbStatusMsg("Testing connection to Supabase PostgreSQL cluster...");
    const result = await testSupabaseConnection({
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
      databaseUrl: databaseUrl,
    });
    if (result.success) {
      setDbStatus("success");
      setDbStatusMsg(result.message);
      showToast("Supabase Database connection successful!", "success");
    } else {
      setDbStatus("error");
      setDbStatusMsg(result.message);
      showToast(result.message, "error");
    }
  };

  const handleCopySchemaCommand = () => {
    const cmd = `-- Execute this in Supabase SQL Editor:
-- File is located at: supabase/schema.sql
-- Run: npx prisma db push (to automatically sync all tables)`;
    navigator.clipboard.writeText(cmd);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
    showToast("Schema instructions copied to clipboard!", "info");
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>System Master Configuration</span>
            <Badge variant="fundu" size="sm">
              Super Admin Control
            </Badge>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage ID/Password role permissions, multi-store outlets, English warranty terms, and corporate CIN/GSTIN.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs py-1 px-2.5">
            Admin: <span className="font-bold text-fundu-700 dark:text-fundu-400 ml-1">{currentUser?.name || "Abhay Verma"}</span>
          </Badge>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleOpenEditRoleAssignee("admin")}
            className="h-7 px-2.5 text-[11px] gap-1 text-fundu-700 dark:text-fundu-300 border-fundu-200 dark:border-fundu-800 hover:bg-fundu-50 font-semibold"
          >
            <Edit2 className="h-3 w-3" />
            <span>Change Name</span>
          </Button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab("permissions")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "permissions"
              ? "bg-fundu-50 dark:bg-fundu-950/60 text-fundu-700 dark:text-fundu-300 font-semibold"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
          }`}
        >
          <Lock className="h-3.5 w-3.5 text-fundu-600" />
          <span>Role Permissions (RBAC)</span>
        </button>

        <button
          onClick={() => setActiveTab("stores")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "stores"
              ? "bg-fundu-50 dark:bg-fundu-950/60 text-fundu-700 dark:text-fundu-300 font-semibold"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
          }`}
        >
          <Store className="h-3.5 w-3.5" />
          <span>Store Outlets ({warehouses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("terms")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "terms"
              ? "bg-fundu-50 dark:bg-fundu-950/60 text-fundu-700 dark:text-fundu-300 font-semibold"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Warranty Terms &amp; Jurisdiction</span>
        </button>

        <button
          onClick={() => setActiveTab("company")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "company"
              ? "bg-fundu-50 dark:bg-fundu-950/60 text-fundu-700 dark:text-fundu-300 font-semibold"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>Company &amp; GST Details</span>
        </button>

        <button
          onClick={() => setActiveTab("database")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "database"
              ? "bg-fundu-50 dark:bg-fundu-950/60 text-fundu-700 dark:text-fundu-300 font-semibold"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
          }`}
        >
          <Database className="h-3.5 w-3.5" />
          <span>Database &amp; Cloud Sync</span>
          {dbStatus === "success" && (
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("hardware")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "hardware"
              ? "bg-fundu-50 dark:bg-fundu-950/60 text-fundu-700 dark:text-fundu-300 font-semibold"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
          }`}
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Hardware &amp; Scanners</span>
        </button>

        <button
          onClick={() => setActiveTab("compliance")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "compliance"
              ? "bg-fundu-50 dark:bg-fundu-950/60 text-fundu-700 dark:text-fundu-300 font-semibold"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Rule 32(5) Policies</span>
        </button>

        <button
          onClick={() => setActiveTab("theme")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "theme"
              ? "bg-fundu-50 dark:bg-fundu-950/60 text-fundu-700 dark:text-fundu-300 font-semibold"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
          }`}
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>Theme &amp; Appearance</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB: ROLE-BASED ACCESS CONTROL (RBAC PERMISSIONS MATRIX) */}
      {/* ============================================================== */}
      {activeTab === "permissions" && (
        <div className="space-y-4 text-xs animate-in fade-in duration-150">
          <Card className="border-fundu-200 dark:border-fundu-900 bg-gradient-to-r from-fundu-50/30 via-white to-transparent dark:from-fundu-950/20 dark:via-slate-900">
            <CardHeader className="pb-3 border-b border-fundu-100 dark:border-fundu-950">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-fundu-600" />
                    <span>Granular Role Permissions &amp; Menu Visibility Matrix</span>
                  </CardTitle>
                  <CardDescription className="text-[11px] mt-0.5">
                    Super Admin can choose exactly which operational desks and financial numbers are shown to each role.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResetRolePermissions}
                    className="gap-1 text-xs text-slate-500"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset to Defaults</span>
                  </Button>

                  <Button
                    type="button"
                    variant="fundu"
                    size="sm"
                    onClick={handleSaveRolePermissions}
                    className="gap-1.5 font-semibold shadow-xs"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Apply Permissions</span>
                  </Button>
                </div>
              </div>

              {/* Role Selection Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
                {[
                  {
                    role: "admin" as const,
                    title: "Super Admin",
                    desc: "Full Master Access, Financials & CA Audits",
                    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
                  },
                  {
                    role: "manager" as const,
                    title: "Store Head",
                    desc: "Store Billing, Inventory & Buyback Desk",
                    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
                  },
                  {
                    role: "cashier" as const,
                    title: "POS Cashier",
                    desc: "Counter Sales (Buy Cost X 100% Hidden)",
                    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
                  },
                  {
                    role: "technician" as const,
                    title: "Technician",
                    desc: "42-Point QC & Repair Job Work Orders",
                    badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
                  },
                ].map((item) => {
                  const isSelected = selectedRole === item.role;
                  const roleUser =
                    (systemUsers && systemUsers.find((u) => u.role === item.role)) ||
                    INITIAL_USERS.find((u) => u.role === item.role);
                  const personName =
                    item.role === "admin"
                      ? currentUser?.name || roleUser?.name || "Abhay Verma"
                      : roleUser?.name || "Staff Member";

                  return (
                    <div
                      key={item.role}
                      onClick={() => handleSelectRole(item.role)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? "border-fundu-600 bg-fundu-50/80 dark:bg-fundu-950/60 ring-2 ring-fundu-500 shadow-xs"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                          {item.title}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${item.badgeColor}`}>
                          {item.role}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate max-w-[105px]">
                          {personName}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-5 px-1.5 text-[9px] gap-1 text-fundu-700 dark:text-fundu-400 hover:bg-fundu-100/60 font-semibold"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditRoleAssignee(item.role);
                          }}
                          title={`Change name and credentials for ${item.title}`}
                        >
                          <Edit2 className="h-2.5 w-2.5" />
                          <span>Edit</span>
                        </Button>
                      </div>

                      <p className="text-[9.5px] text-slate-400 dark:text-slate-500 mt-1 line-clamp-1">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                  Permitted Modules &amp; Visibility for:{" "}
                  <span className="uppercase text-fundu-700 dark:text-fundu-400 font-mono">
                    {selectedRole}
                  </span>{" "}
                  ({currentPerms.length} allowed of {ALL_SYSTEM_MODULES.length})
                </span>
                <span className="text-[11px] text-slate-400">
                  Checked modules are rendered on the sidebar and accessible.
                </span>
              </div>

              {/* Module Checkbox Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {ALL_SYSTEM_MODULES.map((mod) => {
                  const isChecked = currentPerms.includes(mod.key);
                  const isCostLocked =
                    selectedRole === "cashier" &&
                    (mod.key === "inventory_cost_view" ||
                      mod.key === "invoice_margin_breakdown" ||
                      mod.key === "ca_audit_export");

                  return (
                    <label
                      key={mod.key}
                      className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        isChecked
                          ? "bg-fundu-50/50 dark:bg-fundu-950/30 border-fundu-200 dark:border-fundu-900"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60"
                      } ${isCostLocked ? "border-amber-300 dark:border-amber-900" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleTogglePermission(mod.key)}
                        className="rounded border-slate-300 text-fundu-600 focus:ring-fundu-500 mt-0.5 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900 dark:text-slate-100 text-[11px]">
                            {mod.label}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                            {mod.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {mod.description}
                        </p>
                        {isCostLocked && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 dark:text-amber-400 mt-0.5">
                            <Lock className="h-2.5 w-2.5" />
                            <span>Confidential: Hidden on POS counter screen</span>
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2 border-t">
                <Button
                  type="button"
                  variant="fundu"
                  size="sm"
                  onClick={handleSaveRolePermissions}
                  className="gap-1.5 font-semibold"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save {selectedRole.toUpperCase()} Permissions</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: STORE OUTLETS & BRANCHES */}
      {/* ============================================================== */}
      {activeTab === "stores" && (
        <div className="space-y-4 text-xs animate-in fade-in duration-150">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Store className="h-4 w-4 text-fundu-600" />
                    <span>Configured Store Outlets ({warehouses.length})</span>
                  </CardTitle>
                  <CardDescription className="text-[11px]">
                    Stores can be created with their unique code (e.g. LKO-01, KNP-01). Invoices print that store's address and code.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {warehouses.map((wh) => {
                  const isSelected = selectedStoreId === wh.id || selectedStoreId === wh.code;
                  return (
                    <div
                      key={wh.id}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-fundu-500 bg-fundu-50/50 dark:bg-fundu-950/30 ring-1 ring-fundu-500 shadow-xs"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate">
                            {wh.name}
                          </span>
                          {isSelected && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-fundu-100 text-fundu-800 dark:bg-fundu-900/60 dark:text-fundu-300 shrink-0">
                              Active Billing
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Badge variant={isSelected ? "fundu" : "outline"} size="sm">
                            {wh.code || "STORE"}
                          </Badge>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-[10px] gap-1 text-fundu-700 dark:text-fundu-300 border-fundu-300 dark:border-fundu-800 hover:bg-fundu-50 dark:hover:bg-fundu-950/60 font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditStore(wh);
                            }}
                          >
                            <Edit2 className="h-2.5 w-2.5" />
                            <span>Edit</span>
                          </Button>
                          {warehouses.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteStore(wh);
                              }}
                              title="Delete store outlet"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {wh.address}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 border-t pt-1.5">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{wh.managerName || "Store Head"}</span>
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="h-3 w-3" />
                          <span>{(wh as any).managerPhone || (wh as any).phone || "+91 79919 90508"}</span>
                        </span>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStoreId(wh.id);
                            showToast(`Active invoice store set to ${wh.name} (${wh.code})!`, "success");
                          }}
                          className={`font-semibold transition-colors ${
                            isSelected
                              ? "text-fundu-600 dark:text-fundu-400 cursor-default"
                              : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 underline decoration-slate-300"
                          }`}
                        >
                          {isSelected ? "✓ Default for Tax Invoices" : "Make Default for Invoices"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditStore(wh)}
                          className="font-medium text-fundu-600 dark:text-fundu-400 hover:underline flex items-center gap-1"
                        >
                          <Pencil className="h-2.5 w-2.5" />
                          <span>Edit Details</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Store Outlet Form */}
              <form
                onSubmit={handleAddStore}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Plus className="h-4 w-4 text-fundu-600" />
                    <span>Register New Store Outlet</span>
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Instantly available on Invoicing &amp; Stock Transfer
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Store Code *</label>
                    <Input
                      placeholder="e.g. LKO-03, VNS-01"
                      value={newStoreCode}
                      onChange={(e) => setNewStoreCode(e.target.value)}
                      className="font-mono uppercase font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-semibold block mb-1">Store Outlet Name *</label>
                    <Input
                      placeholder="e.g. Lucknow Hazratganj Boutique Store"
                      value={newStoreName}
                      onChange={(e) => setNewStoreName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="font-semibold block mb-1">Store Address (Printed on Invoices) *</label>
                    <Input
                      placeholder="e.g. 14/B, M.G. Marg, Hazratganj, Lucknow, UP 226001"
                      value={newStoreAddress}
                      onChange={(e) => setNewStoreAddress(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">City</label>
                    <Input
                      value={newStoreCity}
                      onChange={(e) => setNewStoreCity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold block mb-1">Store Manager Name</label>
                    <Input
                      placeholder="e.g. Amit Shukla"
                      value={newStoreManager}
                      onChange={(e) => setNewStoreManager(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="font-semibold block mb-1">Store Contact Phone</label>
                    <Input
                      placeholder="+91 79919 90508"
                      value={newStorePhone}
                      onChange={(e) => setNewStorePhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <Button type="submit" variant="fundu" size="sm" className="gap-1.5 font-semibold">
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Store Outlet</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: WARRANTY TERMS & JURISDICTION */}
      {/* ============================================================== */}
      {activeTab === "terms" && (
        <div className="space-y-4 text-xs animate-in fade-in duration-150">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-fundu-600" />
                    <span>Statutory Invoice Terms &amp; Warranty Policy</span>
                  </CardTitle>
                  <CardDescription className="text-[11px]">
                    Simple and clear warranty terms, mandatory original bill policy, and exclusive Lucknow jurisdiction.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-300 flex items-start gap-2.5 text-[11px]">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <p className="font-bold">Simple &amp; Clear Terms (Printed on Customer Bills)</p>
                  <p className="text-[10.5px] mt-0.5">
                    1. No Physical / Liquid Damage &nbsp;|&nbsp; 2. Original Bill Mandatory &nbsp;|&nbsp; 3. Lucknow Jurisdiction &nbsp;|&nbsp; 4. No Cash Refund &nbsp;|&nbsp; 5. Support &amp; Service.
                  </p>
                </div>
              </div>

              {/* Clause List */}
              <div className="space-y-3">
                {terms.map((clause, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                        Clause {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => setTerms(terms.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete this clause"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={clause}
                      onChange={(e) => {
                        const updated = [...terms];
                        updated[idx] = e.target.value;
                        setTerms(updated);
                      }}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/60 p-2.5 text-xs leading-relaxed dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setTerms([
                        ...terms,
                        `${terms.length + 1}. Additional Term: Warranty and replacement terms apply under company policy.`,
                      ])
                    }
                    className="gap-1 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Clause</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTerms(DEFAULT_INVOICE_TERMS);
                      updateInvoiceSettings({ termsAndConditions: DEFAULT_INVOICE_TERMS });
                      showToast("Reset to official standard 5 English clauses!", "info");
                    }}
                    className="gap-1 text-xs text-slate-500"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset Standard Terms</span>
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="fundu"
                  size="sm"
                  onClick={handleSaveTerms}
                  className="gap-1.5 font-semibold"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Terms &amp; Conditions</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 1: COMPANY & GST PROFILE */}
      {/* ============================================================== */}
      {activeTab === "company" && (
        <div className="space-y-6 text-xs animate-in fade-in duration-150">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="h-4 w-4 text-fundu-600" />
                <span>Legal Corporate Entity &amp; Branding</span>
              </CardTitle>
              <CardDescription>
                These details are automatically printed on official Cashify-format GST Tax Invoices and customer receipts.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Registered Legal Entity Name *</label>
                  <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Consumer Brand Name *</label>
                  <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Corporate CIN *</label>
                  <Input value={cin} onChange={(e) => setCin(e.target.value)} />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Corporate GSTIN Number *</label>
                  <Input value={gstin} onChange={(e) => setGstin(e.target.value)} />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Company PAN *</label>
                  <Input value={pan} onChange={(e) => setPan(e.target.value)} />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Home State &amp; Code *</label>
                  <Input value={stateCode} onChange={(e) => setStateCode(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Registered Corporate Office Address (Printed on Invoices)</label>
                <Input value={registeredAddress} onChange={(e) => setRegisteredAddress(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Customer Support (Call &amp; WhatsApp)</label>
                  <Input
                    value={invoiceSettings?.tollFree || "Call & WhatsApp: 6390616616"}
                    onChange={(e) => updateInvoiceSettings({ tollFree: e.target.value, whatsappPhone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Official Support Email</label>
                  <Input
                    value={invoiceSettings?.supportEmail || "support@thefundu.com"}
                    onChange={(e) => updateInvoiceSettings({ supportEmail: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button variant="fundu" size="sm" onClick={handleSaveCompany} className="gap-1.5 font-semibold">
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Company Legal Profile</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm flex items-center gap-2">
                <Landmark className="h-4 w-4 text-fundu-600" />
                <span>Bank Account &amp; Payment Gateway (For Invoice Footer &amp; UPI QR)</span>
              </CardTitle>
              <CardDescription>
                Official bank details displayed on customer bills for direct NEFT/RTGS/IMPS and UPI settlements.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Bank Name &amp; Branch</label>
                  <Input value={bankName} onChange={(e) => setBankName(e.target.value)} />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Current Account Number</label>
                  <Input value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-1">IFSC Code</label>
                  <Input value={bankIfsc} onChange={(e) => setBankIfsc(e.target.value)} />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Company Virtual Payment Address (UPI ID)</label>
                  <Input value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: DATABASE & CLOUD SYNC */}
      {/* ============================================================== */}
      {activeTab === "database" && (
        <div className="space-y-6 text-xs animate-in fade-in duration-150">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-fundu-600" />
                  <span>Supabase &amp; PostgreSQL Cloud Integration</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono text-slate-500">Mode:</span>
                  <Badge variant="fundu" size="sm">
                    PostgreSQL 15 / Supabase
                  </Badge>
                </div>
              </CardTitle>
              <CardDescription>
                Connect your live Supabase cloud project so multi-branch warehouses, technicians, and cashiers sync in real-time.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="font-semibold block mb-1">
                    Supabase Project REST URL (NEXT_PUBLIC_SUPABASE_URL)
                  </label>
                  <Input
                    placeholder="https://xyzabcdefghijklm.supabase.co"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Found in Supabase Dashboard ➔ Project Settings ➔ API ➔ Project URL
                  </p>
                </div>

                <div>
                  <label className="font-semibold block mb-1">
                    Supabase Public Anon Key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
                  </label>
                  <Input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Found in Supabase Dashboard ➔ Project Settings ➔ API ➔ Project API Keys (anon / public)
                  </p>
                </div>

                <div>
                  <label className="font-semibold block mb-1">
                    Direct PostgreSQL URI (DATABASE_URL)
                  </label>
                  <Input
                    type="password"
                    placeholder="postgresql://postgres:[PASSWORD]@db.xyz.supabase.co:5432/postgres"
                    value={databaseUrl}
                    onChange={(e) => setDatabaseUrl(e.target.value)}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Used by Prisma ORM for running database migrations and batch syncing.
                  </p>
                </div>
              </div>

              {/* Connection Status Banner */}
              {dbStatusMsg && (
                <div
                  className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                    dbStatus === "success"
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                      : dbStatus === "error"
                      ? "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200"
                      : "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200"
                  }`}
                >
                  {dbStatus === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : dbStatus === "error" ? (
                    <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  ) : (
                    <RefreshCw className="h-4 w-4 text-blue-600 animate-spin shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 font-mono text-[11px] leading-tight">{dbStatusMsg}</div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTestDatabase}
                  disabled={dbStatus === "testing"}
                  className="gap-1.5"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${dbStatus === "testing" ? "animate-spin" : ""}`} />
                  <span>Test Connection</span>
                </Button>

                <Button
                  type="button"
                  variant="fundu"
                  size="sm"
                  onClick={handleSaveCompany}
                  className="gap-1.5"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Credentials</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Database Setup Instructions */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Quick 3-Step Supabase Setup Guide</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopySchemaCommand}
                  className="gap-1.5 text-xs h-7"
                >
                  {copiedSchema ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedSchema ? "Copied!" : "Copy Instructions"}</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2">
                <span className="font-bold text-fundu-600">1.</span>
                <p>
                  Create a free project on{" "}
                  <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-fundu-600 underline">
                    https://supabase.com
                  </a>
                  . Choose region <strong>South Asia (Mumbai - ap-south-1)</strong> for lowest latency in India.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-fundu-600">2.</span>
                <p>
                  Open Supabase <strong>SQL Editor</strong>, open <code>supabase/schema.sql</code> from this repository, paste and click <strong>RUN</strong>. All 10 relational tables will be created instantly.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-fundu-600">3.</span>
                <p>
                  Copy your <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> into the fields above or into <code>.env.local</code>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: HARDWARE & BARCODE PRINTERS */}
      {/* ============================================================== */}
      {activeTab === "hardware" && (
        <div className="space-y-6 text-xs animate-in fade-in duration-150">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm flex items-center gap-2">
                <Printer className="h-4 w-4 text-fundu-600" />
                <span>Thermal Label Printers (TVS / Zebra / TSC)</span>
              </CardTitle>
              <CardDescription>
                Configure standard thermal sticker formats for phone back stickers and retail carton labels.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Standard Sticker Size</label>
                  <select
                    value={defaultLabelSize}
                    onChange={(e) => setDefaultLabelSize(e.target.value as any)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="50x38">50mm x 38mm (Cashify Standard Phone Back)</option>
                    <option value="50x25">50mm x 25mm (Compact Battery/Carton)</option>
                    <option value="100x50">100mm x 50mm (Master Box / Consignment)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Printer Resolution (DPI)</label>
                  <select
                    value={printerDpi}
                    onChange={(e) => setPrinterDpi(e.target.value)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="203">203 DPI (Standard Thermal 8 dots/mm)</option>
                    <option value="300">300 DPI (High-Definition Crisp Barcodes)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Barcode Scanner F2 Hotkey</label>
                  <div className="h-9 flex items-center px-3 rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-800 text-[11px] font-mono text-fundu-700 dark:text-fundu-300">
                    [F2] Global USB Gun Trigger Active
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: COMPLIANCE & RULE 32(5) */}
      {/* ============================================================== */}
      {activeTab === "compliance" && (
        <div className="space-y-6 text-xs animate-in fade-in duration-150">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-fundu-600" />
                <span>GST Rule 32(5) Margin Scheme Parameters</span>
              </CardTitle>
              <CardDescription>
                Statutory margins and tax policies applicable to second-hand electronic goods.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Target Gross Margin %</label>
                  <Input
                    type="number"
                    value={defaultTargetMargin}
                    onChange={(e) => setDefaultTargetMargin(Number(e.target.value))}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    System warns if margin on a handset drops below this threshold.
                  </p>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Minimum Battery Health for Sale</label>
                  <Input
                    type="number"
                    value={minBatteryGradeA}
                    onChange={(e) => setMinBatteryGradeA(Number(e.target.value))}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    iPhones below this health require battery replacement prior to sale.
                  </p>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Standard Warranty Period</label>
                  <select
                    value={defaultWarrantyMonths}
                    onChange={(e) => setDefaultWarrantyMonths(Number(e.target.value))}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value={6}>6 Months (180 Days Standard)</option>
                    <option value={12}>12 Months (365 Days Comprehensive)</option>
                    <option value={3}>3 Months (90 Days Economy)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: THEME & DISPLAY */}
      {/* ============================================================== */}
      {activeTab === "theme" && (
        <div className="space-y-6 text-xs animate-in fade-in duration-150">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sliders className="h-4 w-4 text-fundu-600" />
                <span>OS Theme &amp; Interface Styling</span>
              </CardTitle>
              <CardDescription>Enterprise light mode and high-contrast dark theme</CardDescription>
            </CardHeader>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Current Mode: {theme === "light" ? "Light Mode (Stripe Enterprise)" : "Dark Mode (Deep Navy)"}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Toggle between executive white/slate and deep dark interface.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="gap-1.5"
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-400" />}
                <span>Switch to {theme === "light" ? "Dark" : "Light"}</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ============================================================== */}
      {/* EDIT STORE OUTLET MODAL DIALOG */}
      {/* ============================================================== */}
      <Dialog
        isOpen={isEditStoreOpen}
        onClose={() => setIsEditStoreOpen(false)}
        title="Edit Store Outlet Details"
        description={
          editingStore
            ? `Update address, contact numbers, and store code for ${editingStore.name}. Changes apply immediately to new invoices.`
            : "Update store outlet information."
        }
        maxWidth="lg"
      >
        <form onSubmit={handleSaveEditStore} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Store Code *
              </label>
              <Input
                value={editStoreCode}
                onChange={(e) => setEditStoreCode(e.target.value)}
                placeholder="e.g. LKO-01"
                className="font-mono uppercase font-bold"
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Printed in invoice &amp; order IDs
              </span>
            </div>
            <div className="sm:col-span-2">
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Store Outlet Name *
              </label>
              <Input
                value={editStoreName}
                onChange={(e) => setEditStoreName(e.target.value)}
                placeholder="e.g. Lucknow Store (LKO-01)"
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Official branch outlet title
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Full Store Address (Printed on Invoices) *
              </label>
              <Input
                value={editStoreAddress}
                onChange={(e) => setEditStoreAddress(e.target.value)}
                placeholder="e.g. ED-476, Sector-Q, Aliganj, Aliganj (Lucknow), Uttar Pradesh, India, 226024."
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Printed in the Supplier / Store Outlet address box on customer bills
              </span>
            </div>
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                City / Region
              </label>
              <Input
                value={editStoreCity}
                onChange={(e) => setEditStoreCity(e.target.value)}
                placeholder="Lucknow"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Store Manager / In-Charge
              </label>
              <Input
                value={editStoreManager}
                onChange={(e) => setEditStoreManager(e.target.value)}
                placeholder="e.g. Abhay Verma"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Store Contact Phone
              </label>
              <Input
                value={editStorePhone}
                onChange={(e) => setEditStorePhone(e.target.value)}
                placeholder="+91 79919 90508"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Store Status
              </label>
              <select
                value={editStoreStatus}
                onChange={(e) => setEditStoreStatus(e.target.value as any)}
                className="w-full h-9 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-fundu-500"
              >
                <option value="Active">Active (Open for Sales)</option>
                <option value="Upcoming">Upcoming (Under Fitment)</option>
                <option value="Inactive">Inactive (Closed)</option>
              </select>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-fundu-50/70 dark:bg-fundu-950/40 border border-fundu-200 dark:border-fundu-900 flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
            <Info className="h-4 w-4 text-fundu-600 dark:text-fundu-400 mt-0.5 shrink-0" />
            <p className="text-[11px] leading-relaxed">
              <strong>Invoice Sync Notice:</strong> Saving changes here updates the store address and code across all sections. New customer tax invoices generated for this store will automatically feature this address and invoice prefix (e.g. <span className="font-mono font-bold text-fundu-700 dark:text-fundu-300">INV{editStoreCode || "LKO01"}2611-XXXX</span>).
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditStoreOpen(false)}
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
              <span>Save Store Changes</span>
            </Button>
          </div>
        </form>
      </Dialog>

      {/* ============================================================== */}
      {/* EDIT ROLE ASSIGNEE / PERSON NAME MODAL DIALOG */}
      {/* ============================================================== */}
      <Dialog
        isOpen={Boolean(editingRoleAssignee)}
        onClose={() => setEditingRoleAssignee(null)}
        title={
          editingRoleAssignee
            ? `Change Name & Details for: ${editingRoleAssignee.toUpperCase()} Role`
            : "Edit Role Assignee"
        }
        description="Set your own name, contact phone, email, and security PIN for this role."
        maxWidth="md"
      >
        <form onSubmit={handleSaveRoleAssignee} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
              Person Full Name (Assignee) *
            </label>
            <Input
              value={rolePersonName}
              onChange={(e) => setRolePersonName(e.target.value)}
              placeholder="e.g. Abhay Verma"
              className="font-bold text-xs"
              required
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Set your own name here. It will immediately reflect across Top Navbar, Settings, and Audit records.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Email / Login ID
              </label>
              <Input
                type="email"
                value={rolePersonEmail}
                onChange={(e) => setRolePersonEmail(e.target.value)}
                placeholder="admin@thefundu.com"
                className="text-xs"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Contact Phone Number
              </label>
              <Input
                value={rolePersonPhone}
                onChange={(e) => setRolePersonPhone(e.target.value)}
                placeholder="+91 79919 90508"
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                Login Password
              </label>
              <Input
                value={rolePersonPassword}
                onChange={(e) => setRolePersonPassword(e.target.value)}
                placeholder="Password"
                className="text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                4-Digit POS Switch PIN
              </label>
              <Input
                maxLength={4}
                value={rolePersonPin}
                onChange={(e) => setRolePersonPin(e.target.value)}
                placeholder="1234"
                className="text-xs font-mono text-center tracking-widest font-bold"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-fundu-50/70 dark:bg-fundu-950/40 border border-fundu-200 dark:border-fundu-900 flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
            <Info className="h-4 w-4 text-fundu-600 dark:text-fundu-400 mt-0.5 shrink-0" />
            <p className="text-[11px] leading-relaxed">
              <strong>Live Synchronization:</strong> Changing the name for this role immediately updates all labels, role badges, and the top-right header in TheFundu OS.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingRoleAssignee(null)}
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
              <span>Save Name &amp; Credentials</span>
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

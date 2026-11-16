"use client";

import React, { useState } from "react";
import {
  Store,
  Building2,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  Save,
  RotateCcw,
  MapPin,
  Phone,
  User,
  ShieldAlert,
  Info,
  Edit2,
  Pencil,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Warehouse } from "@/lib/types";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_INVOICE_TERMS, COMPANY_CONFIG } from "@/lib/company-config";

interface InvoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "stores" | "company" | "terms";
}

export function InvoiceSettingsModal({
  isOpen,
  onClose,
  defaultTab = "stores",
}: InvoiceSettingsModalProps) {
  const {
    warehouses,
    addStore,
    updateStore,
    deleteStore,
    selectedStoreId,
    setSelectedStoreId,
    invoiceSettings,
    updateInvoiceSettings,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"stores" | "company" | "terms">(defaultTab);

  // Store form state
  const [newStoreCode, setNewStoreCode] = useState("");
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreAddress, setNewStoreAddress] = useState("");
  const [newStoreCity, setNewStoreCity] = useState("Lucknow");
  const [newStoreManager, setNewStoreManager] = useState("");
  const [newStorePhone, setNewStorePhone] = useState("+91 79919 90508");

  // Inline Store Editing state
  const [editingWhId, setEditingWhId] = useState<string | null>(null);
  const [editStoreCode, setEditStoreCode] = useState("");
  const [editStoreName, setEditStoreName] = useState("");
  const [editStoreAddress, setEditStoreAddress] = useState("");
  const [editStoreCity, setEditStoreCity] = useState("Lucknow");
  const [editStoreManager, setEditStoreManager] = useState("");
  const [editStorePhone, setEditStorePhone] = useState("+91 79919 90508");

  const startEditStore = (wh: Warehouse) => {
    setEditingWhId(wh.id);
    setEditStoreCode(wh.code || "");
    setEditStoreName(wh.name || "");
    setEditStoreAddress(wh.address || "");
    setEditStoreCity(wh.city || wh.location || "Lucknow");
    setEditStoreManager(wh.managerName || "");
    setEditStorePhone((wh as any).managerPhone || (wh as any).phone || "+91 79919 90508");
  };

  const handleSaveStoreEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWhId) return;
    if (!editStoreName.trim()) {
      showToast("Store outlet name is required.", "error");
      return;
    }
    const cleanCode = (editStoreCode || "STORE").toUpperCase().trim();
    updateStore(editingWhId, {
      code: cleanCode,
      name: editStoreName.trim(),
      address: editStoreAddress.trim() || `${editStoreCity}, Uttar Pradesh`,
      city: editStoreCity.trim() || "Lucknow",
      location: editStoreCity.trim() || "Lucknow",
      managerName: editStoreManager.trim() || "Store Manager",
      managerPhone: editStorePhone.trim() || "+91 79919 90508",
    });
    setEditingWhId(null);
    showToast(`Store outlet ${cleanCode} updated successfully!`, "success");
  };

  // Company profile state
  const [companyLegalName, setCompanyLegalName] = useState(
    invoiceSettings?.companyLegalName || COMPANY_CONFIG.legalName
  );
  const [cin, setCin] = useState(invoiceSettings?.cin || COMPANY_CONFIG.cin);
  const [gstin, setGstin] = useState(invoiceSettings?.gstin || COMPANY_CONFIG.gstin);
  const [pan, setPan] = useState(invoiceSettings?.pan || COMPANY_CONFIG.pan);
  const [registeredAddress, setRegisteredAddress] = useState(
    invoiceSettings?.registeredAddress || COMPANY_CONFIG.registeredAddress
  );
  const [stateName, setStateName] = useState(
    invoiceSettings?.stateName || COMPANY_CONFIG.stateName
  );
  const [stateCode, setStateCode] = useState(
    invoiceSettings?.stateCode || COMPANY_CONFIG.stateCode
  );
  const [tollFree, setTollFree] = useState(
    invoiceSettings?.tollFree || COMPANY_CONFIG.tollFree
  );
  const [supportEmail, setSupportEmail] = useState(
    invoiceSettings?.supportEmail || COMPANY_CONFIG.supportEmail
  );

  // Terms and conditions state
  const [terms, setTerms] = useState<string[]>(
    invoiceSettings?.termsAndConditions && invoiceSettings.termsAndConditions.length > 0
      ? invoiceSettings.termsAndConditions
      : DEFAULT_INVOICE_TERMS
  );

  // Add a new store
  const handleAddStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName.trim()) {
      showToast("Store name is required", "error");
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

    // Reset inputs
    setNewStoreCode("");
    setNewStoreName("");
    setNewStoreAddress("");
    setNewStoreManager("");
    showToast(`Store outlet ${cleanCode} added successfully!`, "success");
  };

  // Save company legal details
  const handleSaveCompany = () => {
    updateInvoiceSettings({
      companyLegalName,
      cin,
      gstin,
      pan,
      registeredAddress,
      stateName,
      stateCode,
      tollFree,
      supportEmail,
    });
    showToast("Company legal details & CIN/GSTIN updated on invoice!", "success");
  };

  // Terms handlers
  const handleTermChange = (idx: number, value: string) => {
    const updated = [...terms];
    updated[idx] = value;
    setTerms(updated);
  };

  const handleAddClause = () => {
    setTerms([
      ...terms,
      `${terms.length + 1}. Additional Term: Warranty and replacement terms apply under company policy.`,
    ]);
  };

  const handleRemoveClause = (idx: number) => {
    const updated = terms.filter((_, i) => i !== idx);
    setTerms(updated);
  };

  const handleResetDefaultTerms = () => {
    setTerms(DEFAULT_INVOICE_TERMS);
    updateInvoiceSettings({ termsAndConditions: DEFAULT_INVOICE_TERMS });
    showToast("Reset to official standard 5 English legal clauses!", "info");
  };

  const handleSaveTerms = () => {
    updateInvoiceSettings({ termsAndConditions: terms });
    showToast("Terms & conditions updated on customer tax invoices!", "success");
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Invoice & Store Settings Panel"
      description="Configure store outlets, official corporate legal details, and English warranty terms printed on bills."
      maxWidth="4xl"
    >
      <div className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("stores")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "stores"
                ? "bg-fundu-50 dark:bg-fundu-950/60 text-fundu-700 dark:text-fundu-300 font-bold border border-fundu-200 dark:border-fundu-800"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
            }`}
          >
            <Store className="h-3.5 w-3.5" />
            <span>Store Outlets ({warehouses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("company")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "company"
                ? "bg-fundu-50 dark:bg-fundu-950/60 text-fundu-700 dark:text-fundu-300 font-bold border border-fundu-200 dark:border-fundu-800"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>Company Legal &amp; GSTIN</span>
          </button>

          <button
            onClick={() => setActiveTab("terms")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "terms"
                ? "bg-fundu-50 dark:bg-fundu-950/60 text-fundu-700 dark:text-fundu-300 font-bold border border-fundu-200 dark:border-fundu-800"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Warranty Terms &amp; Jurisdiction ({terms.length})</span>
          </button>
        </div>

        {/* TAB 1: STORE OUTLETS */}
        {activeTab === "stores" && (
          <div className="space-y-4 text-xs animate-in fade-in duration-150">
            {/* Active Outlet Selection */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Store className="h-4 w-4 text-fundu-600" />
                  <span>Configured Store Outlets (Select to Bill from this Store)</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  Click a store to set it as active on invoices
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {warehouses.map((wh) => {
                  const isSelected = selectedStoreId === wh.id || selectedStoreId === wh.code;
                  const isEditingThis = editingWhId === wh.id;

                  if (isEditingThis) {
                    return (
                      <form
                        key={wh.id}
                        onSubmit={handleSaveStoreEdit}
                        className="p-3 rounded-lg border-2 border-fundu-500 bg-white dark:bg-slate-900 shadow-md space-y-2.5 col-span-1 sm:col-span-2 text-xs"
                      >
                        <div className="flex items-center justify-between border-b pb-1.5">
                          <span className="font-bold text-fundu-700 dark:text-fundu-400 flex items-center gap-1.5">
                            <Edit2 className="h-3.5 w-3.5" />
                            <span>Edit Store Outlet: {wh.name}</span>
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Updates invoice headers and store codes
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="font-semibold block mb-0.5 text-[11px]">Store Code *</label>
                            <Input
                              value={editStoreCode}
                              onChange={(e) => setEditStoreCode(e.target.value)}
                              placeholder="e.g. LKO-01"
                              className="font-mono uppercase font-bold text-xs h-8"
                              required
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="font-semibold block mb-0.5 text-[11px]">Store Outlet Name *</label>
                            <Input
                              value={editStoreName}
                              onChange={(e) => setEditStoreName(e.target.value)}
                              placeholder="e.g. Lucknow Store (LKO-01)"
                              className="text-xs h-8"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="sm:col-span-2">
                            <label className="font-semibold block mb-0.5 text-[11px]">Store Address (Printed on Invoices) *</label>
                            <Input
                              value={editStoreAddress}
                              onChange={(e) => setEditStoreAddress(e.target.value)}
                              placeholder="Full address"
                              className="text-xs h-8"
                              required
                            />
                          </div>
                          <div>
                            <label className="font-semibold block mb-0.5 text-[11px]">City</label>
                            <Input
                              value={editStoreCity}
                              onChange={(e) => setEditStoreCity(e.target.value)}
                              className="text-xs h-8"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="font-semibold block mb-0.5 text-[11px]">Manager Name</label>
                            <Input
                              value={editStoreManager}
                              onChange={(e) => setEditStoreManager(e.target.value)}
                              placeholder="Abhay Verma"
                              className="text-xs h-8"
                            />
                          </div>
                          <div>
                            <label className="font-semibold block mb-0.5 text-[11px]">Contact Phone</label>
                            <Input
                              value={editStorePhone}
                              onChange={(e) => setEditStorePhone(e.target.value)}
                              placeholder="+91 79919 90508"
                              className="text-xs h-8"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1 border-t">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => setEditingWhId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="fundu"
                            size="sm"
                            className="h-7 text-xs gap-1 font-semibold"
                          >
                            <Save className="h-3 w-3" />
                            <span>Save Changes</span>
                          </Button>
                        </div>
                      </form>
                    );
                  }

                  return (
                    <div
                      key={wh.id}
                      onClick={() => {
                        setSelectedStoreId(wh.id);
                        showToast(`Active invoice store switched to ${wh.name}!`, "success");
                      }}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                        isSelected
                          ? "border-fundu-500 bg-fundu-50/60 dark:bg-fundu-950/40 ring-1 ring-fundu-500 shadow-xs"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate">
                            {wh.name}
                          </span>
                          {isSelected && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-fundu-100 text-fundu-800 dark:bg-fundu-900/60 dark:text-fundu-300 shrink-0">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Badge variant={isSelected ? "fundu" : "outline"} size="sm">
                            {wh.code || "STORE"}
                          </Badge>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-5 px-1.5 text-[9.5px] gap-1 text-fundu-700 dark:text-fundu-300 border-fundu-200 dark:border-fundu-800 hover:bg-fundu-50 font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditStore(wh);
                            }}
                          >
                            <Edit2 className="h-2.5 w-2.5" />
                            <span>Edit</span>
                          </Button>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {wh.address}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-1.5">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{wh.managerName || "Store Head"}</span>
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="h-3 w-3" />
                          <span>{(wh as any).managerPhone || (wh as any).phone || "+91 79919 90508"}</span>
                        </span>
                      </div>

                      <div className="mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[9.5px]">
                        <span className={isSelected ? "text-fundu-600 font-semibold" : "text-slate-400"}>
                          {isSelected ? "✓ Selected for Current Invoice" : "Click card to select for invoice"}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditStore(wh);
                          }}
                          className="text-fundu-600 dark:text-fundu-400 hover:underline flex items-center gap-0.5 font-medium"
                        >
                          <Pencil className="h-2.5 w-2.5" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add New Store Form */}
            <form onSubmit={handleAddStore} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-fundu-600" />
                  <span>Add New Store Outlet</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  Multiple stores can be added with location &amp; unique store codes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="font-semibold block mb-1">Store Code *</label>
                  <Input
                    placeholder="e.g. LKO-02, KNP-01, VNS-01"
                    value={newStoreCode}
                    onChange={(e) => setNewStoreCode(e.target.value)}
                    className="font-mono uppercase font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-semibold block mb-1">Store Outlet Name *</label>
                  <Input
                    placeholder="e.g. Lucknow Gomti Nagar Experience Store"
                    value={newStoreName}
                    onChange={(e) => setNewStoreName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2">
                  <label className="font-semibold block mb-1">Full Store Address (Printed on Bill) *</label>
                  <Input
                    placeholder="e.g. Riverside Plaza, Vipin Khand, Gomti Nagar, Lucknow, UP 226010"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold block mb-1">Store Manager Name</label>
                  <Input
                    placeholder="e.g. Abhay Verma"
                    value={newStoreManager}
                    onChange={(e) => setNewStoreManager(e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Manager Phone Number</label>
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
                  <span>Register &amp; Add Store Outlet</span>
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: COMPANY LEGAL & GST PROFILE */}
        {activeTab === "company" && (
          <div className="space-y-3.5 text-xs animate-in fade-in duration-150">
            <div className="p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-300 flex items-start gap-2 text-[11px]">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-600" />
              <span>
                These legal attributes are printed in the header, supplier box, and footer of all GST Rule 32(5) invoices.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Company Legal Registered Name *</label>
                <Input
                  value={companyLegalName}
                  onChange={(e) => setCompanyLegalName(e.target.value)}
                  className="font-bold"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Corporate CIN *</label>
                <Input
                  value={cin}
                  onChange={(e) => setCin(e.target.value)}
                  className="font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold block mb-1">Corporate GSTIN *</label>
                <Input
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="font-mono font-bold"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Company PAN *</label>
                <Input
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                  className="font-mono uppercase font-bold"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Home State &amp; State Code *</label>
                <Input
                  value={`${stateName} (${stateCode})`}
                  onChange={(e) => {
                    const val = e.target.value;
                    setStateName(val.split("(")[0].trim());
                  }}
                  className="font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Registered Corporate Office Address *</label>
              <Input
                value={registeredAddress}
                onChange={(e) => setRegisteredAddress(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Call &amp; WhatsApp Support Number</label>
                <Input
                  value={tollFree}
                  onChange={(e) => setTollFree(e.target.value)}
                  placeholder="6390616616"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Support Email</label>
                <Input
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  placeholder="support@thefundu.com"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="fundu" size="sm" onClick={handleSaveCompany} className="gap-1.5 font-semibold">
                <Save className="h-3.5 w-3.5" />
                <span>Save Company Legal Profile</span>
              </Button>
            </div>
          </div>
        )}

        {/* TAB 3: WARRANTY TERMS & CONDITIONS */}
        {activeTab === "terms" && (
          <div className="space-y-3.5 text-xs animate-in fade-in duration-150">
            <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-300 flex items-start gap-2 text-[11px]">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <p className="font-bold">Official Statutory &amp; Warranty Clauses</p>
                <p className="text-[10.5px] mt-0.5">
                  Clauses strictly mandate damage/liquid/burn voidance, authorized purchaser claim restrictions, and exclusive Lucknow jurisdiction.
                </p>
              </div>
            </div>

            {/* List of Clauses */}
            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              {terms.map((clause, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Clause {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveClause(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete this clause"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={clause}
                    onChange={(e) => handleTermChange(idx, e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-slate-50/60 p-2 text-xs leading-relaxed dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  />
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddClause}
                  className="gap-1 text-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add New Clause</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetDefaultTerms}
                  className="gap-1 text-xs text-slate-500"
                  title="Reset to the 5 standard English clauses"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset to Standard Clauses</span>
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
          </div>
        )}
      </div>
    </Dialog>
  );
}

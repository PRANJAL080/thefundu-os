"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Handshake,
  Truck,
  Building2,
  Plus,
  Search,
  Filter,
  DollarSign,
  FileText,
  Star,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Smartphone,
  Eye,
  CreditCard,
  Download,
  Upload,
  ArrowRight,
  TrendingUp,
  Percent,
  Layers,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Send,
  Lock,
  RefreshCw,
  XCircle,
  FileCheck,
} from "lucide-react";
import { useApp } from "@/lib/store";
import {
  Supplier,
  VendorConsignment,
  VendorPayout,
  VendorDispute,
  VendorCategory,
  VendorTier,
  VendorPaymentTerm,
  WarehouseLocation,
  DeviceGrade,
} from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { TabsList, TabTrigger } from "@/components/ui/tabs";
import { formatINR, formatDate } from "@/lib/utils";

export default function VendorManagementPortalPage() {
  const {
    suppliers,
    addSupplier,
    updateSupplier,
    vendorConsignments,
    addVendorConsignment,
    updateVendorConsignmentStatus,
    vendorPayouts,
    recordVendorPayout,
    vendorDisputes,
    addVendorDispute,
    updateVendorDisputeStatus,
    warehouses,
    showToast,
  } = useApp();

  // Navigation Tabs inside Vendor Portal
  const [activeTab, setActiveTab] = useState<
    "vendors" | "consignments" | "disputes" | "payouts" | "rate-card" | "self-service"
  >("vendors");

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selected Vendor Detail Modal
  const [selectedVendor, setSelectedVendor] = useState<Supplier | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // New Vendor Onboarding Modal State
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState<VendorCategory>("Enterprise Buyback Aggregator");
  const [tier, setTier] = useState<VendorTier>("Tier 1 (Strategic Partner)");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [paymentTerms, setPaymentTerms] = useState<VendorPaymentTerm>("Net 15");
  const [creditLimit, setCreditLimit] = useState(2500000);
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [bankName, setBankName] = useState("");
  const [pan, setPan] = useState("");

  // New Consignment Modal
  const [isNewLotModalOpen, setIsNewLotModalOpen] = useState(false);
  const [lotVendorId, setLotVendorId] = useState(suppliers[0]?.id || "SUP-001");
  const [lotWarehouse, setLotWarehouse] = useState<WarehouseLocation>("Mumbai Central Hub");
  const [lotUnits, setLotUnits] = useState(20);
  const [lotTotalValue, setLotTotalValue] = useState(950000);

  // New Payout Modal
  const [isNewPayoutModalOpen, setIsNewPayoutModalOpen] = useState(false);
  const [payoutVendorId, setPayoutVendorId] = useState(suppliers[0]?.id || "SUP-001");
  const [payoutAmount, setPayoutAmount] = useState(500000);
  const [payoutMode, setPayoutMode] = useState<VendorPayout["mode"]>("NEFT/RTGS");
  const [payoutUtr, setPayoutUtr] = useState(`HDFCN${Date.now().toString().slice(-9)}`);

  // Vendor Self-Service Simulator State
  const [simulatedVendorId, setSimulatedVendorId] = useState<string>(suppliers[0]?.id || "SUP-001");
  const simulatedVendor = suppliers.find((s) => s.id === simulatedVendorId) || suppliers[0];

  // -------------------------------------------------------------
  // CALCULATED METRICS
  // -------------------------------------------------------------
  const totalProcurementSpend = suppliers.reduce((acc, s) => acc + s.totalPurchasedValue, 0);
  const totalOutstandingBalance = suppliers.reduce((acc, s) => acc + s.outstandingBalance, 0);
  const totalLotsCount = vendorConsignments.length;
  const totalOpenDisputesCount = vendorDisputes.filter((d) => d.status !== "Credit Note Issued").length;
  const avgQcPassRate = (
    suppliers.reduce((acc, s) => acc + (s.qcPassRate || 95), 0) / (suppliers.length || 1)
  ).toFixed(1);

  // Filtered Vendors
  const filteredVendors = useMemo(() => {
    return suppliers.filter((v) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.company.toLowerCase().includes(q) ||
        v.contactPerson.toLowerCase().includes(q) ||
        v.gstNumber.toLowerCase().includes(q);

      const matchesTier = tierFilter === "all" || v.tier === tierFilter;
      const matchesCategory = categoryFilter === "all" || v.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || v.status === statusFilter;

      return matchesSearch && matchesTier && matchesCategory && matchesStatus;
    });
  }, [suppliers, searchQuery, tierFilter, categoryFilter, statusFilter]);

  // Handlers
  const handleOnboardVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addSupplier({
      name,
      company: company || name,
      category,
      tier,
      contactPerson,
      phone,
      email,
      address,
      gstNumber,
      paymentTerms,
      creditLimit: Number(creditLimit),
      totalPurchasesCount: 0,
      totalPurchasedValue: 0,
      outstandingBalance: 0,
      rating: 5.0,
      status: "Active",
      qcPassRate: 98.0,
      lotRejectionCount: 0,
      bankDetails: {
        accountName: accountName || company || name,
        accountNumber: accountNumber || "10293847561029",
        ifsc: ifsc || "HDFC0000128",
        bankName: bankName || "HDFC Bank",
        pan: pan || "AAACE4419E",
      },
      kycVerified: true,
    });
    setIsOnboardingModalOpen(false);
    // Reset form
    setName("");
    setCompany("");
  };

  const handleCreateLot = (e: React.FormEvent) => {
    e.preventDefault();
    const vendor = suppliers.find((s) => s.id === lotVendorId);
    addVendorConsignment({
      supplierId: lotVendorId,
      supplierName: vendor?.name || "Supplier Partner",
      date: new Date().toISOString().split("T")[0],
      totalDevices: Number(lotUnits),
      qcPassedCount: Math.round(Number(lotUnits) * 0.95),
      qcRejectedCount: Math.max(0, Number(lotUnits) - Math.round(Number(lotUnits) * 0.95)),
      totalValue: Number(lotTotalValue),
      warehouse: lotWarehouse,
      settlementStatus: "Pending QC",
      manifestItems: [
        {
          model: "Apple iPhone 15 Pro Max 256GB",
          imei: "359088491820194",
          offeredGrade: "A+",
          evaluatedGrade: "A+",
          price: 72000,
          status: "Accepted",
        },
      ],
    });
    setIsNewLotModalOpen(false);
  };

  const handleRecordPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const vendor = suppliers.find((s) => s.id === payoutVendorId);
    recordVendorPayout({
      supplierId: payoutVendorId,
      supplierName: vendor?.name || "Vendor Partner",
      amount: Number(payoutAmount),
      mode: payoutMode,
      utrNumber: payoutUtr,
      tdsDeducted: Math.round(Number(payoutAmount) * 0.001),
      invoiceRef: `INV-SETTLE-${Date.now().toString().slice(-6)}`,
    });
    setIsNewPayoutModalOpen(false);
  };

  const openVendorDetail = (v: Supplier) => {
    setSelectedVendor(v);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* ============================================================== */}
      {/* 1. HEADER SECTION & GLOBAL ACTIONS */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Handshake className="h-6 w-6 text-fundu-600" />
              <span>Vendor Management Portal (VMP)</span>
            </h1>
            <Badge variant="fundu" size="sm">
              Sourcing & AP Desk
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enterprise procurement network, consignment lots, QC grading verification, accounts payable, and partner self-service portal.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsNewPayoutModalOpen(true)}
            className="gap-1.5 shadow-xs font-semibold text-xs"
          >
            <CreditCard className="h-3.5 w-3.5 text-fundu-600" />
            <span>Record Payout</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsNewLotModalOpen(true)}
            className="gap-1.5 shadow-xs font-semibold text-xs"
          >
            <Truck className="h-3.5 w-3.5 text-blue-600" />
            <span>Inward Lot Manifest</span>
          </Button>

          <Button
            variant="fundu"
            size="sm"
            onClick={() => setIsOnboardingModalOpen(true)}
            className="gap-1.5 shadow-xs font-semibold text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Onboard New Vendor</span>
          </Button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. EXECUTIVE PROCUREMENT KPI CARDS */}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Active Sourcing Partners
          </span>
          <p className="text-xl font-black text-slate-900 dark:text-slate-100">
            {suppliers.filter((s) => s.status === "Active").length}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> 100% KYC Verified
          </span>
        </Card>

        <Card className="p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Total Sourced Spend
          </span>
          <p className="text-xl font-black text-slate-900 dark:text-slate-100">
            {formatINR(totalProcurementSpend)}
          </p>
          <span className="text-[10px] text-slate-400">Lifetime volume</span>
        </Card>

        <Card className="p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Outstanding Payable
          </span>
          <p className="text-xl font-black text-amber-600 dark:text-amber-400">
            {formatINR(totalOutstandingBalance)}
          </p>
          <span className="text-[10px] text-amber-600 font-medium">Net 7 &amp; Net 15 cycle</span>
        </Card>

        <Card className="p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Avg QC Pass Rate
          </span>
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            {avgQcPassRate}%
          </p>
          <span className="text-[10px] text-emerald-600 font-medium">Target: &gt;95.0%</span>
        </Card>

        <Card className="p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Consignment Batches
          </span>
          <p className="text-xl font-black text-slate-900 dark:text-slate-100">
            {totalLotsCount} Lots
          </p>
          <span className="text-[10px] text-slate-400">Inward manifest pipeline</span>
        </Card>

        <Card className="p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Open RTV Disputes
          </span>
          <p className="text-xl font-black text-rose-600 dark:text-rose-400">
            {totalOpenDisputesCount}
          </p>
          <span className="text-[10px] text-rose-600 font-medium">Return to vendor claims</span>
        </Card>
      </div>

      {/* ============================================================== */}
      {/* 3. CORE TABS NAVIGATION */}
      {/* ============================================================== */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabTrigger active={activeTab === "vendors"} onClick={() => setActiveTab("vendors")}>
            Vendors &amp; Scorecards ({suppliers.length})
          </TabTrigger>
          <TabTrigger active={activeTab === "consignments"} onClick={() => setActiveTab("consignments")}>
            Consignment Lots &amp; Manifests ({vendorConsignments.length})
          </TabTrigger>
          <TabTrigger active={activeTab === "disputes"} onClick={() => setActiveTab("disputes")}>
            Defect &amp; RTV Claims ({vendorDisputes.length})
          </TabTrigger>
          <TabTrigger active={activeTab === "payouts"} onClick={() => setActiveTab("payouts")}>
            Settlement Ledger &amp; Payouts ({vendorPayouts.length})
          </TabTrigger>
          <TabTrigger active={activeTab === "rate-card"} onClick={() => setActiveTab("rate-card")}>
            Benchmark Sourcing Rate Card
          </TabTrigger>
          <TabTrigger active={activeTab === "self-service"} onClick={() => setActiveTab("self-service")}>
            <span className="flex items-center gap-1.5 text-fundu-600 dark:text-fundu-400 font-semibold">
              <ExternalLink className="h-3 w-3" />
              <span>Vendor Self-Service Portal</span>
            </span>
          </TabTrigger>
        </TabsList>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: VENDORS DIRECTORY & PERFORMANCE SCORECARDS */}
      {/* ============================================================== */}
      {activeTab === "vendors" && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <Card className="p-3.5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input
                placeholder="Search vendor name, company, contact, GSTIN..."
                icon={<Search className="h-4 w-4" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="all">All Partner Tiers</option>
                <option value="Tier 1 (Strategic Partner)">Tier 1 (Strategic Partner)</option>
                <option value="Tier 2 (Preferred Wholesale)">Tier 2 (Preferred Wholesale)</option>
                <option value="Tier 3 (Spot Buy Partner)">Tier 3 (Spot Buy Partner)</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="all">All Categories</option>
                <option value="Enterprise Buyback Aggregator">Enterprise Buyback Aggregator</option>
                <option value="Corporate ITAD & Liquidation">Corporate ITAD &amp; Liquidation</option>
                <option value="Regional Wholesale Stockist">Regional Wholesale Stockist</option>
                <option value="Direct OEM Exchange">Direct OEM Exchange</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Under Review">Under Review</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </Card>

          {/* Vendors Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b">
                  <tr>
                    <th className="p-3">Vendor / Partner</th>
                    <th className="p-3">Category &amp; Tier</th>
                    <th className="p-3">Contact Person &amp; Hub</th>
                    <th className="p-3">GSTIN &amp; Terms</th>
                    <th className="p-3 text-center">QC Pass Rate</th>
                    <th className="p-3 text-right">Total Sourced</th>
                    <th className="p-3 text-right">Payable Balance</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredVendors.map((v) => (
                    <tr
                      key={v.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      {/* Name & ID */}
                      <td className="p-3">
                        <div
                          className="cursor-pointer group"
                          onClick={() => openVendorDetail(v)}
                        >
                          <p className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-fundu-600 transition-colors flex items-center gap-1.5">
                            <span>{v.name}</span>
                            {v.kycVerified && (
                              <span title="KYC & Bank Verified">
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {v.id} • {v.company}
                          </p>
                        </div>
                      </td>

                      {/* Category & Tier */}
                      <td className="p-3 space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {v.category || "Buyback Aggregator"}
                        </span>
                        <p className="text-[10px] font-bold text-fundu-600 dark:text-fundu-400">
                          {v.tier || "Tier 1 (Strategic)"}
                        </p>
                      </td>

                      {/* Contact */}
                      <td className="p-3">
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          {v.contactPerson}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {v.phone} • {v.email}
                        </p>
                      </td>

                      {/* GSTIN & Terms */}
                      <td className="p-3 space-y-0.5">
                        <p className="font-mono text-[10.5px] text-slate-700 dark:text-slate-300">
                          {v.gstNumber}
                        </p>
                        <Badge variant="outline" size="sm">
                          {v.paymentTerms || "Net 15"}
                        </Badge>
                      </td>

                      {/* QC Pass Rate Meter */}
                      <td className="p-3 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`font-black text-xs ${
                              (v.qcPassRate || 95) >= 97
                                ? "text-emerald-600"
                                : (v.qcPassRate || 95) >= 94
                                ? "text-blue-600"
                                : "text-amber-600"
                            }`}
                          >
                            {v.qcPassRate || 96.5}%
                          </span>
                          <span className="text-[9px] text-slate-400">
                            {v.lotRejectionCount || 0} rejected lots
                          </span>
                        </div>
                      </td>

                      {/* Total Sourced */}
                      <td className="p-3 text-right">
                        <p className="font-bold text-slate-900 dark:text-slate-100">
                          {formatINR(v.totalPurchasedValue)}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {v.totalPurchasesCount} POs fulfilled
                        </p>
                      </td>

                      {/* Outstanding Payable */}
                      <td className="p-3 text-right">
                        <p
                          className={`font-bold ${
                            v.outstandingBalance > 0
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-slate-400"
                          }`}
                        >
                          {formatINR(v.outstandingBalance)}
                        </p>
                        <p className="text-[9px] text-slate-400">
                          Limit: {formatINR(v.creditLimit || 3000000)}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openVendorDetail(v)}
                            className="p-1.5 text-slate-500 hover:text-fundu-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                            title="View Full Vendor Dossier"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setPayoutVendorId(v.id);
                              setPayoutAmount(v.outstandingBalance || 100000);
                              setIsNewPayoutModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-md transition-colors"
                            title="Record Payment Disbursement"
                          >
                            <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                          </button>

                          <button
                            onClick={() => {
                              setLotVendorId(v.id);
                              setIsNewLotModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-md transition-colors"
                            title="Inward Consignment Batch"
                          >
                            <Truck className="h-3.5 w-3.5 text-blue-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: CONSIGNMENT LOTS & MANIFESTS */}
      {/* ============================================================== */}
      {activeTab === "consignments" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Inbound Sourcing Consignments &amp; Inspection Manifests
              </h2>
              <p className="text-xs text-slate-500">
                Batch lots delivered by vendors, tracking QC acceptance vs Return to Vendor (RTV) claims.
              </p>
            </div>
            <Button
              variant="fundu"
              size="sm"
              onClick={() => setIsNewLotModalOpen(true)}
              className="gap-1.5 text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Inward New Consignment</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {vendorConsignments.map((lot) => (
              <Card key={lot.id} className="overflow-hidden">
                <CardHeader className="bg-slate-50/70 dark:bg-slate-800/40 pb-3 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {lot.id}
                      </span>
                      <Badge
                        variant={
                          lot.settlementStatus === "Paid in Full" || lot.settlementStatus === "Settlement Approved"
                            ? "success"
                            : lot.settlementStatus === "Disputed"
                            ? "danger"
                            : "warning"
                        }
                        size="sm"
                      >
                        {lot.settlementStatus}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        Vendor: <strong>{lot.supplierName}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-slate-500">
                        Date: <strong>{formatDate(lot.date)}</strong>
                      </span>
                      <span className="text-slate-500">
                        Hub: <strong>{lot.warehouse}</strong>
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {formatINR(lot.totalValue)}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-3 space-y-3">
                  <div className="flex flex-wrap items-center justify-between text-xs gap-2 pb-2 border-b">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Total Quantity: <strong>{lot.totalDevices} Handsets</strong>
                      </span>
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> {lot.qcPassedCount} Passed QC
                      </span>
                      {lot.qcRejectedCount > 0 && (
                        <span className="text-rose-600 font-semibold flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" /> {lot.qcRejectedCount} Disputed / RTV
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateVendorConsignmentStatus(lot.id, "Settlement Approved")}
                        className="text-xs h-7"
                      >
                        Approve Settlement
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setPayoutVendorId(lot.supplierId);
                          setPayoutAmount(lot.totalValue);
                          setIsNewPayoutModalOpen(true);
                        }}
                        className="text-xs h-7 bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                      >
                        Disburse Payout
                      </Button>
                    </div>
                  </div>

                  {/* Manifest Items Table */}
                  <div className="border rounded-lg overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 text-[11px] font-semibold">
                        <tr>
                          <th className="p-2">Handset Model</th>
                          <th className="p-2">IMEI</th>
                          <th className="p-2 text-center">Offered Grade</th>
                          <th className="p-2 text-center">QC Grade</th>
                          <th className="p-2 text-right">Agreed Price</th>
                          <th className="p-2">Intake Status &amp; Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {lot.manifestItems?.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                            <td className="p-2 font-semibold text-slate-800 dark:text-slate-200">
                              {item.model}
                            </td>
                            <td className="p-2 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                              {item.imei}
                            </td>
                            <td className="p-2 text-center font-bold">
                              Grade {item.offeredGrade}
                            </td>
                            <td className="p-2 text-center">
                              <span
                                className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                                  item.evaluatedGrade === "A+" || item.evaluatedGrade === "A"
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                    : item.evaluatedGrade === "D"
                                    ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                Grade {item.evaluatedGrade}
                              </span>
                            </td>
                            <td className="p-2 text-right font-bold text-slate-900 dark:text-slate-100">
                              {formatINR(item.price)}
                            </td>
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                    item.status === "Accepted"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : item.status === "Rejected (RTV)"
                                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                                      : "bg-amber-50 text-amber-700 border border-amber-200"
                                  }`}
                                >
                                  {item.status}
                                </span>
                                {item.reason && (
                                  <span className="text-[10px] text-slate-500 italic">
                                    ({item.reason})
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: DEFECT & RTV (RETURN TO VENDOR) DISPUTES */}
      {/* ============================================================== */}
      {activeTab === "disputes" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Return to Vendor (RTV) &amp; Defect Claims Tracker
              </h2>
              <p className="text-xs text-slate-500">
                Smartphones detected with hidden activation locks, counterfeit displays, or severe motherboard water damage flagged for vendor credit notes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vendorDisputes.map((disp) => (
              <Card key={disp.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {disp.id}
                  </span>
                  <Badge
                    variant={
                      disp.status === "Credit Note Issued"
                        ? "success"
                        : disp.status === "RTV Dispatched"
                        ? "warning"
                        : "danger"
                    }
                    size="sm"
                  >
                    {disp.status}
                  </Badge>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {disp.deviceModel}
                  </p>
                  <p className="font-mono text-slate-500 text-[11px]">
                    IMEI: <strong>{disp.imei}</strong>
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    Supplier: <strong>{disp.supplierName}</strong>
                  </p>
                  <div className="p-2 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-[11px] font-semibold mt-2">
                    Issue: {disp.issueType}
                  </div>
                  <div className="pt-2 flex justify-between items-center font-bold">
                    <span className="text-slate-500">Claim Amount:</span>
                    <span className="text-slate-900 dark:text-slate-100 font-mono">
                      {formatINR(disp.claimedAmount)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t flex justify-end gap-2">
                  {disp.status !== "Credit Note Issued" && (
                    <Button
                      variant="fundu"
                      size="sm"
                      onClick={() => updateVendorDisputeStatus(disp.id, "Credit Note Issued")}
                      className="text-xs h-7"
                    >
                      Acknowledge Credit Note
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: SETTLEMENT LEDGER & PAYOUTS */}
      {/* ============================================================== */}
      {activeTab === "payouts" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Accounts Payable &amp; Banking Disbursements Ledger
              </h2>
              <p className="text-xs text-slate-500">
                Audited bank transfers (NEFT / RTGS / UPI) with UTR references, Section 194Q TDS deductions, and invoice settlement stamps.
              </p>
            </div>
            <Button
              variant="fundu"
              size="sm"
              onClick={() => setIsNewPayoutModalOpen(true)}
              className="gap-1.5 text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Record New Payout</span>
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b">
                  <tr>
                    <th className="p-3">Payout ID</th>
                    <th className="p-3">Vendor / Supplier</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Mode &amp; Banking Ref (UTR)</th>
                    <th className="p-3 text-right">Disbursed Amount</th>
                    <th className="p-3 text-right">TDS (194Q @ 0.1%)</th>
                    <th className="p-3">Settled Consignments</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {vendorPayouts.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40">
                      <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                        {pay.id}
                      </td>
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                        {pay.supplierName}
                      </td>
                      <td className="p-3 text-slate-500">{formatDate(pay.date)}</td>
                      <td className="p-3 space-y-0.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {pay.mode}
                        </span>
                        <p className="font-mono text-[10.5px] text-fundu-600 dark:text-fundu-400">
                          {pay.utrNumber}
                        </p>
                      </td>
                      <td className="p-3 text-right font-black text-slate-900 dark:text-slate-100 text-sm">
                        {formatINR(pay.amount)}
                      </td>
                      <td className="p-3 text-right font-mono text-slate-500">
                        {formatINR(pay.tdsDeducted)}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-500">
                        {pay.settledConsignments.join(", ") || pay.invoiceRef}
                      </td>
                      <td className="p-3 text-center">
                        <Badge
                          variant={pay.status === "Processed" ? "success" : "warning"}
                          size="sm"
                        >
                          {pay.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: SOURCING RATE CARD & PRICE BENCHMARKS */}
      {/* ============================================================== */}
      {activeTab === "rate-card" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              TheFundu Benchmark Procurement Rate Card (Q4 2026)
            </h2>
            <p className="text-xs text-slate-500">
              Target buyback pricing matrix across phone grades to protect a minimum 18-24% gross profit margin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                model: "Apple iPhone 15 Pro Max (256GB)",
                gradeA_Plus: 72000,
                gradeA: 68000,
                gradeB: 62000,
                gradeC: 54000,
                targetRetail: 84999,
              },
              {
                model: "Apple iPhone 15 (128GB)",
                gradeA_Plus: 45000,
                gradeA: 42000,
                gradeB: 38000,
                gradeC: 32000,
                targetRetail: 54999,
              },
              {
                model: "Samsung Galaxy S24 Ultra (512GB)",
                gradeA_Plus: 74000,
                gradeA: 70000,
                gradeB: 64000,
                gradeC: 56000,
                targetRetail: 89999,
              },
              {
                model: "Samsung Galaxy Z Fold 5 (256GB)",
                gradeA_Plus: 64000,
                gradeA: 60000,
                gradeB: 53000,
                gradeC: 46000,
                targetRetail: 74999,
              },
              {
                model: "Google Pixel 8 Pro (128GB)",
                gradeA_Plus: 42000,
                gradeA: 39000,
                gradeB: 34000,
                gradeC: 28000,
                targetRetail: 51999,
              },
              {
                model: "OnePlus 12 (256GB)",
                gradeA_Plus: 36000,
                gradeA: 33000,
                gradeB: 29000,
                gradeC: 24000,
                targetRetail: 44999,
              },
            ].map((rc, idx) => (
              <Card key={idx} className="p-4 space-y-3">
                <div className="border-b pb-2">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {rc.model}
                  </h3>
                  <p className="text-[11px] text-fundu-600 dark:text-fundu-400 font-semibold mt-0.5">
                    Target Retail: {formatINR(rc.targetRetail)}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center bg-emerald-50/60 dark:bg-emerald-950/30 p-1.5 rounded">
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                      Grade A+ (Pristine):
                    </span>
                    <span className="font-mono font-bold">{formatINR(rc.gradeA_Plus)}</span>
                  </div>
                  <div className="flex justify-between items-center p-1.5">
                    <span className="text-slate-600 dark:text-slate-400">Grade A (Very Good):</span>
                    <span className="font-mono font-bold">{formatINR(rc.gradeA)}</span>
                  </div>
                  <div className="flex justify-between items-center p-1.5">
                    <span className="text-slate-600 dark:text-slate-400">Grade B (Good):</span>
                    <span className="font-mono font-bold">{formatINR(rc.gradeB)}</span>
                  </div>
                  <div className="flex justify-between items-center p-1.5">
                    <span className="text-slate-600 dark:text-slate-400">Grade C (Fair):</span>
                    <span className="font-mono font-bold">{formatINR(rc.gradeC)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: VENDOR SELF-SERVICE PORTAL SIMULATOR */}
      {/* ============================================================== */}
      {activeTab === "self-service" && (
        <div className="space-y-4">
          {/* Vendor Switcher Bar */}
          <Card className="p-4 bg-slate-900 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-fundu-400 block mb-1">
                  Vendor Partner Self-Service Experience
                </span>
                <h2 className="text-base font-bold">
                  Simulating Partner Portal for: {simulatedVendor?.name}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  GSTIN: {simulatedVendor?.gstNumber} • Category: {simulatedVendor?.category}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300">Select Vendor Account:</span>
                <select
                  value={simulatedVendorId}
                  onChange={(e) => setSimulatedVendorId(e.target.value)}
                  className="h-8 rounded bg-slate-800 text-white border border-slate-700 px-2 text-xs"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Partner Experience Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Payable Balance Due to You
              </span>
              <p className="text-2xl font-black text-fundu-600">
                {formatINR(simulatedVendor?.outstandingBalance || 0)}
              </p>
              <p className="text-xs text-slate-500">
                Disbursement Term: {simulatedVendor?.paymentTerms || "Net 15"}
              </p>
            </Card>

            <Card className="p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                QC Acceptance Quality Score
              </span>
              <p className="text-2xl font-black text-emerald-600">
                {simulatedVendor?.qcPassRate || 96.8}%
              </p>
              <p className="text-xs text-slate-500">
                Tier: {simulatedVendor?.tier}
              </p>
            </Card>

            <Card className="p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Registered Bank &amp; IFSC
              </span>
              <p className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200">
                {simulatedVendor?.bankDetails?.bankName || "HDFC Bank"}
              </p>
              <p className="font-mono text-xs text-slate-500">
                A/C: {simulatedVendor?.bankDetails?.accountNumber} • IFSC: {simulatedVendor?.bankDetails?.ifsc}
              </p>
            </Card>
          </div>

          {/* Vendor Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="p-4 hover:border-fundu-500 transition-colors cursor-pointer group">
              <Upload className="h-6 w-6 text-fundu-600 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Upload New Handset Manifest
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Submit an Excel/CSV lot of serials &amp; IMEIs for intake at Mumbai or Delhi hub.
              </p>
            </Card>

            <Card className="p-4 hover:border-fundu-500 transition-colors cursor-pointer group">
              <FileCheck className="h-6 w-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Download Payment Advice &amp; TDS
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Download audited payment vouchers with UTR numbers and Form 16A certificates.
              </p>
            </Card>

            <Card className="p-4 hover:border-fundu-500 transition-colors cursor-pointer group">
              <XCircle className="h-6 w-6 text-rose-600 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Track RTV Handsets
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                View dispatched return parcels for defective units with courier tracking.
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. MODALS */}
      {/* ============================================================== */}

      {/* MODAL 1: ONBOARD NEW VENDOR */}
      <Dialog
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        title="Onboard New Sourcing Partner / Vendor"
        description="Register wholesale aggregators, buyback partners, and corporate liquidators"
        maxWidth="2xl"
      >
        <form onSubmit={handleOnboardVendor} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Vendor Trade Name *</label>
              <Input
                placeholder="e.g. Reliance Resale Exchange"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Registered Entity Name</label>
              <Input
                placeholder="e.g. Reliance Retail Ventures Ltd"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Vendor Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VendorCategory)}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="Enterprise Buyback Aggregator">Enterprise Buyback Aggregator</option>
                <option value="Corporate ITAD & Liquidation">Corporate ITAD &amp; Liquidation</option>
                <option value="Regional Wholesale Stockist">Regional Wholesale Stockist</option>
                <option value="Retail Franchise Sourcing">Retail Franchise Sourcing</option>
                <option value="Direct OEM Exchange">Direct OEM Exchange</option>
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">Partner Tier</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as VendorTier)}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="Tier 1 (Strategic Partner)">Tier 1 (Strategic Partner)</option>
                <option value="Tier 2 (Preferred Wholesale)">Tier 2 (Preferred Wholesale)</option>
                <option value="Tier 3 (Spot Buy Partner)">Tier 3 (Spot Buy Partner)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold block mb-1">Contact Person *</label>
              <Input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
            </div>
            <div>
              <label className="font-semibold block mb-1">Phone Number *</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="font-semibold block mb-1">Email Address *</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">GSTIN *</label>
              <Input
                placeholder="e.g. 27AAACE4419E1ZP"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Payment Terms</label>
              <select
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value as VendorPaymentTerm)}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="Net 0 (Immediate)">Net 0 (Immediate On-Delivery)</option>
                <option value="Net 7">Net 7 Days</option>
                <option value="Net 15">Net 15 Days</option>
                <option value="Net 30">Net 30 Days</option>
                <option value="Advance 50%">Advance 50%</option>
                <option value="Post-QC Settlement">Post-QC Settlement</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Registered Address</label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          {/* Bank Details Sub-section */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border space-y-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
              Bank Settlement Account Details (for automated NEFT/RTGS)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-semibold block mb-1">Account Holder Name</label>
                <Input value={accountName} onChange={(e) => setAccountName(e.target.value)} />
              </div>
              <div>
                <label className="font-semibold block mb-1">Account Number</label>
                <Input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
              </div>
              <div>
                <label className="font-semibold block mb-1">IFSC Code</label>
                <Input value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold block mb-1">Bank Name</label>
                <Input value={bankName} onChange={(e) => setBankName(e.target.value)} />
              </div>
              <div>
                <label className="font-semibold block mb-1">Company PAN</label>
                <Input value={pan} onChange={(e) => setPan(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOnboardingModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="fundu" size="sm">
              Complete Onboarding &amp; Verify KYC
            </Button>
          </div>
        </form>
      </Dialog>

      {/* MODAL 2: INWARD NEW LOT MANIFEST */}
      <Dialog
        isOpen={isNewLotModalOpen}
        onClose={() => setIsNewLotModalOpen(false)}
        title="Inward Sourcing Consignment Batch"
        description="Log phone batch manifest delivered to TheFundu warehousing hubs"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateLot} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1">Select Sourcing Partner *</label>
            <select
              value={lotVendorId}
              onChange={(e) => setLotVendorId(e.target.value)}
              className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Receiving Warehouse</label>
              <select
                value={lotWarehouse}
                onChange={(e) => setLotWarehouse(e.target.value as WarehouseLocation)}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.name}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">Total Handset Units *</label>
              <Input
                type="number"
                value={lotUnits}
                onChange={(e) => setLotUnits(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Estimated Sourcing Value (₹) *</label>
            <Input
              type="number"
              value={lotTotalValue}
              onChange={(e) => setLotTotalValue(Number(e.target.value))}
            />
          </div>

          <div className="p-3 border rounded-lg bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-500">
            * Once inwarded, devices will automatically route to the Quality Check bay for 13-point diagnostic grading.
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsNewLotModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="fundu" size="sm">
              Generate Intake Lot &amp; Manifest
            </Button>
          </div>
        </form>
      </Dialog>

      {/* MODAL 3: RECORD PAYOUT */}
      <Dialog
        isOpen={isNewPayoutModalOpen}
        onClose={() => setIsNewPayoutModalOpen(false)}
        title="Record Vendor Payout Disbursement"
        description="Process banking payout against verified consignment lots"
        maxWidth="lg"
      >
        <form onSubmit={handleRecordPayout} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1">Select Vendor *</label>
            <select
              value={payoutVendorId}
              onChange={(e) => setPayoutVendorId(e.target.value)}
              className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — Outstanding: {formatINR(s.outstandingBalance)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Disbursed Amount (₹) *</label>
              <Input
                type="number"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Payment Mode</label>
              <select
                value={payoutMode}
                onChange={(e) => setPayoutMode(e.target.value as any)}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="NEFT/RTGS">NEFT / RTGS</option>
                <option value="UPI">UPI</option>
                <option value="Cheque">Corporate Cheque</option>
                <option value="Credit Note Adjustment">Credit Note Adjustment</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Bank UTR / Transaction Reference *</label>
            <Input
              value={payoutUtr}
              onChange={(e) => setPayoutUtr(e.target.value)}
              placeholder="e.g. HDFCN26309182910"
              required
            />
          </div>

          <div className="p-3 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-[11px]">
            TDS Deduction (Section 194Q @ 0.1%): <strong>{formatINR(Math.round(payoutAmount * 0.001))}</strong>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsNewPayoutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="fundu" size="sm">
              Confirm &amp; Disburse Payout
            </Button>
          </div>
        </form>
      </Dialog>

      {/* MODAL 4: VENDOR FULL PROFILE & AUDIT DOSSIER */}
      {selectedVendor && (
        <Dialog
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`${selectedVendor.name} — Vendor Dossier`}
          description={`ID: ${selectedVendor.id} • Tier: ${selectedVendor.tier || "Tier 1"} • Status: ${selectedVendor.status}`}
          maxWidth="3xl"
        >
          <div className="space-y-4 text-xs">
            {/* Top Stats */}
            <div className="grid grid-cols-4 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border text-center">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Sourced</span>
                <p className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                  {formatINR(selectedVendor.totalPurchasedValue)}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Payable Due</span>
                <p className="font-bold text-amber-600 text-sm mt-0.5">
                  {formatINR(selectedVendor.outstandingBalance)}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">QC Accuracy</span>
                <p className="font-bold text-emerald-600 text-sm mt-0.5">
                  {selectedVendor.qcPassRate || 96.5}%
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Credit Limit</span>
                <p className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                  {formatINR(selectedVendor.creditLimit || 3000000)}
                </p>
              </div>
            </div>

            {/* Entity & Banking Particulars */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Entity &amp; Taxation
                </span>
                <p><strong>Company:</strong> {selectedVendor.company}</p>
                <p><strong>GSTIN:</strong> <span className="font-mono">{selectedVendor.gstNumber}</span></p>
                <p><strong>Category:</strong> {selectedVendor.category}</p>
                <p><strong>Payment Terms:</strong> {selectedVendor.paymentTerms}</p>
                <p><strong>Address:</strong> {selectedVendor.address}</p>
              </div>

              <div className="p-3 border rounded-lg space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Banking &amp; Settlement Account
                </span>
                <p><strong>Bank:</strong> {selectedVendor.bankDetails?.bankName || "HDFC Bank"}</p>
                <p><strong>A/C No:</strong> <span className="font-mono">{selectedVendor.bankDetails?.accountNumber}</span></p>
                <p><strong>IFSC Code:</strong> <span className="font-mono">{selectedVendor.bankDetails?.ifsc}</span></p>
                <p><strong>PAN:</strong> <span className="font-mono">{selectedVendor.bankDetails?.pan}</span></p>
                <p><strong>UPI ID:</strong> <span className="font-mono">{selectedVendor.bankDetails?.upiId || "None"}</span></p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDetailModalOpen(false)}
              >
                Close Dossier
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}

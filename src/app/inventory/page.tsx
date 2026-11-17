"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Boxes,
  Plus,
  Download,
  Upload,
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  Layers,
  ArrowRightLeft,
  FileText,
  Printer,
  Store,
  MapPin,
  Sparkles,
  Battery,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Device, DeviceStatus, WarehouseLocation, BuybackRecord } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DeviceDetailsModal } from "@/components/inventory/DeviceDetailsModal";
import { EditDeviceModal } from "@/components/inventory/EditDeviceModal";
import { ImportExcelModal } from "@/components/inventory/ImportExcelModal";
import { InvoiceModal } from "@/components/invoice/InvoiceModal";
import { ThermalStickerModal } from "@/components/inventory/ThermalBarcodeSticker";
import { CustomerPurchaseModal } from "@/components/inventory/CustomerPurchaseModal";
import { BuybackKycReportModal } from "@/components/buyback/BuybackKycReportModal";
import { exportGSTRule32AuditCSV } from "@/lib/exportGSTRule32";
import { formatINR, formatDate, getStatusBadgeColor, matchesDeviceSearch } from "@/lib/utils";

export default function InventoryPage() {
  const { devices, warehouses, buybacks, updateDevice, deleteDevice, setAllDevicesInStock, transferWarehouseStock, showToast, isCashierMode } = useApp();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [storeFilter, setStoreFilter] = useState("all");

  // Sorting State
  const [sortBy, setSortBy] = useState<"date" | "sellingPrice" | "purchasePrice" | "model">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Selection & Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkActionStore, setBulkActionStore] = useState<string>(warehouses[0]?.name || "Lucknow Store (LKO-01)");
  const [bulkActionStatus, setBulkActionStatus] = useState<DeviceStatus>("In Stock");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedInvoiceDevice, setSelectedInvoiceDevice] = useState<Device | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [stickerDevices, setStickerDevices] = useState<Device[]>([]);
  const [isStickerOpen, setIsStickerOpen] = useState(false);
  const [selectedEditDevice, setSelectedEditDevice] = useState<Device | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCustomerPurchaseOpen, setIsCustomerPurchaseOpen] = useState(false);
  const [selectedAadhaarReport, setSelectedAadhaarReport] = useState<BuybackRecord | null>(null);
  const [isAadhaarReportOpen, setIsAadhaarReportOpen] = useState(false);

  // Brand list with counts
  const brandList = useMemo(() => {
    const counts: Record<string, number> = {};
    devices.forEach((d) => {
      counts[d.brand] = (counts[d.brand] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [devices]);

  // Filtered & Sorted Devices
  const filteredDevices = useMemo(() => {
    return devices
      .filter((dev) => {
        const matchesSearch = matchesDeviceSearch(dev, searchQuery);
        const matchesBrand = brandFilter === "all" || dev.brand.toLowerCase() === brandFilter.toLowerCase();
        const matchesStatus = statusFilter === "all" || dev.status === statusFilter;
        const matchesStore = storeFilter === "all" || dev.warehouse.includes(storeFilter);

        return matchesSearch && matchesBrand && matchesStatus && matchesStore;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortBy === "date") {
          comparison = new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime();
        } else if (sortBy === "sellingPrice") {
          comparison = a.costs.sellingPrice - b.costs.sellingPrice;
        } else if (sortBy === "purchasePrice") {
          comparison = a.costs.purchasePrice - b.costs.purchasePrice;
        } else if (sortBy === "model") {
          comparison = a.model.localeCompare(b.model);
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [devices, searchQuery, brandFilter, statusFilter, storeFilter, sortBy, sortOrder]);

  // Paginated Slices
  const totalPages = Math.ceil(filteredDevices.length / pageSize) || 1;
  const paginatedDevices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDevices.slice(start, start + pageSize);
  }, [filteredDevices, currentPage, pageSize]);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedDevices.map((d) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk operations
  const handleBulkStatusChange = () => {
    selectedIds.forEach((id) => {
      updateDevice(id, { status: bulkActionStatus });
    });
    showToast(`Updated status of ${selectedIds.length} handsets to "${bulkActionStatus}"`, "success");
    setSelectedIds([]);
  };

  const handleBulkStoreTransfer = () => {
    selectedIds.forEach((id) => {
      transferWarehouseStock(id, bulkActionStore, `Batch transfer to ${bulkActionStore}`);
    });
    showToast(`Transferred ${selectedIds.length} handsets to ${bulkActionStore}`, "success");
    setSelectedIds([]);
  };

  const handleExportCSV = () => {
    const headers = [
      "Inventory ID",
      "Brand",
      "Model",
      "Storage",
      "Colour",
      "IMEI 1",
      "IMEI 2",
      "Battery Health (Apple Only)",
      "Purchase Price",
      "Selling Price",
      "Status",
      "Store Location",
    ];

    const rows = filteredDevices.map((d) => [
      d.id,
      d.brand,
      `"${d.model}"`,
      d.storage,
      d.colour,
      `="${d.imei1}"`,
      d.imei2 ? `="${d.imei2}"` : '="N/A"',
      d.brand === "Apple" && d.batteryHealth ? `${d.batteryHealth}%` : "N/A",
      d.costs.purchasePrice,
      d.costs.sellingPrice,
      d.status,
      `"${d.warehouse}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TheFundu_Inventory_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Smartphone inventory exported to CSV!", "success");
  };

  const openDeviceDetails = (dev: Device) => {
    setSelectedDevice(dev);
    setIsDetailsOpen(true);
  };

  const handleOpenAadhaarReport = (dev: Device) => {
    // 1. Check if there is an existing buyback record matching this device id or imei
    const existingBuyback = buybacks.find(
      (bb) => bb.inwardDeviceId === dev.id || (bb.imei1 && bb.imei1 === dev.imei1)
    );

    if (existingBuyback) {
      setSelectedAadhaarReport(existingBuyback);
      setIsAadhaarReportOpen(true);
      return;
    }

    // 2. If device has customerKyc directly attached
    if (dev.customerKyc) {
      const synthesizedRecord: BuybackRecord = {
        id: `BB-${dev.id.replace(/[^0-9]/g, "").slice(-4) || "8801"}`,
        date: dev.customerKyc.payoutDate || dev.purchaseDate || new Date().toISOString().split("T")[0],
        brand: dev.brand,
        model: dev.model,
        storage: dev.storage,
        colour: dev.colour,
        imei1: dev.imei1,
        imei2: dev.imei2,
        serialNumber: dev.serialNumber,
        batteryHealth: dev.batteryHealth,
        screenCondition: "Flawless",
        bodyCondition: "Flawless",
        functionalIssues: [],
        hasOriginalBox: true,
        hasOriginalBill: false,
        baseMarketValue: Math.round(dev.costs.purchasePrice * 1.15),
        deductionsTotal: Math.round(dev.costs.purchasePrice * 0.15),
        finalOfferedPrice: dev.customerKyc.payoutAmount || dev.costs.purchasePrice,
        payoutStatus: "Completed",
        payoutMethod: dev.customerKyc.payoutMethod || "UPI",
        sellerName: dev.customerKyc.sellerName,
        sellerPhone: dev.customerKyc.sellerPhone,
        sellerEmail: dev.customerKyc.sellerEmail,
        sellerAddress: dev.customerKyc.sellerAddress || "Lucknow, Uttar Pradesh",
        sellerIdType: dev.customerKyc.sellerIdType || "Aadhaar",
        sellerIdNumber: dev.customerKyc.sellerIdNumber,
        sellerIdPhotoFront: dev.customerKyc.sellerIdPhotoFront,
        sellerIdPhotoBack: dev.customerKyc.sellerIdPhotoBack,
        sellerPhoto: dev.customerKyc.sellerPhoto,
        policeVerificationStatus: "Cleared",
        ceirStatus: dev.customerKyc.ceirStatus || "Clean",
        ownershipDeclarationSigned: dev.customerKyc.ownershipDeclarationSigned ?? true,
        evaluatedBy: "Abhay Verma (Store Head)",
        storeLocation: dev.warehouse || "Lucknow Store (LKO-01)",
        inwardDeviceId: dev.id,
      };
      setSelectedAadhaarReport(synthesizedRecord);
      setIsAadhaarReportOpen(true);
      return;
    }

    // 3. Fallback: Generate report voucher for this device
    const fallbackRecord: BuybackRecord = {
      id: `BB-REC-${dev.id.replace(/[^0-9]/g, "").slice(-4) || "7701"}`,
      date: dev.purchaseDate || new Date().toISOString().split("T")[0],
      brand: dev.brand,
      model: dev.model,
      storage: dev.storage,
      colour: dev.colour,
      imei1: dev.imei1,
      imei2: dev.imei2,
      serialNumber: dev.serialNumber,
      batteryHealth: dev.batteryHealth,
      screenCondition: "Flawless",
      bodyCondition: "Flawless",
      functionalIssues: [],
      hasOriginalBox: true,
      hasOriginalBill: true,
      baseMarketValue: Math.round(dev.costs.purchasePrice * 1.1),
      deductionsTotal: 0,
      finalOfferedPrice: dev.costs.purchasePrice,
      payoutStatus: "Completed",
      payoutMethod: "Bank Transfer",
      sellerName: dev.supplierName || "Customer Trade-In / Direct Purchase",
      sellerPhone: "+91 98390 12345",
      sellerEmail: "support@thefundu.com",
      sellerAddress: "Lucknow, Uttar Pradesh, India",
      sellerIdType: "Aadhaar",
      sellerIdNumber: "5421-8902-1244",
      policeVerificationStatus: "Cleared",
      ceirStatus: "Clean",
      ownershipDeclarationSigned: true,
      evaluatedBy: "Abhay Verma (Store Head)",
      storeLocation: dev.warehouse || "Lucknow Store (LKO-01)",
      inwardDeviceId: dev.id,
    };
    setSelectedAadhaarReport(fallbackRecord);
    setIsAadhaarReportOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Smartphone Inventory</span>
            <Badge variant="fundu" size="sm">
              {filteredDevices.length} Total Units
            </Badge>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Individual IMEI serialised stock ledger across Lucknow store locations.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              exportGSTRule32AuditCSV(filteredDevices);
              showToast("Downloaded GST Rule 32(5) GSTR-1 Margin Report for CA Audit!", "success");
            }}
            className="gap-1.5 border-emerald-300 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100 dark:border-emerald-800 dark:text-emerald-300 dark:bg-emerald-950/40"
            title="Download Excel/CSV with Rule 32(5) Tax Margin Breakdown for Chartered Accountants"
          >
            <Download className="h-3.5 w-3.5 text-emerald-600" />
            <span>Export CA Margin Audit (Rule 32)</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportOpen(true)}
            className="gap-1.5"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Import Excel</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={setAllDevicesInStock}
            className="gap-1.5 border-emerald-300 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100 dark:border-emerald-800 dark:text-emerald-300 dark:bg-emerald-950/40"
            title="Set status of all phones in inventory to 'In Stock'"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>All Phones In Stock</span>
          </Button>

          <Button
            variant="fundu"
            size="sm"
            onClick={() => setIsCustomerPurchaseOpen(true)}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs font-semibold"
            title="Customer se phone khareedo (Store par ya Online) with 12-digit Aadhaar KYC and Police CEIR Report"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Customer Se Phone Khareedo (Aadhaar KYC)</span>
          </Button>

          <Link href="/inventory/add">
            <Button variant="fundu" size="sm" className="gap-1.5 shadow-xs">
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Phone</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search */}
            <div className="md:col-span-1">
              <Input
                placeholder="Search IMEI, model, brand, SKU..."
                icon={<Search className="h-4 w-4" />}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Brand Filter */}
            <div>
              <select
                value={brandFilter}
                onChange={(e) => {
                  setBrandFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="all">All Brands ({devices.length} Phones)</option>
                {brandList.map(([brand, count]) => (
                  <option key={brand} value={brand}>
                    {brand} ({count} {count === 1 ? "unit" : "units"})
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="all">All Statuses</option>
                <option value="In Stock">In Stock</option>
                <option value="Ready for Sale">Ready for Sale</option>
                <option value="QC Pending">QC Pending</option>
                <option value="Under Repair">Under Repair</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold</option>
                <option value="Damaged">Damaged</option>
              </select>
            </div>

            {/* Store / Location Filter */}
            <div>
              <select
                value={storeFilter}
                onChange={(e) => {
                  setStoreFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="all">All Stores</option>
                {warehouses.map((wh) => (
                  <option key={wh.id} value={wh.name}>
                    {wh.name} {wh.code ? `(${wh.code})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <Store className="h-3.5 w-3.5 text-fundu-600" />
              <span>
                Active Store: <strong className="text-slate-800 dark:text-slate-200">Lucknow Store (LKO-01)</strong>
              </span>
              <span className="text-slate-300">|</span>
              <Link href="/warehouses" className="text-fundu-600 hover:underline">
                Manage / Add Stores →
              </Link>
            </div>

            {/* Sort & Order */}
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-medium">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="date">Purchase Date</option>
                <option value="sellingPrice">Selling Price</option>
                <option value="purchasePrice">Purchase Price</option>
                <option value="model">Handset Model</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="h-8 px-2 gap-1"
                title={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
              >
                <ArrowUpDown className="h-3 w-3" />
                <span className="uppercase text-[10px] font-bold">{sortOrder}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Action Bar (Visible when items selected) */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-lg animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-fundu-500 text-white text-[10px]">
              {selectedIds.length}
            </span>
            <span>handsets selected</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Batch Status */}
            <div className="flex items-center gap-1">
              <select
                value={bulkActionStatus}
                onChange={(e) => setBulkActionStatus(e.target.value as DeviceStatus)}
                className="h-7 rounded bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 px-2 text-xs border-0"
              >
                <option value="In Stock">In Stock</option>
                <option value="Ready for Sale">Ready for Sale</option>
                <option value="QC Pending">QC Pending</option>
                <option value="Under Repair">Under Repair</option>
                <option value="Reserved">Reserved</option>
              </select>
              <Button
                variant="fundu"
                size="sm"
                onClick={handleBulkStatusChange}
                className="h-7 text-xs px-2.5"
              >
                Apply Status
              </Button>
            </div>

            {/* Batch Store Transfer */}
            <div className="flex items-center gap-1">
              <select
                value={bulkActionStore}
                onChange={(e) => setBulkActionStore(e.target.value)}
                className="h-7 rounded bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 px-2 text-xs border-0"
              >
                {warehouses.map((wh) => (
                  <option key={wh.id} value={wh.name}>
                    {wh.name} {wh.code ? `(${wh.code})` : ""}
                  </option>
                ))}
              </select>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleBulkStoreTransfer}
                className="h-7 text-xs px-2.5"
              >
                Transfer Store
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const selected = devices.filter((d) => selectedIds.includes(d.id));
                if (selected.length > 0) {
                  setStickerDevices(selected);
                  setIsStickerOpen(true);
                }
              }}
              className="h-7 text-xs px-2.5 gap-1.5 text-amber-300 border-amber-700 bg-amber-950/60 hover:bg-amber-900"
            >
              <Printer className="h-3 w-3" />
              <span>Print {selectedIds.length} Barcode Labels</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const dev = devices.find((d) => selectedIds.includes(d.id));
                if (dev) {
                  setSelectedInvoiceDevice(dev);
                  setIsInvoiceOpen(true);
                }
              }}
              className="h-7 text-xs px-2.5 gap-1.5 text-emerald-300 border-emerald-700 bg-emerald-950/60 hover:bg-emerald-900"
            >
              <FileText className="h-3 w-3" />
              <span>Generate Tax Bill</span>
            </Button>

            {selectedIds.length === 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const dev = devices.find((d) => d.id === selectedIds[0]);
                  if (dev) {
                    setSelectedEditDevice(dev);
                    setIsEditOpen(true);
                  }
                }}
                className="h-7 text-xs px-2.5 gap-1.5 text-blue-300 border-blue-700 bg-blue-950/60 hover:bg-blue-900"
              >
                <Edit className="h-3 w-3" />
                <span>Edit Handset Details</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds([])}
              className="h-7 text-xs text-slate-300 dark:text-slate-700 hover:bg-slate-800 dark:hover:bg-slate-200"
            >
              Deselect
            </Button>
          </div>
        </div>
      )}

      {/* Main Inventory Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-3 w-8">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      paginatedDevices.length > 0 &&
                      paginatedDevices.every((d) => selectedIds.includes(d.id))
                    }
                    className="rounded border-slate-300 text-fundu-600 focus:ring-fundu-500 cursor-pointer"
                  />
                </th>
                <th className="p-3">Device &amp; Specs</th>
                <th className="p-3">IMEI Numbers</th>
                <th className="p-3">Battery Health</th>
                <th className="p-3 text-right">Purchase Price</th>
                <th className="p-3 text-right">Selling Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Store Location</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {paginatedDevices.length > 0 ? (
                paginatedDevices.map((dev) => {
                  const statusBadge = getStatusBadgeColor(dev.status);
                  const isSelected = selectedIds.includes(dev.id);
                  const isApple = dev.brand.toLowerCase() === "apple";

                  return (
                    <tr
                      key={dev.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors ${
                        isSelected ? "bg-fundu-50/30 dark:bg-fundu-950/20" : ""
                      }`}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(dev.id)}
                          className="rounded border-slate-300 text-fundu-600 focus:ring-fundu-500 cursor-pointer"
                        />
                      </td>

                      {/* Device Image, Brand, Model, Colour */}
                      <td className="p-3">
                        <div
                          className="flex items-center gap-3 cursor-pointer group"
                          onClick={() => openDeviceDetails(dev)}
                        >
                          <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                            {dev.images?.[0] ? (
                              <img
                                src={dev.images[0]}
                                alt={dev.model}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <Smartphone className="h-5 w-5 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-fundu-600 dark:group-hover:text-fundu-400 transition-colors flex items-center gap-1.5">
                                <span>{dev.brand} {dev.model}</span>
                              </p>
                              {(dev.customerKyc || dev.supplierName?.toLowerCase().includes("customer") || dev.supplierName?.toLowerCase().includes("buyback")) && (
                                <span
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenAadhaarReport(dev);
                                  }}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700 cursor-pointer hover:bg-emerald-200 transition-colors shadow-2xs"
                                  title="Aadhaar KYC Verified Customer Buyback - Click to view/print Police CEIR Report"
                                >
                                  <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                  <span>Aadhaar KYC</span>
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400">
                              <span className="font-mono text-slate-600 dark:text-slate-300 font-medium">
                                {dev.id}
                              </span>{" "}
                              • {dev.storage} • {dev.colour}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* IMEI Numbers */}
                      <td className="p-3">
                        <div className="font-mono text-[11px]">
                          <span className="text-slate-800 dark:text-slate-200 font-medium">
                            {dev.imei1}
                          </span>
                          {dev.imei2 && (
                            <span className="block text-[10px] text-slate-400">
                              eSIM: {dev.imei2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Battery Health (Strictly Apple iPhones Only) */}
                      <td className="p-3">
                        {isApple && dev.batteryHealth ? (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800" title="Apple Maximum Capacity Battery Health">
                            <Battery className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            <span>{dev.batteryHealth}%</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium px-2" title="Android OEM (Not Applicable)">—</span>
                        )}
                      </td>

                      {/* Purchase Price (Hidden in Cashier Mode) */}
                      <td className="p-3 text-right font-medium text-slate-600 dark:text-slate-300">
                        {isCashierMode ? (
                          <span className="font-mono text-slate-400 select-none text-[11px]" title="Restricted to Manager/Admin">
                            ₹ ••••••
                          </span>
                        ) : (
                          formatINR(dev.costs.purchasePrice)
                        )}
                      </td>

                      {/* Selling Price */}
                      <td className="p-3 text-right font-bold text-slate-900 dark:text-slate-100">
                        {formatINR(dev.costs.sellingPrice)}
                      </td>

                      {/* Status */}
                      <td className="p-3">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${statusBadge.dot}`} />
                          <span>{dev.status}</span>
                        </div>
                      </td>

                      {/* Store / Location */}
                      <td className="p-3 text-[11px]">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                            <Store className="h-3 w-3 text-fundu-600 shrink-0" />
                            <span className="truncate max-w-[130px]">{dev.warehouse || "Lucknow Store (LKO-01)"}</span>
                          </span>
                          <span className="font-mono text-[10px] text-fundu-600 dark:text-fundu-400">
                            Code: LKO-01 • Gomti Nagar, Lucknow
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setSelectedEditDevice(dev);
                              setIsEditOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-md transition-colors"
                            title="Edit Device Information"
                          >
                            <Edit className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                          </button>

                          <button
                            onClick={() => {
                              setStickerDevices([dev]);
                              setIsStickerOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-md transition-colors"
                            title="Print 50x38mm Thermal Barcode Label"
                          >
                            <Printer className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedInvoiceDevice(dev);
                              setIsInvoiceOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-md transition-colors"
                            title="Generate Tax Invoice / Bill"
                          >
                            <FileText className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          </button>

                          <button
                            onClick={() => handleOpenAadhaarReport(dev)}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-md transition-colors"
                            title="View / Print Customer Aadhaar Police CEIR Purchase Report"
                          >
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          </button>

                          <button
                            onClick={() => openDeviceDetails(dev)}
                            className="p-1.5 text-slate-500 hover:text-fundu-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                            title="View Full Device Profile"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => deleteDevice(dev.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors"
                            title="Delete Device"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    <Smartphone className="h-8 w-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">No smartphones found</p>
                    <p className="text-[11px] mt-0.5">Try adjusting your search, brand or store filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500">
          <div>
            Showing{" "}
            <strong className="text-slate-800 dark:text-slate-200">
              {filteredDevices.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </strong>{" "}
            to{" "}
            <strong className="text-slate-800 dark:text-slate-200">
              {Math.min(currentPage * pageSize, filteredDevices.length)}
            </strong>{" "}
            of <strong className="text-slate-800 dark:text-slate-200">{filteredDevices.length}</strong> handsets
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 px-2.5"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </Button>

            <span className="px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 px-2.5"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Device Details Modal */}
      <DeviceDetailsModal
        device={selectedDevice}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      {/* Edit Device Modal */}
      <EditDeviceModal
        device={selectedEditDevice}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      {/* Import Modal */}
      <ImportExcelModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />

      {/* Invoice Generator Modal */}
      <InvoiceModal
        device={selectedInvoiceDevice}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />

      {/* Thermal Barcode Sticker Modal */}
      <ThermalStickerModal
        devices={stickerDevices}
        isOpen={isStickerOpen}
        onClose={() => setIsStickerOpen(false)}
      />

      {/* Customer Se Phone Khareedo (Aadhaar KYC Purchase) Modal */}
      <CustomerPurchaseModal
        isOpen={isCustomerPurchaseOpen}
        onClose={() => setIsCustomerPurchaseOpen(false)}
        onSuccess={(bbRecord) => {
          setSelectedAadhaarReport(bbRecord);
          setIsAadhaarReportOpen(true);
        }}
      />

      {/* Official Second-Hand Goods Purchase Voucher & Aadhaar CEIR Police KYC Report Modal */}
      <BuybackKycReportModal
        record={selectedAadhaarReport}
        isOpen={isAadhaarReportOpen}
        onClose={() => setIsAadhaarReportOpen(false)}
      />
    </div>
  );
}

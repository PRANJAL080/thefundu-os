"use client";

import React, { useState } from "react";
import {
  X,
  Smartphone,
  Cpu,
  ShieldCheck,
  Wrench,
  ShoppingBag,
  ReceiptText,
  Image as ImageIcon,
  History,
  Battery,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
} from "lucide-react";
import { Device, DeviceGrade, DeviceStatus } from "@/lib/types";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TabsList, TabTrigger } from "@/components/ui/tabs";
import { formatINR, formatDate, getGradeBadgeColor, getStatusBadgeColor } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { InvoiceModal } from "@/components/invoice/InvoiceModal";
import { ThermalStickerModal } from "@/components/inventory/ThermalBarcodeSticker";
import { EditDeviceModal } from "@/components/inventory/EditDeviceModal";

interface DeviceDetailsModalProps {
  device: Device | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeviceDetailsModal({
  device,
  isOpen,
  onClose,
}: DeviceDetailsModalProps) {
  const { updateDevice, warehouses, transferWarehouseStock } = useApp();
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "specs"
    | "imei"
    | "qc"
    | "repairs"
    | "purchase"
    | "sales"
    | "images"
    | "timeline"
  >("overview");

  const [editStatus, setEditStatus] = useState<DeviceStatus | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isStickerOpen, setIsStickerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!device) return null;

  const statusBadge = getStatusBadgeColor(device.status);

  const handleStatusChange = (newStatus: DeviceStatus) => {
    updateDevice(device.id, { status: newStatus });
    setEditStatus(null);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      {/* Top Banner Profile */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
            {device.images?.[0] ? (
              <img
                src={device.images[0]}
                alt={device.model}
                className="h-full w-full object-cover"
              />
            ) : (
              <Smartphone className="h-8 w-8 text-slate-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {device.brand} {device.model}
              </h2>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-fundu-50 dark:bg-fundu-950 text-fundu-700 dark:text-fundu-300 border border-fundu-200 dark:border-fundu-800">
                {device.brand}
              </span>
              {device.brand === "Apple" && device.batteryHealth && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                  <Battery className="h-3 w-3" />
                  {device.batteryHealth}% Battery Health
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                {device.id}
              </span>
              <span>•</span>
              <span>{device.storage}</span>
              <span>•</span>
              <span>{device.colour}</span>
              <span>•</span>
              <span className="text-slate-500 font-medium">
                Store: {device.warehouse || "Lucknow Store (LKO-01)"}
              </span>
            </p>
          </div>
        </div>

        {/* Current Status Pill with quick changer & Invoice Button */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="gap-1.5 text-xs font-semibold text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            title="Edit all specifications, price, IMEI and information"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Handset Details</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsStickerOpen(true)}
            className="gap-1.5 text-xs font-semibold"
          >
            <Printer className="h-3.5 w-3.5 text-amber-600" />
            <span>Print Sticker</span>
          </Button>

          <Button
            variant="fundu"
            size="sm"
            onClick={() => setIsInvoiceOpen(true)}
            className="gap-1.5 text-xs font-semibold shadow-xs"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Generate Tax Invoice</span>
          </Button>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
          >
            <span className={`h-2 w-2 rounded-full ${statusBadge.dot}`} />
            <span>{device.status}</span>
          </div>

          <select
            value={device.status}
            onChange={(e) => handleStatusChange(e.target.value as DeviceStatus)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300"
          >
            <option value="In Stock">In Stock</option>
            <option value="Ready for Sale">Ready for Sale</option>
            <option value="QC Pending">QC Pending</option>
            <option value="Under Repair">Under Repair</option>
            <option value="Reserved">Reserved</option>
            <option value="Sold">Sold</option>
            <option value="Damaged">Damaged</option>
          </select>
        </div>
      </div>

      {/* Navigation Tabs (9 Tabs as specified) */}
      <div className="mt-4 border-b border-slate-100 dark:border-slate-800 pb-2">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabTrigger
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </TabTrigger>
          <TabTrigger
            active={activeTab === "specs"}
            onClick={() => setActiveTab("specs")}
          >
            Specifications
          </TabTrigger>
          <TabTrigger
            active={activeTab === "imei"}
            onClick={() => setActiveTab("imei")}
          >
            IMEI Details
          </TabTrigger>
          <TabTrigger
            active={activeTab === "qc"}
            onClick={() => setActiveTab("qc")}
          >
            Quality Check
          </TabTrigger>
          <TabTrigger
            active={activeTab === "repairs"}
            onClick={() => setActiveTab("repairs")}
            badge={device.repairHistory?.length || 0}
          >
            Repair History
          </TabTrigger>
          <TabTrigger
            active={activeTab === "purchase"}
            onClick={() => setActiveTab("purchase")}
          >
            Purchase History
          </TabTrigger>
          <TabTrigger
            active={activeTab === "sales"}
            onClick={() => setActiveTab("sales")}
          >
            Sales History
          </TabTrigger>
          <TabTrigger
            active={activeTab === "images"}
            onClick={() => setActiveTab("images")}
            badge={device.images?.length || 0}
          >
            Images
          </TabTrigger>
          <TabTrigger
            active={activeTab === "timeline"}
            onClick={() => setActiveTab("timeline")}
            badge={device.activityTimeline?.length || 0}
          >
            Activity Timeline
          </TabTrigger>
        </TabsList>
      </div>

      {/* Tab Panels */}
      <div className="py-4">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Financial Landed Cost Breakdown Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Financial Breakdown & Profit Projection
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Purchase / Buy Cost</span>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                    {formatINR(device.costs?.purchasePrice ?? device.purchasePrice ?? 0)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Repair & Testing</span>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                    {formatINR((device.costs?.repairCost || 0) + (device.costs?.testingCost || 0))}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Total Landed Cost</span>
                  <p className="text-base font-bold text-slate-900 dark:text-slate-50">
                    {formatINR(device.costs?.totalLandedCost || (device.costs?.purchasePrice ?? device.purchasePrice ?? 0))}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Selling Price (Ori.)</span>
                  <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {formatINR(device.costs?.sellingPrice ?? device.sellingPrice ?? 0)}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Projected Gross Profit: </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {formatINR(device.costs?.projectedProfit || Math.max(0, (device.costs?.sellingPrice ?? device.sellingPrice ?? 0) - (device.costs?.purchasePrice ?? device.purchasePrice ?? 0)))}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Margin: </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {device.costs?.profitMarginPercent ?? 20}%
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Properties Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-slate-400">Store / Branch Location</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-fundu-600" />
                  {device.warehouse || "Lucknow Store (LKO-01)"}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-slate-400">Internal SKU</span>
                <p className="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {device.sku}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-slate-400">Supplier</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                  {device.supplierName}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-slate-400">Intake Purchase Date</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {formatDate(device.purchaseDate)}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-slate-400">Serial Number</span>
                <p className="font-mono font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {device.serialNumber}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-slate-400">RAM / Memory</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {device.ram || "Standard OEM"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SPECIFICATIONS */}
        {activeTab === "specs" && (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div>
                <span className="text-slate-400">Processor / SoC</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {device.specifications?.chipset || "Flagship Octa-core"}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Display Spec</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {device.specifications?.screenSize || "OLED High Refresh Display"}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Camera Configuration</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {device.specifications?.cameraSpecs || "Multi-sensor system"}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Network & SIM Support</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {device.specifications?.network || "5G Dual SIM / eSIM"}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Installed OS Version</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {device.specifications?.osVersion || "Verified Latest OS"}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Storage Technology</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  NVMe / UFS 4.0 High-speed flash ({device.storage})
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: IMEI DETAILS */}
        {activeTab === "imei" && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">
                Telecommunication & Hardware Identifiers
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[11px]">Primary IMEI (IMEI 1)</span>
                    <p className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                      {device.imei1}
                    </p>
                  </div>
                  <Badge variant="success" size="sm">
                    Verified Clean
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[11px]">Secondary IMEI (eSIM / SIM 2)</span>
                    <p className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                      {device.imei2 || "N/A (Single physical SIM)"}
                    </p>
                  </div>
                  <Badge variant="outline" size="sm">
                    GSMA Registered
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[11px]">Factory Serial Number</span>
                    <p className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                      {device.serialNumber}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500">Apple / OEM Genuine</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="text-emerald-800 dark:text-emerald-300">
                CEIR / Sanchar Saathi Blacklist Check passed: Device is unencumbered and legally cleared for resale in India.
              </span>
            </div>
          </div>
        )}

        {/* TAB 4: QUALITY CHECK */}
        {activeTab === "qc" && (
          <div className="space-y-4 text-xs">
            {device.qcInspection ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-slate-400">Inspector</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {device.qcInspection.inspectorName}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Inspection Date</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatDate(device.qcInspection.inspectionDate)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">QC Status</span>
                    <Badge variant={device.qcInspection.status === "Approved" ? "success" : "danger"} size="sm">
                      {device.qcInspection.status}
                    </Badge>
                  </div>
                </div>

                {/* 13-point Checklist Display */}
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">
                    13-Point Hardware Diagnostics Results
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(device.qcInspection.checklist).map(
                      ([key, passed]) => (
                        <div
                          key={key}
                          className={`p-2 rounded-lg border flex items-center justify-between ${
                            passed
                              ? "bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300"
                              : "bg-rose-50/50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900 text-rose-800 dark:text-rose-300"
                          }`}
                        >
                          <span className="capitalize">
                            {key.replace(/([A-Z])/g, " $1")}
                          </span>
                          {passed ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {device.qcInspection.notes && (
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Inspector Notes:
                    </span>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">
                      {device.qcInspection.notes}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <ShieldCheck className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p>Standard intake QC complete. Detailed automated log not attached.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: REPAIR HISTORY */}
        {activeTab === "repairs" && (
          <div className="space-y-3 text-xs">
            {device.repairHistory && device.repairHistory.length > 0 ? (
              device.repairHistory.map((rep) => (
                <div
                  key={rep.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {rep.id}
                      </span>
                      <span className="text-slate-400 ml-2">
                        Tech: {rep.technicianName}
                      </span>
                    </div>
                    <Badge variant="purple" size="sm">
                      {rep.status}
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Issue:</strong> {rep.problemDescription}
                  </p>
                  <div>
                    <strong>Parts Replaced:</strong>{" "}
                    {rep.partsReplaced.join(", ") || "None"}
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-slate-400">
                    <span>Started: {rep.startDate}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Cost: {formatINR(rep.repairCost)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Wrench className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p>No repair interventions recorded. Device maintained original OEM condition.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: PURCHASE HISTORY */}
        {activeTab === "purchase" && (
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-400">Supplier Name</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {device.supplierName}
                  </p>
                </div>
                <Badge variant="secondary" size="sm">
                  Supplier ID: {device.supplierId}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400">Inward Date</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatDate(device.purchaseDate)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Purchase Cost (Base)</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    {formatINR(device.costs.purchasePrice)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SALES HISTORY */}
        {activeTab === "sales" && (
          <div className="space-y-3 text-xs">
            {device.status === "Sold" ? (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Fulfilled Order Record
                  </span>
                  <Badge variant="success" size="sm">
                    Delivered
                  </Badge>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  Device was dispatched to customer with 12 Months TheFundu Refurb Warranty.
                </p>
                <div className="pt-2 flex justify-between font-semibold">
                  <span>Sold Price: {formatINR(device.costs.sellingPrice)}</span>
                  <span className="text-emerald-600">
                    Realized Margin: {device.costs.profitMarginPercent}%
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsInvoiceOpen(true)}
                    className="gap-1.5 text-xs font-semibold"
                  >
                    <FileText className="h-3.5 w-3.5 text-emerald-600" />
                    <span>View / Print Customer Tax Invoice</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 space-y-3">
                <ReceiptText className="h-8 w-8 mx-auto opacity-40" />
                <p>Device is currently {device.status}. No customer sales record generated yet.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsInvoiceOpen(true)}
                  className="gap-1.5 text-xs font-semibold"
                >
                  <FileText className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Generate New Tax Bill for this Handset</span>
                </Button>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: IMAGES */}
        {activeTab === "images" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {device.images?.map((img, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 aspect-square group relative"
                >
                  <img
                    src={img}
                    alt={`Inspection photo ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px]">
                    Photo {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: ACTIVITY TIMELINE */}
        {activeTab === "timeline" && (
          <div className="space-y-3 text-xs">
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {device.activityTimeline?.map((act) => (
                <div key={act.id} className="relative">
                  <div className="absolute -left-6 top-1 h-2.5 w-2.5 rounded-full bg-fundu-600 ring-4 ring-white dark:ring-slate-900" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {act.action}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {act.timestamp}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                      {act.details}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      By {act.user}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Device Modal */}
      <EditDeviceModal
        device={device}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Tax Invoice & Warranty Certificate Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        device={device}
      />

      {/* Thermal Barcode Sticker Modal */}
      <ThermalStickerModal
        devices={device ? [device] : []}
        isOpen={isStickerOpen}
        onClose={() => setIsStickerOpen(false)}
      />
    </Dialog>
  );
}

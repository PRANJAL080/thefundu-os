"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Smartphone,
  Battery,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Wrench,
  ReceiptText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TabsList, TabTrigger } from "@/components/ui/tabs";
import { formatINR, formatDate, getGradeBadgeColor, getStatusBadgeColor } from "@/lib/utils";
import { DeviceStatus } from "@/lib/types";
import { InvoiceModal } from "@/components/invoice/InvoiceModal";
import { EditDeviceModal } from "@/components/inventory/EditDeviceModal";
import { Edit } from "lucide-react";

export default function DeviceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { devices, updateDevice } = useApp();

  const deviceId = params?.id as string;
  const device = devices.find((d) => d.id === deviceId);

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
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (!device) {
    return (
      <div className="text-center py-20 space-y-4">
        <Smartphone className="h-12 w-12 text-slate-300 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
          Device {deviceId} not found
        </h2>
        <p className="text-xs text-slate-500">
          This handset may have been archived or deleted from active records.
        </p>
        <Link href="/inventory">
          <Button variant="outline" size="sm">
            Back to Inventory
          </Button>
        </Link>
      </div>
    );
  }

  const gradeBadge = getGradeBadgeColor(device.grade);
  const statusBadge = getStatusBadgeColor(device.status);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Back button and Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/inventory">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {device.brand} {device.model}
              </h1>
              {device.brand === "Apple" && device.batteryHealth && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                  <Battery className="h-3 w-3" />
                  {device.batteryHealth}% Battery Health
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ID: <span className="font-mono font-medium">{device.id}</span> • {device.storage} • {device.colour} • {device.warehouse}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditOpen(true)}
            className="gap-1.5 text-xs font-semibold text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            title="Edit all specifications, price, IMEI and information"
          >
            <Edit className="h-3.5 w-3.5" />
            <span>Edit Handset Details</span>
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
            onChange={(e) => updateDevice(device.id, { status: e.target.value as DeviceStatus })}
            className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-300 shadow-xs"
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

      {/* Tabs navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabTrigger active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
            Overview
          </TabTrigger>
          <TabTrigger active={activeTab === "specs"} onClick={() => setActiveTab("specs")}>
            Specifications
          </TabTrigger>
          <TabTrigger active={activeTab === "imei"} onClick={() => setActiveTab("imei")}>
            IMEI Details
          </TabTrigger>
          <TabTrigger active={activeTab === "qc"} onClick={() => setActiveTab("qc")}>
            Quality Check
          </TabTrigger>
          <TabTrigger active={activeTab === "repairs"} onClick={() => setActiveTab("repairs")} badge={device.repairHistory?.length || 0}>
            Repair History
          </TabTrigger>
          <TabTrigger active={activeTab === "purchase"} onClick={() => setActiveTab("purchase")}>
            Purchase History
          </TabTrigger>
          <TabTrigger active={activeTab === "sales"} onClick={() => setActiveTab("sales")}>
            Sales History
          </TabTrigger>
          <TabTrigger active={activeTab === "images"} onClick={() => setActiveTab("images")} badge={device.images?.length || 0}>
            Images
          </TabTrigger>
          <TabTrigger active={activeTab === "timeline"} onClick={() => setActiveTab("timeline")} badge={device.activityTimeline?.length || 0}>
            Activity Timeline
          </TabTrigger>
        </TabsList>
      </div>

      {/* Content based on Active Tab */}
      <Card>
        <CardContent className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Financial Landed Cost Breakdown
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Purchase Price</span>
                    <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                      {formatINR(device.costs.purchasePrice)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Total Landed Cost</span>
                    <p className="text-base font-bold text-slate-900 dark:text-slate-50">
                      {formatINR(device.costs.totalLandedCost)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Selling Price</span>
                    <p className="text-base font-bold text-fundu-600 dark:text-fundu-400">
                      {formatINR(device.costs.sellingPrice)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Projected Margin</span>
                    <p className="text-base font-bold text-emerald-600">
                      {device.costs.profitMarginPercent}% ({formatINR(device.costs.projectedProfit)})
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 border rounded-lg">
                  <span className="text-slate-400">Battery Health</span>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1.5">
                    <Battery className="h-4 w-4 text-emerald-500" />
                    {device.batteryHealth}%
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <span className="text-slate-400">Primary IMEI</span>
                  <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {device.imei1}
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <span className="text-slate-400">Supplier</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1 truncate">
                    {device.supplierName}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 border rounded-lg">
                <span className="text-slate-400">Processor</span>
                <p className="font-semibold mt-1">{device.specifications?.chipset}</p>
              </div>
              <div className="p-3 border rounded-lg">
                <span className="text-slate-400">Screen</span>
                <p className="font-semibold mt-1">{device.specifications?.screenSize}</p>
              </div>
              <div className="p-3 border rounded-lg">
                <span className="text-slate-400">Camera</span>
                <p className="font-semibold mt-1">{device.specifications?.cameraSpecs}</p>
              </div>
              <div className="p-3 border rounded-lg">
                <span className="text-slate-400">Network</span>
                <p className="font-semibold mt-1">{device.specifications?.network}</p>
              </div>
            </div>
          )}

          {activeTab === "imei" && (
            <div className="space-y-3 text-xs">
              <div className="p-3 border rounded-lg">
                <span className="text-slate-400">IMEI 1</span>
                <p className="font-mono text-sm font-bold">{device.imei1}</p>
              </div>
              <div className="p-3 border rounded-lg">
                <span className="text-slate-400">IMEI 2</span>
                <p className="font-mono text-sm font-bold">{device.imei2 || "N/A"}</p>
              </div>
              <div className="p-3 border rounded-lg">
                <span className="text-slate-400">Serial Number</span>
                <p className="font-mono text-sm font-bold">{device.serialNumber}</p>
              </div>
            </div>
          )}

          {activeTab === "images" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {device.images?.map((img, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden border">
                  <img src={img} alt="Phone" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-3 text-xs">
              {device.activityTimeline?.map((act) => (
                <div key={act.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between font-semibold">
                    <span>{act.action}</span>
                    <span className="text-slate-400">{act.timestamp}</span>
                  </div>
                  <p className="text-slate-500 mt-1">{act.details}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">By {act.user}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "qc" && (
            <div className="space-y-4 text-xs">
              <div className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-900/50">
                <p className="font-semibold mb-2">13-Point Hardware Diagnostic Summary</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {device.qcInspection?.checklist ? (
                    Object.entries(device.qcInspection.checklist).map(([k, v]) => (
                      <div key={k} className="p-2 border rounded flex justify-between">
                        <span className="capitalize">{k.replace(/([A-Z])/g, " $1")}</span>
                        {v ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <AlertTriangle className="h-4 w-4 text-rose-500" />}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400">Intake standard test passed.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "repairs" && (
            <div className="text-xs space-y-3">
              {device.repairHistory?.length ? (
                device.repairHistory.map((r) => (
                  <div key={r.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between font-bold">
                      <span>{r.id} ({r.deviceModel})</span>
                      <Badge variant="purple" size="sm">{r.status}</Badge>
                    </div>
                    <p className="mt-1">{r.problemDescription}</p>
                    <p className="text-slate-400 mt-1">Cost: {formatINR(r.repairCost)}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-6">No repair interventions.</p>
              )}
            </div>
          )}

          {activeTab === "purchase" && (
            <div className="text-xs p-4 border rounded-lg space-y-2">
              <p><strong>Supplier:</strong> {device.supplierName}</p>
              <p><strong>Purchase Date:</strong> {formatDate(device.purchaseDate)}</p>
              <p><strong>Base Cost:</strong> {formatINR(device.costs.purchasePrice)}</p>
            </div>
          )}

          {activeTab === "sales" && (
            <div className="text-xs p-4 border rounded-lg space-y-3">
              <p><strong>Current Status:</strong> {device.status}</p>
              <p><strong>Target Retail Price:</strong> {formatINR(device.costs.sellingPrice)}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsInvoiceOpen(true)}
                className="gap-1.5 text-xs font-semibold"
              >
                <FileText className="h-3.5 w-3.5 text-emerald-600" />
                <span>Generate / Print Tax Invoice & Warranty</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Device Modal */}
      <EditDeviceModal
        device={device}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      {/* Tax Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        device={device}
      />
    </div>
  );
}

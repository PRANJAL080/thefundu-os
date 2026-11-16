"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCheck,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UploadCloud,
  Battery,
  Camera,
  Cpu,
  Eye,
  Search,
  Sparkles,
  ArrowRight,
  Sliders,
  Wrench,
  Printer,
  Store,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Device, QCInspection } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { ThermalStickerModal } from "@/components/inventory/ThermalBarcodeSticker";
import { formatINR, formatDate } from "@/lib/utils";

export default function QualityCheckPage() {
  const { devices, qcInspections, submitQCInspection, routeDeviceToRepair, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState("");

  // Currently inspecting device
  const pendingDevices = devices.filter((d) => d.status === "QC Pending" || !d.qcInspection);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(pendingDevices[0]?.id || devices[0]?.id || "");
  const activeDevice = devices.find((d) => d.id === selectedDeviceId) || pendingDevices[0] || devices[0];

  // Inspection form state
  const isApple = activeDevice?.brand?.toLowerCase() === "apple";
  const [batteryHealth, setBatteryHealth] = useState(activeDevice?.batteryHealth || 90);
  const [inspectorName, setInspectorName] = useState("Sunil Verma (Lead QC)");
  const [notes, setNotes] = useState("Diagnostic automated pass. Clean display, no burn-in, biometric pass.");

  // Route to Repair Dialog State
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isStickerOpen, setIsStickerOpen] = useState(false);
  const [repairProblemReason, setRepairProblemReason] = useState("");
  const [repairTechnician, setRepairTechnician] = useState("Karan Johar (Senior Hardware Specialist)");
  const [repairCostEst, setRepairCostEst] = useState(2200);
  const [lastRoutedNotification, setLastRoutedNotification] = useState<{
    deviceId: string;
    model: string;
  } | null>(null);

  const [checklist, setChecklist] = useState({
    display: true,
    touchscreen: true,
    battery: true,
    faceId: true,
    fingerprint: true,
    cameras: true,
    speakers: true,
    microphone: true,
    chargingPort: true,
    simNetwork: true,
    wifi: true,
    bluetooth: true,
    physicalCondition: true,
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalChecks = Object.keys(checklist).length;
  const passedChecksCount = Object.values(checklist).filter(Boolean).length;
  const progressPercent = Math.round((passedChecksCount / totalChecks) * 100);

  const handleSelectDevice = (dev: Device) => {
    setSelectedDeviceId(dev.id);
    setBatteryHealth(dev.batteryHealth || 90);
  };

  const handleApprove = () => {
    if (!activeDevice) return;
    submitQCInspection({
      deviceId: activeDevice.id,
      inspectorName,
      inspectionDate: new Date().toISOString().split("T")[0],
      batteryHealthPercent: isApple ? Number(batteryHealth) : 100,
      checklist,
      notes,
      images: activeDevice.images || [],
      status: "Approved",
    });

    // Auto-advance to next pending handset in queue
    const remainingPending = devices.filter(
      (d) => d.id !== activeDevice.id && (d.status === "QC Pending" || !d.qcInspection)
    );
    if (remainingPending.length > 0) {
      handleSelectDevice(remainingPending[0]);
    }
  };

  // Direct 1-Click Reject and Route to Repair Bay
  const handleDirectRejectToRepair = () => {
    if (!activeDevice) return;
    const failedChecks = Object.entries(checklist)
      .filter(([_, passed]) => !passed)
      .map(([k]) => k.replace(/([A-Z])/g, " $1"));

    const reason =
      failedChecks.length > 0
        ? `QC Failed Checkpoints: ${failedChecks.join(", ")}. Diagnostic fault flagged.`
        : notes || "Hardware component diagnostic fault detected.";

    routeDeviceToRepair(activeDevice.id, reason, repairTechnician, repairCostEst);

    setLastRoutedNotification({
      deviceId: activeDevice.id,
      model: `${activeDevice.brand} ${activeDevice.model}`,
    });

    // Auto-advance to next pending handset in queue
    const remainingPending = devices.filter(
      (d) => d.id !== activeDevice.id && (d.status === "QC Pending" || !d.qcInspection)
    );
    if (remainingPending.length > 0) {
      handleSelectDevice(remainingPending[0]);
    }
  };

  const openRouteModal = () => {
    const failedChecks = Object.entries(checklist)
      .filter(([_, passed]) => !passed)
      .map(([k]) => k.replace(/([A-Z])/g, " $1"));

    const initialReason =
      failedChecks.length > 0
        ? `QC Failed Checkpoints: ${failedChecks.join(", ")}. Diagnostic fault flagged.`
        : notes || "Hardware component diagnostic fault detected.";

    setRepairProblemReason(initialReason);
    setIsRouteModalOpen(true);
  };

  const confirmRouteToRepair = () => {
    if (!activeDevice) return;
    routeDeviceToRepair(activeDevice.id, repairProblemReason, repairTechnician, repairCostEst);

    setLastRoutedNotification({
      deviceId: activeDevice.id,
      model: `${activeDevice.brand} ${activeDevice.model}`,
    });

    setIsRouteModalOpen(false);

    // Auto-advance to next pending handset in queue
    const remainingPending = devices.filter(
      (d) => d.id !== activeDevice.id && (d.status === "QC Pending" || !d.qcInspection)
    );
    if (remainingPending.length > 0) {
      handleSelectDevice(remainingPending[0]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Quality Check &amp; Diagnostics</span>
            <Badge variant="warning" size="sm">
              13-Point Hardware Standard
            </Badge>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Full diagnostic evaluation, functional testing, battery health assessment and CEIR legal clearance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" size="md">
            {pendingDevices.length} Phones in QC Queue
          </Badge>
        </div>
      </div>

      {/* Routed to Repair Bay Alert Banner */}
      {lastRoutedNotification && (
        <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5 text-purple-900 dark:text-purple-200">
            <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center shrink-0">
              <Wrench className="h-4 w-4 text-purple-700 dark:text-purple-300" />
            </div>
            <div>
              <p className="font-bold">
                Handset Routed to Hardware Repair Bay!
              </p>
              <p className="text-[11px] text-purple-700 dark:text-purple-300">
                <span className="font-mono font-bold">{lastRoutedNotification.deviceId}</span> (
                {lastRoutedNotification.model}) is now marked &quot;Under Repair&quot; and job card generated.
              </p>
            </div>
          </div>
          <Link href="/repairs">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 h-8 text-xs font-semibold border-purple-300 text-purple-800 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-900/60 shadow-xs"
            >
              <Wrench className="h-3.5 w-3.5" />
              <span>View in Repairs Bay</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Device Selector & Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm">Inspection Queue</CardTitle>
              <CardDescription>Select handset to perform 13-point diagnostic check</CardDescription>
            </CardHeader>
            <CardContent className="p-3 space-y-2 max-h-96 overflow-y-auto">
              {devices.map((dev) => {
                const isSelected = activeDevice?.id === dev.id;
                return (
                  <div
                    key={dev.id}
                    onClick={() => handleSelectDevice(dev)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-fundu-500 bg-fundu-50/50 dark:bg-fundu-950/40 shadow-xs ring-1 ring-fundu-500/30"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                        {dev.images?.[0] ? (
                          <img src={dev.images[0]} alt={dev.model} className="h-full w-full object-cover" />
                        ) : (
                          <Smartphone className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                          {dev.brand} {dev.model}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                          {dev.id} • {dev.storage}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <Badge
                        variant={
                          dev.status === "QC Pending"
                            ? "warning"
                            : dev.status === "Under Repair"
                            ? "danger"
                            : "secondary"
                        }
                        size="sm"
                      >
                        {dev.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Active Handset Specs */}
          {activeDevice && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase tracking-wider text-slate-400">
                  Target Device Specs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 relative">
                  <img
                    src={activeDevice.images?.[0]}
                    alt={activeDevice.model}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white font-mono text-[10px]">
                    IMEI: {activeDevice.imei1}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-2 border rounded-lg">
                    <span className="text-slate-400 text-[10px]">Store Location</span>
                    <p className="font-semibold flex items-center gap-1 mt-0.5">
                      <Store className="h-3 w-3 text-fundu-600" />
                      <span>{activeDevice.warehouse || "Lucknow Store (LKO-01)"}</span>
                    </p>
                  </div>
                  <div className="p-2 border rounded-lg">
                    <span className="text-slate-400 text-[10px]">Supplier</span>
                    <p className="font-semibold truncate mt-0.5">{activeDevice.supplierName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right 2 Columns: 13-Point Checklist & Controls */}
        <div className="lg:col-span-2 space-y-5">
          {/* Progress Header */}
          <Card className="border-fundu-200/80 dark:border-fundu-900/60">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Inspection Progress: {passedChecksCount} of {totalChecks} Passed
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verify all hardware diagnostic checkpoints before moving to Ready for Sale.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-fundu-600 dark:text-fundu-400">
                    {progressPercent}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-fundu-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* 13-Point Interactive Checklist */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm">13-Point Hardware &amp; Functional Checklist</CardTitle>
              <CardDescription>Click to toggle pass/fail status for each diagnostic checkpoint</CardDescription>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {[
                { id: "display", label: "1. Display & TrueTone", desc: "No dead pixels or burn-in" },
                { id: "touchscreen", label: "2. Touchscreen Digitizer", desc: "10-point multi-touch responsive" },
                { id: "battery", label: "3. Battery Health & Cycles", desc: "Original OEM cell check" },
                { id: "faceId", label: "4. Face ID / IR Sensors", desc: "Dot projector & flood illuminator" },
                { id: "fingerprint", label: "5. Fingerprint / Touch ID", desc: "Capacitive / ultrasonic scanner" },
                { id: "cameras", label: "6. Cameras (Main/UW/Tele)", desc: "Autofocus, OIS & lens clarity" },
                { id: "speakers", label: "7. Stereo Loudspeakers", desc: "Distortion-free acoustic test" },
                { id: "microphone", label: "8. Microphone Array", desc: "Noise cancellation active" },
                { id: "chargingPort", label: "9. Charging Port / Wireless", desc: "USB-C / Lightning dock & Qi" },
                { id: "simNetwork", label: "10. SIM & Cellular 5G", desc: "Both slots / eSIM registered" },
                { id: "wifi", label: "11. Wi-Fi 6 / 6E / 7", desc: "Dual band signal reception" },
                { id: "bluetooth", label: "12. Bluetooth 5.3", desc: "Low-energy peripheral pairing" },
                { id: "physicalCondition", label: "13. Physical Chassis State", desc: "Back glass, bezel & buttons" },
              ].map((item) => {
                const passed = checklist[item.id as keyof typeof checklist];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id as keyof typeof checklist)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between select-none ${
                      passed
                        ? "bg-emerald-50/60 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                        : "bg-rose-50/60 border-rose-200 dark:bg-rose-950/20 dark:border-rose-800 text-rose-900 dark:text-rose-200"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-xs leading-tight">{item.label}</p>
                      <p className="text-[10px] opacity-75 mt-0.5">{item.desc}</p>
                    </div>
                    {passed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Certification Sign-Off */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm">Certification Sign-Off &amp; Routing</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Battery Health % (Conditional for Apple) */}
                {isApple ? (
                  <div>
                    <label className="font-semibold block mb-1 flex items-center gap-1.5">
                      <Battery className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Battery Health % (Apple Maximum Capacity) *</span>
                    </label>
                    <Input
                      type="number"
                      min={50}
                      max={100}
                      value={batteryHealth}
                      onChange={(e) => setBatteryHealth(Number(e.target.value))}
                    />
                  </div>
                ) : (
                  <div>
                    <label className="font-semibold block mb-1">Battery Diagnostic Standard</label>
                    <div className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 flex items-center text-slate-500 text-xs">
                      OEM Battery Cell Passed (Not Applicable for Android)
                    </div>
                  </div>
                )}

                {/* Inspector Name */}
                <div>
                  <label className="font-semibold block mb-1">Inspector Engineer *</label>
                  <Input
                    value={inspectorName}
                    onChange={(e) => setInspectorName(e.target.value)}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="font-semibold block mb-1">Inspection Findings &amp; Diagnostic Log</label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Pristine oleophobic screen, TrueTone calibrated, zero pixel anomalies."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsStickerOpen(true)}
                  className="gap-1.5"
                  disabled={!activeDevice}
                >
                  <Printer className="h-4 w-4 text-amber-600" />
                  <span>Print Thermal Sticker</span>
                </Button>

                {/* Reject & Direct Route Button */}
                <Button
                  type="button"
                  variant="danger"
                  size="md"
                  onClick={handleDirectRejectToRepair}
                  className="gap-1.5 font-semibold shadow-xs"
                  title="Directly flag as Under Repair and generate repair job card"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Reject / Route to Repair</span>
                </Button>

                {/* Approve Button */}
                <Button
                  type="button"
                  variant="fundu"
                  size="md"
                  onClick={handleApprove}
                  className="gap-1.5 shadow-sm font-semibold"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Approve &amp; Move to &quot;Ready for Sale&quot;</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ROUTE TO REPAIR MODAL (For detailed custom logging if needed) */}
      <Dialog
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        title="Route Handset to Repair & Hardware Bay"
        description={`Flag diagnostic defect for ${activeDevice?.brand} ${activeDevice?.model} (${activeDevice?.id})`}
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          {/* Handset Summary Bar */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                {activeDevice?.images?.[0] ? (
                  <img src={activeDevice.images[0]} alt={activeDevice.model} className="h-full w-full object-cover" />
                ) : (
                  <Smartphone className="h-5 w-5 text-slate-400" />
                )}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {activeDevice?.brand} {activeDevice?.model} ({activeDevice?.storage})
                </p>
                <p className="font-mono text-[11px] text-slate-500">
                  ID: {activeDevice?.id} • IMEI: {activeDevice?.imei1}
                </p>
              </div>
            </div>
            <Badge variant="danger" size="sm">
              Failed QC
            </Badge>
          </div>

          {/* Issue Description */}
          <div>
            <label className="font-semibold block mb-1">Diagnosed Defect &amp; Problem Description *</label>
            <textarea
              value={repairProblemReason}
              onChange={(e) => setRepairProblemReason(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              placeholder="e.g. Display oleophobic scuff / Battery capacity below 80% / Face ID dot projector failure..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Assign Hardware Specialist *</label>
              <select
                value={repairTechnician}
                onChange={(e) => setRepairTechnician(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="Karan Johar (Senior Hardware Specialist)">Karan Johar (Senior Hardware Specialist)</option>
                <option value="Sunil Verma (Battery & Port Technician)">Sunil Verma (Battery &amp; Port Technician)</option>
                <option value="Rohan Mehta (Display & Touch Specialist)">Rohan Mehta (Display &amp; Touch Specialist)</option>
                <option value="Anand Deshmukh (Logic Board Engineer)">Anand Deshmukh (Logic Board Engineer)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1">Estimated Servicing Cost (₹)</label>
              <Input
                type="number"
                value={repairCostEst}
                onChange={(e) => setRepairCostEst(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="p-3 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-amber-800 dark:text-amber-300 text-[11px] flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
            <span>
              This will assign job card to the technician, mark handset status as &quot;Under Repair&quot;, and forward it to the Repairs Bay dashboard.
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRouteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={confirmRouteToRepair}
              className="gap-1.5"
            >
              <Wrench className="h-3.5 w-3.5" />
              <span>Confirm &amp; Route to Repairs Bay</span>
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Thermal Barcode Sticker Modal */}
      <ThermalStickerModal
        devices={activeDevice ? [activeDevice] : []}
        isOpen={isStickerOpen}
        onClose={() => setIsStickerOpen(false)}
      />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  Wrench,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Smartphone,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { RepairJob, Device } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { formatINR, formatDate } from "@/lib/utils";

export default function RepairsPage() {
  const { repairs, addRepairJob, updateRepairJob, devices, spareParts, updateSparePartStock, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isNewJobOpen, setIsNewJobOpen] = useState(false);

  // Form State
  const [deviceId, setDeviceId] = useState(devices[0]?.id || "TFD-2026-9044");
  const [technicianName, setTechnicianName] = useState("Karan Johar (Senior Engineer)");
  const [problemDescription, setProblemDescription] = useState("Battery health degraded below 85% threshold, requires genuine OEM replacement cell.");
  const [partsInput, setPartsInput] = useState("OEM Battery 3227mAh, Waterproof Gasket");
  const [repairCost, setRepairCost] = useState(2800);
  const [status, setStatus] = useState<RepairJob["status"]>("In Progress");

  // Handsets flagged as Under Repair in Inventory awaiting a repair job card
  const underRepairDevicesWithoutJob = devices.filter(
    (d) => d.status === "Under Repair" && !repairs.some((r) => r.deviceId === d.id)
  );

  const filteredRepairs = repairs.filter((rep) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      rep.id.toLowerCase().includes(q) ||
      rep.deviceModel.toLowerCase().includes(q) ||
      rep.imei.includes(q) ||
      rep.technicianName.toLowerCase().includes(q) ||
      rep.problemDescription.toLowerCase().includes(q);

    const matchesStatus = statusFilter === "all" || rep.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleQuickInitJob = (dev: Device) => {
    addRepairJob({
      deviceId: dev.id,
      deviceModel: `${dev.brand} ${dev.model} (${dev.storage})`,
      imei: dev.imei1,
      technicianName: "Karan Johar (Senior Hardware Specialist)",
      problemDescription: dev.qcInspection?.notes || "Flagged in Quality Check diagnostics for hardware refurbishment.",
      partsReplaced: [],
      repairCost: 2200,
      status: "In Progress",
      startDate: new Date().toISOString().split("T")[0],
    });
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    const dev = devices.find((d) => d.id === deviceId);
    const partsArray = partsInput.split(",").map((p) => p.trim()).filter(Boolean);

    // Deduct stock for any matching spare parts
    partsArray.forEach((partName) => {
      const match = spareParts.find((sp) => sp.name.toLowerCase() === partName.toLowerCase());
      if (match) {
        updateSparePartStock(match.id, -1);
      }
    });

    addRepairJob({
      deviceId,
      deviceModel: dev ? `${dev.brand} ${dev.model} ${dev.storage}` : "Smartphone",
      imei: dev ? dev.imei1 : "359182049182041",
      technicianName,
      problemDescription,
      partsReplaced: partsArray,
      repairCost: Number(repairCost),
      status,
      startDate: new Date().toISOString().split("T")[0],
    });
    setIsNewJobOpen(false);
  };

  const handleQuickStatusUpdate = (id: string, newStatus: RepairJob["status"]) => {
    updateRepairJob(id, { status: newStatus });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Hardware Repairs & Servicing</span>
            <Badge variant="purple" size="sm">
              Bay Control
            </Badge>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Component replacement tracking, display refurbishing, battery calibration, and technician accountability.
          </p>
        </div>

        <Button
          variant="fundu"
          size="sm"
          onClick={() => setIsNewJobOpen(true)}
          className="gap-1.5 shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Repair Job Card</span>
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-medium text-slate-400">Total Active Jobs</span>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {repairs.filter((r) => r.status !== "Quality Passed").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-medium text-slate-400">In Progress</span>
            <p className="text-xl font-bold text-purple-600 mt-1">
              {repairs.filter((r) => r.status === "In Progress").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-medium text-slate-400">Awaiting Parts</span>
            <p className="text-xl font-bold text-amber-600 mt-1">
              {repairs.filter((r) => r.status === "Awaiting Parts").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-medium text-slate-400">Total Spend on Parts</span>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {formatINR(repairs.reduce((acc, r) => acc + r.repairCost, 0))}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* QC Intake Queue: Handsets under repair awaiting active job card */}
      {underRepairDevicesWithoutJob.length > 0 && (
        <Card className="border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-purple-950 dark:text-purple-200 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-purple-600" />
                <span>
                  QC Intake: {underRepairDevicesWithoutJob.length} Handset(s) Routed for Servicing
                </span>
              </CardTitle>
              <Badge variant="purple" size="sm">
                Action Required
              </Badge>
            </div>
            <CardDescription className="text-xs">
              These handsets failed Quality Check diagnostics and have been marked for hardware servicing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {underRepairDevicesWithoutJob.map((dev) => (
              <div
                key={dev.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {dev.brand} {dev.model} ({dev.storage}, {dev.colour})
                    </span>
                    <Badge variant="danger" size="sm">
                      Needs Servicing
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    ID: {dev.id} • IMEI: {dev.imei1} • Store: {dev.warehouse}
                  </p>
                  {dev.qcInspection?.notes && (
                    <p className="text-[11px] text-purple-700 dark:text-purple-300 italic mt-0.5">
                      QC Finding: {dev.qcInspection.notes}
                    </p>
                  )}
                </div>

                <Button
                  variant="fundu"
                  size="sm"
                  onClick={() => handleQuickInitJob(dev)}
                  className="gap-1.5 text-xs h-8 shrink-0 shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Initialize Job Card</span>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search by job ID, technician, model, IMEI..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-medium">Job Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Awaiting Parts">Awaiting Parts</option>
              <option value="Completed">Completed</option>
              <option value="Quality Passed">Quality Passed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Repair Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRepairs.map((job) => (
          <Card key={job.id} className="hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {job.id}
                  </span>
                  <Badge variant="purple" size="sm">
                    {job.status}
                  </Badge>
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {job.deviceModel}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  IMEI: {job.imei}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400">Repair Cost</span>
                <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {formatINR(job.repairCost)}
                </p>
              </div>
            </CardHeader>

            <CardContent className="pt-3 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Issue Diagnosed:</span>
                <p className="text-slate-700 dark:text-slate-300 mt-0.5">
                  {job.problemDescription}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Parts Replaced / Installed:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {job.partsReplaced?.map((part, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                    >
                      {part}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-500">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>Tech: {job.technicianName}</span>
                </span>
                <span>Started: {formatDate(job.startDate)}</span>
              </div>

              {/* Quick Status Advance Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1">
                {job.status !== "Quality Passed" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickStatusUpdate(job.id, "Quality Passed")}
                    className="h-7 text-xs text-emerald-600 hover:bg-emerald-50"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Mark Quality Passed
                  </Button>
                )}
                {job.status === "Pending" && (
                  <Button
                    variant="fundu"
                    size="sm"
                    onClick={() => handleQuickStatusUpdate(job.id, "In Progress")}
                    className="h-7 text-xs"
                  >
                    Start Work
                  </Button>
                )}
                {job.status === "In Progress" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleQuickStatusUpdate(job.id, "Awaiting Parts")}
                    className="h-7 text-xs"
                  >
                    Hold for Parts
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Job Modal */}
      <Dialog
        isOpen={isNewJobOpen}
        onClose={() => setIsNewJobOpen(false)}
        title="Open Hardware Repair Job Card"
        description="Assign defective or QC-flagged smartphone to technician"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1">Select Device from Inventory *</label>
            <select
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.id} — {d.brand} {d.model} ({d.storage}, IMEI: {d.imei1})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold block mb-1">Technician / Engineer *</label>
            <Input
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Problem Description *</label>
            <Input
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Select from Spare Parts Inventory (Auto-deducts Stock)</label>
            <select
              onChange={(e) => {
                const part = spareParts.find((p) => p.id === e.target.value);
                if (part) {
                  setPartsInput(part.name);
                  setRepairCost(part.unitCost);
                  showToast(`Selected ${part.name} (Stock: ${part.stockQuantity} units)`, "info");
                }
              }}
              defaultValue=""
              className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="">-- Choose Spare Part from Repair Bay --</option>
              {spareParts.map((sp) => (
                <option key={sp.id} value={sp.id}>
                  {sp.name} — Qty: {sp.stockQuantity} (Cost: ₹{sp.unitCost})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Parts Required (comma-separated)</label>
              <Input
                value={partsInput}
                onChange={(e) => setPartsInput(e.target.value)}
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Estimated Parts Cost (₹) *</label>
              <Input
                type="number"
                value={repairCost}
                onChange={(e) => setRepairCost(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Initial Job Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Awaiting Parts">Awaiting Parts</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsNewJobOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="fundu" size="sm">
              Generate Job Card
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

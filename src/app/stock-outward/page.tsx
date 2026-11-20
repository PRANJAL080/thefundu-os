"use client";

import React, { useState } from "react";
import {
  ArrowUpFromLine,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Building2,
  User,
  Smartphone,
  AlertOctagon,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { StockMovement, WarehouseLocation } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { formatINR, formatDate } from "@/lib/utils";

export default function StockOutwardPage() {
  const { stockMovements, addStockMovement, warehouses, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // Form State
  const [reason, setReason] = useState<StockMovement["reason"]>("Sold");
  const [deviceModel, setDeviceModel] = useState("");
  const [imei, setImei] = useState("");
  const [fromLocation, setFromLocation] = useState<WarehouseLocation>("Lucknow Store (LKO-01)");
  const [toLocation, setToLocation] = useState("");
  const [value, setValue] = useState(0);
  const [notes, setNotes] = useState("");

  const outwardMovements = stockMovements.filter((m) => {
    if (m.type !== "Outward") return false;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      m.id.toLowerCase().includes(q) ||
      m.deviceModel.toLowerCase().includes(q) ||
      m.imei.includes(q) ||
      m.fromLocation.toLowerCase().includes(q) ||
      m.toLocation.toLowerCase().includes(q);

    const matchesReason = reasonFilter === "all" || m.reason === reasonFilter;
    return matchesSearch && matchesReason;
  });

  const handleRecordOutward = (e: React.FormEvent) => {
    e.preventDefault();
    addStockMovement({
      type: "Outward",
      reason,
      deviceModel,
      imei,
      fromLocation,
      toLocation,
      quantity: 1,
      value: Number(value),
      initiatedBy: "Fulfillment Desk",
      notes,
    });
    showToast(`Stock Outward logged: ${deviceModel}`, "info");
    setIsRecordModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Stock Outward Registry</span>
            <Badge variant="warning" size="sm">
              Outflow Track
            </Badge>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log dispatch transactions: customer shipments, supplier returns, regional warehouse dispatches, and damaged write-offs.
          </p>
        </div>

        <Button
          variant="fundu"
          size="sm"
          onClick={() => setIsRecordModalOpen(true)}
          className="gap-1.5 shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Record Outward Dispatch</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search by Movement ID, IMEI, device, destination..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-medium">Outward Reason:</span>
            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="all">All Outward Types</option>
              <option value="Sold">Sold (Customer Dispatch)</option>
              <option value="Supplier Return">Supplier Return (RTV Defect)</option>
              <option value="Warehouse Transfer Dispatched">Warehouse Transfer Dispatched</option>
              <option value="Damaged Write-off">Damaged Write-off (Scrap)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Outward Movement Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-3">Tx ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Outward Reason</th>
                <th className="p-3">Device & IMEI</th>
                <th className="p-3">From Warehouse</th>
                <th className="p-3">To Destination / Recipient</th>
                <th className="p-3 text-right">Value (₹)</th>
                <th className="p-3">Initiated By</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {outwardMovements.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No outward stock movements recorded yet.
                  </td>
                </tr>
              ) : (
                outwardMovements.map((m) => (
                <tr
                  key={m.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {m.id}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">
                    {m.date}
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={
                        m.reason === "Sold"
                          ? "info"
                          : m.reason === "Damaged Write-off"
                          ? "danger"
                          : "purple"
                      }
                      size="sm"
                    >
                      {m.reason}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {m.deviceModel}
                    </p>
                    <p className="font-mono text-[10px] text-slate-400">
                      IMEI: {m.imei}
                    </p>
                  </td>
                  <td className="p-3 font-medium text-slate-800 dark:text-slate-200">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-slate-400" />
                      <span>{m.fromLocation}</span>
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">
                    {m.toLocation}
                  </td>
                  <td className="p-3 text-right font-bold text-slate-900 dark:text-slate-100">
                    {formatINR(m.value)}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">
                    {m.initiatedBy}
                  </td>
                  <td className="p-3 text-slate-400 text-[11px] truncate max-w-xs">
                    {m.notes || "-"}
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Record Outward Modal */}
      <Dialog
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record Stock Outward Transaction"
        description="Dispatch inventory out of warehouse for customer orders, transfers or returns"
        maxWidth="lg"
      >
        <form onSubmit={handleRecordOutward} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1">Outward Reason *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as any)}
              className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="Sold">Sold (Customer Dispatch Fulfillment)</option>
              <option value="Supplier Return">Supplier Return (RTV Defect Return)</option>
              <option value="Warehouse Transfer Dispatched">Warehouse Transfer Dispatched</option>
              <option value="Damaged Write-off">Damaged Write-off (Harvest Parts / Scrap)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Device Model *</label>
              <Input
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">IMEI *</label>
              <Input
                className="font-mono"
                value={imei}
                onChange={(e) => setImei(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Origin Warehouse *</label>
              <select
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value as any)}
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
              <label className="font-semibold block mb-1">Destination / Customer / Logistics *</label>
              <Input
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Transaction Value (₹) *</label>
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Dispatch Waybill / Courier Notes</label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRecordModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="fundu" size="sm">
              Confirm Outward Dispatch
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

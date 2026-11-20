"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  Eye,
  FileText,
  DollarSign,
  Truck,
  CheckCircle2,
  Clock,
  Building2,
  Calendar,
  X,
  ExternalLink,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { PurchaseOrder, DeviceGrade, WarehouseLocation } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { formatINR, formatDate } from "@/lib/utils";

export default function PurchasesPage() {
  const { purchases, addPurchase, suppliers, warehouses, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Invoice Preview Modal
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // New Purchase Modal
  const [isNewPOOpen, setIsNewPOOpen] = useState(false);
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || "SUP-001");
  const [warehouse, setWarehouse] = useState<WarehouseLocation>("Mumbai Central Hub");
  const [itemsCount, setItemsCount] = useState(10);
  const [totalAmount, setTotalAmount] = useState(450000);
  const [notes, setNotes] = useState("");

  const filteredPurchases = purchases.filter((po) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      po.id.toLowerCase().includes(q) ||
      po.supplierName.toLowerCase().includes(q) ||
      po.invoiceNumber.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || po.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find((s) => s.id === supplierId);
    addPurchase({
      supplierId,
      supplierName: sup?.name || "Supplier",
      supplierContact: sup?.phone || "+91 98000 00000",
      supplierGst: sup?.gstNumber || "27AABCE1234F1Z8",
      itemsCount: Number(itemsCount),
      totalAmount: Number(totalAmount),
      paymentStatus: "Paid",
      amountPaid: Number(totalAmount),
      balanceDue: 0,
      warehouse,
      notes,
    });
    setIsNewPOOpen(false);
  };

  const openInvoice = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setIsInvoiceOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Purchase Management</span>
            <Badge variant="secondary" size="sm">
              {purchases.length} Consignments
            </Badge>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Procurement orders, vendor invoices, bulk intake consignments, and supplier settlements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="fundu"
            size="sm"
            onClick={() => setIsNewPOOpen(true)}
            className="gap-1.5 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Purchase Order</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search PO number, supplier, invoice..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-medium">Payment Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="all">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Purchases Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-3">PO Number</th>
                <th className="p-3">Supplier Name</th>
                <th className="p-3">Order Date</th>
                <th className="p-3 text-center">Units</th>
                <th className="p-3">Warehouse Hub</th>
                <th className="p-3 text-right">Total Amount</th>
                <th className="p-3 text-right">Balance Due</th>
                <th className="p-3 text-center">Payment Status</th>
                <th className="p-3 text-center">Invoice Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No purchase orders found. Click &quot;New Purchase Order&quot; to inward a consignment lot.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((po) => (
                <tr
                  key={po.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {po.id}
                  </td>
                  <td className="p-3">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {po.supplierName}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      GST: {po.supplierGst || "N/A"}
                    </p>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">
                    {formatDate(po.date)}
                  </td>
                  <td className="p-3 text-center font-bold">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {po.itemsCount} phones
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-slate-400" />
                      <span>{po.warehouse}</span>
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold text-slate-900 dark:text-slate-100">
                    {formatINR(po.totalAmount)}
                  </td>
                  <td className="p-3 text-right font-medium">
                    {po.balanceDue > 0 ? (
                      <span className="text-amber-600 font-semibold">
                        {formatINR(po.balanceDue)}
                      </span>
                    ) : (
                      <span className="text-emerald-600">₹0</span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <Badge
                      variant={
                        po.paymentStatus === "Paid"
                          ? "success"
                          : po.paymentStatus === "Partial"
                          ? "warning"
                          : "danger"
                      }
                      size="sm"
                    >
                      {po.paymentStatus}
                    </Badge>
                  </td>
                  <td className="p-3 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openInvoice(po)}
                      className="h-7 text-xs px-2 gap-1"
                    >
                      <FileText className="h-3 w-3" />
                      <span>Invoice</span>
                    </Button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invoice Preview Modal */}
      {selectedPO && (
        <Dialog
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          title={`Purchase Invoice — ${selectedPO.invoiceNumber}`}
          description={`Consignment Order ${selectedPO.id}`}
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs text-slate-700 dark:text-slate-300">
            {/* Header branding */}
            <div className="flex justify-between items-start pb-4 border-b">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  ESTERLINE BONAPARTE CORPORATION PRIVATE LIMITED
                </h3>
                <p className="text-[11px] text-slate-500">
                  TheFundu Refurbished Mobile Operating HQ, Mumbai, India
                </p>
                <p className="text-[11px] text-slate-500">GSTIN: 27AAACE4419E1ZP</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-fundu-600">INVOICE PREVIEW</span>
                <p className="font-mono text-xs">{selectedPO.invoiceNumber}</p>
                <p className="text-[11px] text-slate-400">Date: {formatDate(selectedPO.date)}</p>
              </div>
            </div>

            {/* Vendor details */}
            <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Supplier:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedPO.supplierName}
                </p>
                <p className="text-[11px] text-slate-500">Contact: {selectedPO.supplierContact}</p>
                <p className="text-[11px] text-slate-500">GST: {selectedPO.supplierGst}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Delivery Warehouse:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedPO.warehouse}
                </p>
                <p className="text-[11px] text-slate-500">Payment Status: {selectedPO.paymentStatus}</p>
              </div>
            </div>

            {/* Line items */}
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200 mb-2">
                Consignment Smartphone Items
              </p>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 dark:bg-slate-800 font-semibold">
                    <tr>
                      <th className="p-2">Model Description</th>
                      <th className="p-2">IMEI</th>
                      <th className="p-2 text-center">Grade</th>
                      <th className="p-2 text-right">Unit Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedPO.devices?.map((dev, i) => (
                      <tr key={i}>
                        <td className="p-2 font-medium">{dev.model}</td>
                        <td className="p-2 font-mono">{dev.imei}</td>
                        <td className="p-2 text-center font-bold">Grade {dev.grade}</td>
                        <td className="p-2 text-right font-semibold">{formatINR(dev.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end pt-2">
              <div className="w-56 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Units:</span>
                  <span className="font-semibold">{selectedPO.itemsCount} Handsets</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal:</span>
                  <span className="font-semibold">{formatINR(selectedPO.totalAmount)}</span>
                </div>
                <div className="flex justify-between border-t pt-1 font-bold text-sm text-slate-900 dark:text-slate-100">
                  <span>Grand Total:</span>
                  <span className="text-fundu-600 dark:text-fundu-400">
                    {formatINR(selectedPO.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={() => setIsInvoiceOpen(false)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* New Purchase Order Modal */}
      <Dialog
        isOpen={isNewPOOpen}
        onClose={() => setIsNewPOOpen(false)}
        title="Create New Bulk Purchase Order"
        description="Register inward consignment lot from verified suppliers"
        maxWidth="lg"
      >
        <form onSubmit={handleCreatePO} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold block mb-1">Select Supplier *</label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.company})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Consignment Units *</label>
              <Input
                type="number"
                min={1}
                value={itemsCount}
                onChange={(e) => setItemsCount(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Total PO Amount (₹) *</label>
              <Input
                type="number"
                min={1000}
                value={totalAmount}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Destination Warehouse *</label>
            <select
              value={warehouse}
              onChange={(e) => setWarehouse(e.target.value as WarehouseLocation)}
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
            <label className="font-semibold block mb-1">Procurement Notes</label>
            <Input
              placeholder="e.g. Lot of iPhone 14/15 series Grade A from Dubai"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsNewPOOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="fundu" size="sm">
              Record Purchase Order
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

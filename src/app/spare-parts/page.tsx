"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Wrench,
  Cpu,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Package,
  Layers,
  ArrowUpDown,
  Smartphone,
  Store,
  DollarSign,
  TrendingDown,
  X,
  History,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { SparePart } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { formatINR, formatDate } from "@/lib/utils";

export default function SparePartsPage() {
  const { spareParts, addSparePart, updateSparePartStock, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  // Add Part Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPartName, setNewPartName] = useState("");
  const [newPartNumber, setNewPartNumber] = useState("");
  const [newCategory, setNewCategory] = useState<SparePart["category"]>("Display");
  const [newCompatible, setNewCompatible] = useState("iPhone 15 Pro, iPhone 15 Pro Max");
  const [newQty, setNewQty] = useState(5);
  const [newMinReorder, setNewMinReorder] = useState(3);
  const [newUnitCost, setNewUnitCost] = useState(4500);
  const [newSellingPrice, setNewSellingPrice] = useState(7500);

  // Quick Restock Modal
  const [restockPart, setRestockPart] = useState<SparePart | null>(null);
  const [restockDelta, setRestockDelta] = useState(5);

  // Filtered Parts
  const filteredParts = useMemo(() => {
    return spareParts.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.partNumber.toLowerCase().includes(q) ||
        p.compatibleModels.some((m) => m.toLowerCase().includes(q));

      const matchesCat = categoryFilter === "all" || p.category === categoryFilter;
      const matchesLowStock = !onlyLowStock || p.stockQuantity <= p.minReorderLevel;

      return matchesSearch && matchesCat && matchesLowStock;
    });
  }, [spareParts, searchQuery, categoryFilter, onlyLowStock]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalUnits = spareParts.reduce((acc, p) => acc + p.stockQuantity, 0);
    const lowStockCount = spareParts.filter((p) => p.stockQuantity <= p.minReorderLevel).length;
    const totalValuation = spareParts.reduce((acc, p) => acc + p.stockQuantity * p.unitCost, 0);
    return { totalUnits, lowStockCount, totalValuation };
  }, [spareParts]);

  const handleCreatePart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartName.trim()) return;

    addSparePart({
      name: newPartName,
      partNumber: newPartNumber || `PART-LKO-${Date.now().toString().slice(-4)}`,
      category: newCategory,
      compatibleModels: newCompatible.split(",").map((s) => s.trim()).filter(Boolean),
      stockQuantity: Number(newQty),
      minReorderLevel: Number(newMinReorder),
      unitCost: Number(newUnitCost),
      sellingPrice: Number(newSellingPrice),
      supplierName: "Shenzhen Precision Parts Ltd / Delhi OEM Hub",
      storeLocation: "Lucknow Store (LKO-01)",
      lastRestockedDate: new Date().toISOString().split("T")[0],
    });

    showToast(`Added spare part ${newPartName} to Repair Bay stock!`, "success");
    setIsAddModalOpen(false);
    setNewPartName("");
  };

  const handleRestockSubmit = () => {
    if (!restockPart) return;
    updateSparePartStock(restockPart.id, restockDelta);
    showToast(`Restocked ${restockDelta} units of ${restockPart.name}!`, "success");
    setRestockPart(null);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Cpu className="h-6 w-6 text-fundu-600" />
              <span>Technician Spare Parts &amp; Components Desk</span>
            </h1>
            <Badge variant="fundu" size="sm">
              Repair Bay Stock
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time component ledger for OEM displays, batteries, cameras, and ICs. Amortizes part cost directly into device landed cost.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="fundu"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="gap-1.5 shadow-sm font-semibold"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Spare Part</span>
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 font-semibold uppercase">Total SKUs in Catalog</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
            {spareParts.length} Parts
          </p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 font-semibold uppercase">Total Physical Units</p>
          <p className="text-2xl font-bold text-fundu-600 dark:text-fundu-400 mt-1 font-mono">
            {metrics.totalUnits} Units
          </p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 font-semibold uppercase">Low Stock Alerts (&lt; 3)</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-2xl font-bold text-amber-600 font-mono">
              {metrics.lowStockCount} Items
            </p>
            {metrics.lowStockCount > 0 && (
              <Badge variant="warning" size="sm" className="text-[10px]">
                Reorder Needed
              </Badge>
            )}
          </div>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 font-semibold uppercase">Total Inventory Value</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            {formatINR(metrics.totalValuation)}
          </p>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search component, model or part no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs dark:border-slate-800 dark:bg-slate-900"
            >
              <option value="all">All Categories</option>
              <option value="Display">Displays / Screens</option>
              <option value="Battery">Batteries (OEM)</option>
              <option value="Camera">Camera Modules</option>
              <option value="Housing">Housing / Back Glass</option>
              <option value="Charging Port">Charging Ports</option>
              <option value="Speaker/Mic">Speakers &amp; Mics</option>
              <option value="Motherboard IC">Motherboard ICs</option>
            </select>

            <Button
              variant={onlyLowStock ? "fundu" : "outline"}
              size="sm"
              onClick={() => setOnlyLowStock(!onlyLowStock)}
              className="gap-1.5 h-9 text-xs whitespace-nowrap"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Low Stock Alerts Only</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Parts Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Component / Part Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Compatible Handsets</th>
                <th className="p-3 text-center">Stock Level</th>
                <th className="p-3 text-right">Unit Cost</th>
                <th className="p-3 text-right">Selling Price</th>
                <th className="p-3">Store Bay</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredParts.map((part) => {
                const isLow = part.stockQuantity <= part.minReorderLevel;
                return (
                  <tr
                    key={part.id}
                    className={`hover:bg-slate-50/60 dark:hover:bg-slate-900/60 transition-colors ${
                      isLow ? "bg-amber-50/20 dark:bg-amber-950/10" : ""
                    }`}
                  >
                    <td className="p-3">
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        {part.name}
                      </p>
                      <p className="font-mono text-[10px] text-slate-400">
                        Part No: {part.partNumber}
                      </p>
                    </td>

                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {part.category}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {part.compatibleModels.map((m, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 rounded bg-fundu-50 dark:bg-fundu-950/60 text-fundu-700 dark:text-fundu-300 text-[10px] font-medium"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-3 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <span
                          className={`font-mono font-bold text-sm ${
                            isLow ? "text-rose-600 dark:text-rose-400" : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {part.stockQuantity}
                        </span>
                        <span className="text-[10px] text-slate-400">units</span>
                      </div>
                      {isLow && (
                        <span className="block text-[9px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded px-1 py-0.2 mt-0.5">
                          Low Stock (&lt; {part.minReorderLevel})
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right font-mono font-medium text-slate-600 dark:text-slate-300">
                      {formatINR(part.unitCost)}
                    </td>

                    <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                      {formatINR(part.sellingPrice)}
                    </td>

                    <td className="p-3 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {part.storeLocation}
                      </span>
                    </td>

                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setRestockPart(part);
                            setRestockDelta(5);
                          }}
                          className="h-7 px-2 text-[11px] font-medium"
                        >
                          Restock
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            updateSparePartStock(part.id, -1);
                            showToast(`Used 1 unit of ${part.name} for repair!`, "info");
                          }}
                          disabled={part.stockQuantity <= 0}
                          className="h-7 px-2 text-[11px] text-rose-600 hover:bg-rose-50"
                        >
                          Use (-1)
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Part Modal */}
      <Dialog isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} maxWidth="md">
        <form onSubmit={handleCreatePart} className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Add New Spare Part / Component
            </h3>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold block mb-1">Part Name *</label>
              <Input
                required
                placeholder="e.g. OEM Battery 3227mAh for iPhone 13"
                value={newPartName}
                onChange={(e) => setNewPartName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs dark:border-slate-800 dark:bg-slate-900"
                >
                  <option value="Display">Display</option>
                  <option value="Battery">Battery</option>
                  <option value="Camera">Camera</option>
                  <option value="Housing">Housing</option>
                  <option value="Charging Port">Charging Port</option>
                  <option value="Speaker/Mic">Speaker/Mic</option>
                  <option value="Motherboard IC">Motherboard IC</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Part Number</label>
                <Input
                  placeholder="e.g. BAT-IP13-OEM"
                  value={newPartNumber}
                  onChange={(e) => setNewPartNumber(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1">Compatible Models (Comma Separated)</label>
              <Input
                value={newCompatible}
                onChange={(e) => setNewCompatible(e.target.value)}
                placeholder="iPhone 13, iPhone 13 Pro"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Initial Quantity</label>
                <Input
                  type="number"
                  value={newQty}
                  onChange={(e) => setNewQty(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Min Reorder Level</label>
                <Input
                  type="number"
                  value={newMinReorder}
                  onChange={(e) => setNewMinReorder(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Unit Purchase Cost (₹)</label>
                <Input
                  type="number"
                  value={newUnitCost}
                  onChange={(e) => setNewUnitCost(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Customer Selling / Billing Price (₹)</label>
                <Input
                  type="number"
                  value={newSellingPrice}
                  onChange={(e) => setNewSellingPrice(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="fundu" size="sm" className="font-bold">
              Save Spare Part
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Restock Quantity Modal */}
      {restockPart && (
        <Dialog isOpen={Boolean(restockPart)} onClose={() => setRestockPart(null)} maxWidth="sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Restock Component
              </h3>
              <button onClick={() => setRestockPart(null)} className="text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {restockPart.name}
              </p>
              <p className="text-slate-500">
                Current Stock: <strong className="text-slate-800">{restockPart.stockQuantity} units</strong>
              </p>
              <div>
                <label className="font-semibold block mb-1">Units to Add</label>
                <Input
                  type="number"
                  value={restockDelta}
                  onChange={(e) => setRestockDelta(Number(e.target.value))}
                  className="h-9 font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setRestockPart(null)}>
                Cancel
              </Button>
              <Button variant="fundu" size="sm" onClick={handleRestockSubmit}>
                Confirm Restock (+{restockDelta})
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}

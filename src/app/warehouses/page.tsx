"use client";

import React, { useState } from "react";
import {
  Store,
  Boxes,
  ArrowRightLeft,
  Search,
  User,
  Phone,
  MapPin,
  TrendingUp,
  Wrench,
  CheckCheck,
  Plus,
  Building2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Edit2,
  Save,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Warehouse, WarehouseLocation } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { formatINR } from "@/lib/utils";

export default function StoresPage() {
  const { warehouses, devices, transferWarehouseStock, stockMovements, addStore, updateStore, showToast } = useApp();

  // Add Store Modal State
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [newStoreCode, setNewStoreCode] = useState("");
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreCity, setNewStoreCity] = useState("Lucknow");
  const [newStoreLocation, setNewStoreLocation] = useState("");
  const [newStoreAddress, setNewStoreAddress] = useState("");
  const [newStoreManager, setNewStoreManager] = useState("");
  const [newStorePhone, setNewStorePhone] = useState("");
  const [newStoreCapacity, setNewStoreCapacity] = useState(1500);

  // Edit Store Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingWh, setEditingWh] = useState<Warehouse | null>(null);
  const [editCode, setEditCode] = useState("");
  const [editName, setEditName] = useState("");
  const [editCity, setEditCity] = useState("Lucknow");
  const [editAddress, setEditAddress] = useState("");
  const [editManager, setEditManager] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCapacity, setEditCapacity] = useState(1500);

  const handleOpenEdit = (wh: Warehouse) => {
    setEditingWh(wh);
    setEditCode(wh.code);
    setEditName(wh.name);
    setEditCity(wh.city || wh.location || "Lucknow");
    setEditAddress(wh.address);
    setEditManager(wh.managerName);
    setEditPhone((wh as any).managerPhone || (wh as any).phone || "+91 79919 90508");
    setEditCapacity(wh.totalCapacity || 1500);
    setIsEditOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWh) return;
    updateStore(editingWh.id, {
      code: editCode.toUpperCase().trim(),
      name: editName.trim(),
      city: editCity.trim(),
      location: editCity.trim(),
      address: editAddress.trim(),
      managerName: editManager.trim(),
      managerPhone: editPhone.trim(),
      totalCapacity: editCapacity,
    });
    setIsEditOpen(false);
    setEditingWh(null);
    showToast(`Store outlet ${editCode} updated successfully!`, "success");
  };

  // Transfer Modal State
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(devices[0]?.id || "");
  const [targetStore, setTargetStore] = useState<string>(warehouses[0]?.name || "Lucknow Store (LKO-01)");
  const [transferNotes, setTransferNotes] = useState("Inter-store stock balancing");

  const handleCreateStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreCode.trim() || !newStoreName.trim()) {
      showToast("Store Code and Store Name are required!", "error");
      return;
    }

    addStore({
      code: newStoreCode.toUpperCase().trim(),
      name: newStoreName.trim(),
      city: newStoreCity.trim(),
      location: newStoreLocation.trim() || `${newStoreCity} Store`,
      address: newStoreAddress.trim() || `${newStoreCity}, Uttar Pradesh`,
      managerName: newStoreManager.trim() || "Store Manager",
      managerPhone: newStorePhone.trim() || "+91 98000 00000",
      totalCapacity: newStoreCapacity,
      status: "Active",
    });

    // Reset Form
    setNewStoreCode("");
    setNewStoreName("");
    setNewStoreLocation("");
    setNewStoreAddress("");
    setNewStoreManager("");
    setNewStorePhone("");
    setIsAddStoreOpen(false);
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeviceId) return;
    transferWarehouseStock(selectedDeviceId, targetStore, transferNotes);
    setIsTransferOpen(false);
  };

  const transfersHistory = stockMovements.filter(
    (m) =>
      m.reason === "Warehouse Transfer Received" ||
      m.reason === "Warehouse Transfer Dispatched"
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Store & Branch Network</span>
            <Badge variant="fundu" size="sm">
              {warehouses.length} {warehouses.length === 1 ? "Store Active" : "Stores Active"}
            </Badge>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your physical retail stores, store codes, branch inventory, and transfer handsets between locations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTransferOpen(true)}
            className="gap-1.5"
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            <span>Transfer Between Stores</span>
          </Button>

          <Button
            variant="fundu"
            size="sm"
            onClick={() => setIsAddStoreOpen(true)}
            className="gap-1.5 shadow-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add New Store / Branch</span>
          </Button>
        </div>
      </div>

      {/* Stores Network Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {warehouses.map((st) => {
          const storeDevices = devices.filter((d) => d.warehouse.includes(st.code) || d.warehouse === st.name);
          const storeStockValue = storeDevices.reduce((sum, d) => sum + d.costs.sellingPrice, 0);
          const capacityPercent = Math.min(100, Math.round((storeDevices.length / st.totalCapacity) * 100));

          return (
            <Card key={st.id} className="hover:border-slate-300 dark:hover:border-slate-700 transition-all border-2">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-xl bg-fundu-50 dark:bg-fundu-950/60 text-fundu-600 dark:text-fundu-400 flex items-center justify-center font-bold">
                      <Store className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <span>{st.name}</span>
                        <Badge variant="fundu" size="sm" className="font-mono text-[10px]">
                          {st.code}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        Location: {st.location || st.city || "Lucknow, Uttar Pradesh"}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-[10px] gap-1 text-fundu-700 dark:text-fundu-300 border-fundu-200 dark:border-fundu-800 hover:bg-fundu-50 font-semibold"
                      onClick={() => handleOpenEdit(st)}
                    >
                      <Edit2 className="h-2.5 w-2.5" />
                      <span>Edit</span>
                    </Button>
                    <Badge variant="success" size="sm">
                      Active Store
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4 text-xs">
                <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                  <MapPin className="h-4 w-4 text-fundu-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{st.address}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      Store Manager: {st.managerName}
                    </span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">{st.managerPhone}</span>
                </div>

                {/* Stock Stats Grid */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 border rounded-lg bg-white dark:bg-slate-900">
                    <span className="text-[10px] text-slate-400 block font-medium">Apple iPhones</span>
                    <span className="text-lg font-black text-slate-900 dark:text-slate-100">
                      {storeDevices.length}
                    </span>
                  </div>

                  <div className="p-2.5 border rounded-lg bg-white dark:bg-slate-900">
                    <span className="text-[10px] text-slate-400 block font-medium">Store Stock Value</span>
                    <span className="text-xs font-bold text-fundu-600 dark:text-fundu-400 mt-1 block">
                      {formatINR(storeStockValue)}
                    </span>
                  </div>

                  <div className="p-2.5 border rounded-lg bg-white dark:bg-slate-900">
                    <span className="text-[10px] text-slate-400 block font-medium">Shelf Capacity</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1 block">
                      {capacityPercent}% ({storeDevices.length}/{st.totalCapacity})
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Inter-Store Stock Movement Log */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-fundu-600" />
              <span>Inter-Store Stock Movement Log</span>
            </CardTitle>
            <Badge variant="secondary" size="sm">
              {transfersHistory.length} Movement Records
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {transfersHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400 font-medium border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Handset Model</th>
                    <th className="p-3">IMEI</th>
                    <th className="p-3">From Location</th>
                    <th className="p-3">To Destination</th>
                    <th className="p-3">Initiated By</th>
                    <th className="p-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {transfersHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                      <td className="p-3 text-slate-500 font-mono text-[11px]">{item.date}</td>
                      <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                        {item.deviceModel}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {item.imei}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{item.fromLocation}</td>
                      <td className="p-3 font-medium text-fundu-600 dark:text-fundu-400">
                        {item.toLocation}
                      </td>
                      <td className="p-3 text-slate-500">{item.initiatedBy}</td>
                      <td className="p-3 text-slate-400">{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 text-xs">
              All handsets are currently centralized at Lucknow Store (LKO-01). No inter-store transfers initiated yet.
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODAL: ADD NEW STORE / BRANCH */}
      <Dialog
        isOpen={isAddStoreOpen}
        onClose={() => setIsAddStoreOpen(false)}
        maxWidth="lg"
      >
        <form onSubmit={handleCreateStore} className="space-y-4 text-xs">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="h-9 w-9 rounded-lg bg-fundu-50 dark:bg-fundu-950 text-fundu-600 flex items-center justify-center font-bold">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Register New TheFundu Store / Branch
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create a new retail outlet location with custom store code (e.g. LKO-02, KNP-01, DEL-01).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Store Code (Unique) *</label>
              <Input
                placeholder="e.g. LKO-02, KNP-01, DEL-01"
                value={newStoreCode}
                onChange={(e) => setNewStoreCode(e.target.value)}
                className="font-mono uppercase font-bold"
                required
              />
              <p className="text-[10px] text-slate-400 mt-0.5">Short 6-character identifier</p>
            </div>

            <div>
              <label className="font-semibold block mb-1">Store Name *</label>
              <Input
                placeholder="e.g. TheFundu Hazratganj Store"
                value={newStoreName}
                onChange={(e) => setNewStoreName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">City *</label>
              <Input
                placeholder="e.g. Lucknow, Kanpur, Varanasi"
                value={newStoreCity}
                onChange={(e) => setNewStoreCity(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Area / Prime Location *</label>
              <Input
                placeholder="e.g. Hazratganj / Civil Lines / Mall Road"
                value={newStoreLocation}
                onChange={(e) => setNewStoreLocation(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Complete Store Address *</label>
            <Input
              placeholder="e.g. Shop No 4, Main Market, Hazratganj, Lucknow, UP 226001"
              value={newStoreAddress}
              onChange={(e) => setNewStoreAddress(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold block mb-1">Store Manager Name</label>
              <Input
                placeholder="e.g. Rohit Sharma"
                value={newStoreManager}
                onChange={(e) => setNewStoreManager(e.target.value)}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Manager Contact Number</label>
              <Input
                placeholder="+91 98390 00000"
                value={newStorePhone}
                onChange={(e) => setNewStorePhone(e.target.value)}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Storage Capacity (iPhones)</label>
              <Input
                type="number"
                value={newStoreCapacity}
                onChange={(e) => setNewStoreCapacity(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddStoreOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="fundu" size="sm" className="gap-1.5 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Create Store &amp; Activate</span>
            </Button>
          </div>
        </form>
      </Dialog>

      {/* MODAL: INTER-STORE TRANSFER */}
      <Dialog
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        maxWidth="md"
      >
        <form onSubmit={handleTransfer} className="space-y-4 text-xs">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-fundu-600" />
              <span>Transfer Handset Between Stores</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Shift iPhone stock from Lucknow Store to another branch.
            </p>
          </div>

          <div>
            <label className="font-semibold block mb-1">Select Apple iPhone *</label>
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.brand} {d.model} ({d.storage} • {d.colour}) - IMEI: {d.imei1} [{d.warehouse}]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold block mb-1">Target Destination Store *</label>
            <select
              value={targetStore}
              onChange={(e) => setTargetStore(e.target.value)}
              className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              {warehouses.map((w) => (
                <option key={w.id} value={w.name}>
                  {w.name} ({w.code}) - {w.location || w.city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold block mb-1">Transfer Reason / Dispatch Notes</label>
            <Input
              value={transferNotes}
              onChange={(e) => setTransferNotes(e.target.value)}
              placeholder="e.g. Customer walk-in request at new store"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsTransferOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="fundu" size="sm">
              Confirm Transfer
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Edit Store Modal */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Store Outlet"
        description="Update branch outlet name, store code, invoice address, and store manager details."
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Store Code *</label>
              <Input
                value={editCode}
                onChange={(e) => setEditCode(e.target.value)}
                placeholder="e.g. LKO-01"
                className="font-mono uppercase font-bold"
                required
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Store Outlet Name *</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g. Lucknow Store (LKO-01)"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">City / Region</label>
              <Input
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
                placeholder="Lucknow"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Shelf / Storage Capacity</label>
              <Input
                type="number"
                value={editCapacity}
                onChange={(e) => setEditCapacity(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Full Store Address (Printed on Invoices) *</label>
            <Input
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              placeholder="e.g. ED-476, Sector-Q, Aliganj, Lucknow, UP 226024"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Store Manager Name</label>
              <Input
                value={editManager}
                onChange={(e) => setEditManager(e.target.value)}
                placeholder="e.g. Abhay Verma"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Manager Contact Phone</label>
              <Input
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="+91 79919 90508"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="fundu" size="sm" className="gap-1.5 font-semibold">
              <Save className="h-3.5 w-3.5" />
              <span>Save Changes</span>
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

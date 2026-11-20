"use client";

import React, { useState, useEffect } from "react";
import {
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  Battery,
  Store,
  DollarSign,
  Tag,
  Hash,
  ShieldCheck,
  Calendar,
  Building2,
  Cpu,
  Layers,
  Image as ImageIcon,
  Sparkles,
  UploadCloud,
  Camera,
  Trash2,
  Plus,
  Check,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Device, DeviceStatus, WarehouseLocation, SMARTPHONE_BRANDS } from "@/lib/types";
import { useApp } from "@/lib/store";
import { formatINR, compressImage } from "@/lib/utils";

interface EditDeviceModalProps {
  device: Device | null;
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_BRANDS: readonly string[] = SMARTPHONE_BRANDS;

const STORAGE_OPTIONS = ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"];
const RAM_OPTIONS = ["3GB", "4GB", "6GB", "8GB", "12GB", "16GB"];
const STATUS_OPTIONS: DeviceStatus[] = [
  "In Stock",
  "Ready for Sale",
  "QC Pending",
  "Under Repair",
  "Reserved",
  "Sold",
  "Damaged",
  "Returned",
];

export function EditDeviceModal({ device, isOpen, onClose }: EditDeviceModalProps) {
  const { updateDevice, warehouses, currentUser, showToast } = useApp();

  // Form States
  const [deviceId, setDeviceId] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [storage, setStorage] = useState("128GB");
  const [ram, setRam] = useState("6GB");
  const [colour, setColour] = useState("");
  const [imei1, setImei1] = useState("");
  const [imei2, setImei2] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [sku, setSku] = useState("");
  const [batteryHealth, setBatteryHealth] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<DeviceStatus>("In Stock");
  const [warehouse, setWarehouse] = useState<WarehouseLocation>("");

  // Costs
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [repairCost, setRepairCost] = useState<number>(0);
  const [testingCost, setTestingCost] = useState<number>(0);
  const [packagingCost, setPackagingCost] = useState<number>(0);
  const [logisticsCost, setLogisticsCost] = useState<number>(0);
  const [otherCost, setOtherCost] = useState<number>(0);

  // Supplier & Specs & Photos
  const [supplierName, setSupplierName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const [chipset, setChipset] = useState("");
  const [screenSize, setScreenSize] = useState("");
  const [cameraSpecs, setCameraSpecs] = useState("");
  const [network, setNetwork] = useState("");
  const [osVersion, setOsVersion] = useState("");

  // Tab State inside Modal
  const [activeTab, setActiveTab] = useState<"general" | "pricing" | "specs" | "advanced">("general");

  // Load device into form when opened
  useEffect(() => {
    if (device && isOpen) {
      setDeviceId(device.id || "");
      setBrand(device.brand || "Apple");
      setModel(device.model || "");
      setStorage(device.storage || "128GB");
      setRam(device.ram || "6GB");
      setColour(device.colour || "");
      setImei1(device.imei1 || "");
      setImei2(device.imei2 || "");
      setSerialNumber(device.serialNumber || "");
      setSku(device.sku || "");
      setBatteryHealth(device.batteryHealth);
      setStatus(device.status || "In Stock");
      setWarehouse(device.warehouse || (warehouses[0]?.name ?? "Lucknow Store (LKO-01)"));

      setPurchasePrice(device.costs?.purchasePrice ?? device.purchasePrice ?? 0);
      setSellingPrice(device.costs?.sellingPrice ?? device.sellingPrice ?? 0);
      setRepairCost(device.costs?.repairCost || 0);
      setTestingCost(device.costs?.testingCost || 0);
      setPackagingCost(device.costs?.packagingCost || 0);
      setLogisticsCost(device.costs?.logisticsCost || 0);
      setOtherCost(device.costs?.otherCost || 0);

      setSupplierName(device.supplierName || "");
      setPurchaseDate(device.purchaseDate || new Date().toISOString().split("T")[0]);
      
      const loadedImages = device.images && device.images.length > 0 ? [...device.images] : [];
      setImages(loadedImages);
      setImageUrl(loadedImages[0] || "");

      setChipset(device.specifications?.chipset || "");
      setScreenSize(device.specifications?.screenSize || "");
      setCameraSpecs(device.specifications?.cameraSpecs || "");
      setNetwork(device.specifications?.network || "");
      setOsVersion(device.specifications?.osVersion || "");
    }
  }, [device, isOpen, warehouses]);

  // Image Upload Handlers
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const newImgs: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
          const compressedBase64 = await compressImage(file, 800, 0.75);
          newImgs.push(compressedBase64);
        }
      }
      if (newImgs.length > 0) {
        setImages((prev) => [...newImgs, ...prev]);
        setImageUrl(newImgs[0]);
        showToast(`${newImgs.length} handset photo(s) uploaded successfully!`, "success");
      }
    } catch (err) {
      showToast("Failed to upload image. Please try another file.", "error");
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrl.trim()) return;
    if (!images.includes(imageUrl.trim())) {
      setImages((prev) => [imageUrl.trim(), ...prev]);
      showToast("Photo link added successfully!", "info");
    }
    setShowUrlInput(false);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      if (indexToRemove === 0) {
        setImageUrl(updated[0] || "");
      }
      return updated;
    });
    showToast("Photo removed.", "info");
  };

  const handleSetPrimaryImage = (indexToPrimary: number) => {
    setImages((prev) => {
      const target = prev[indexToPrimary];
      const rest = prev.filter((_, idx) => idx !== indexToPrimary);
      const updated = [target, ...rest];
      setImageUrl(target);
      return updated;
    });
    showToast("Set as primary handset photo.", "info");
  };

  if (!device) return null;

  // Real-time calculations
  const totalLandedCost =
    Number(purchasePrice || 0) +
    Number(repairCost || 0) +
    Number(testingCost || 0) +
    Number(packagingCost || 0) +
    Number(logisticsCost || 0) +
    Number(otherCost || 0);

  const projectedProfit = Number(sellingPrice || 0) - totalLandedCost;
  const profitMarginPercent =
    sellingPrice > 0 ? Number(((projectedProfit / sellingPrice) * 100).toFixed(1)) : 0;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!deviceId.trim()) {
      showToast("Handset ID / Fun Code is required.", "error");
      return;
    }

    if (!imei1.trim()) {
      showToast("Primary IMEI 1 is required.", "error");
      return;
    }

    if (!model.trim()) {
      showToast("Model name is required.", "error");
      return;
    }

    const updatedCosts = {
      purchasePrice: Number(purchasePrice || 0),
      repairCost: Number(repairCost || 0),
      testingCost: Number(testingCost || 0),
      packagingCost: Number(packagingCost || 0),
      logisticsCost: Number(logisticsCost || 0),
      otherCost: Number(otherCost || 0),
      totalLandedCost,
      sellingPrice: Number(sellingPrice || 0),
      projectedProfit,
      profitMarginPercent,
    };

    const newActivity = {
      id: "ACT-" + Date.now(),
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      user: currentUser?.name || "Abhay Verma",
      action: "Device Info Updated",
      details: `Modified details: ${brand} ${model} (${storage}, ${colour}). Status: ${status}. Landed ₹${totalLandedCost.toLocaleString()}, Selling ₹${Number(sellingPrice).toLocaleString()}.`,
    };

    const finalImages = images.length > 0
      ? images
      : imageUrl.trim()
        ? [imageUrl.trim()]
        : (device.images || []);

    updateDevice(device.id, {
      id: deviceId.trim(),
      brand: brand.trim(),
      model: model.trim(),
      storage,
      ram,
      colour: colour.trim(),
      imei1: imei1.trim(),
      imei2: imei2.trim(),
      serialNumber: serialNumber.trim(),
      sku: sku.trim() || `${brand.substring(0, 3).toUpperCase()}-${model.replace(/\s+/g, "").substring(0, 5).toUpperCase()}-${storage}`,
      batteryHealth: brand === "Apple" && batteryHealth ? Number(batteryHealth) : undefined,
      status,
      warehouse,
      costs: updatedCosts,
      supplierName: supplierName.trim(),
      purchaseDate,
      images: finalImages,
      specifications: {
        chipset: chipset.trim() || device.specifications?.chipset || "Multi-core Mobile Processor",
        screenSize: screenSize.trim() || device.specifications?.screenSize || '6.1" OLED Retina Display',
        cameraSpecs: cameraSpecs.trim() || device.specifications?.cameraSpecs || "High Resolution Camera",
        network: network.trim() || device.specifications?.network || "5G Dual SIM",
        osVersion: osVersion.trim() || device.specifications?.osVersion || "Latest OS",
      },
      activityTimeline: [newActivity, ...(device.activityTimeline || [])],
    });

    showToast(`Handset ${deviceId.trim()} (${brand} ${model}) updated successfully!`, "success");
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <form onSubmit={handleSave} className="flex flex-col h-full max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer group shadow-xs"
              title="Click to upload/change photo from device"
            >
              {images[0] || imageUrl ? (
                <img
                  src={images[0] || imageUrl}
                  alt="Handset preview"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <Smartphone className="h-6 w-6 text-slate-400" />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Edit Handset Details: {device.id}
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {device.brand} {device.model}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Update photos, IMEI, brand, model, selling price, purchase cost, store outlet & specs.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "general"
                ? "bg-fundu-500 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>General & Identification</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pricing")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "pricing"
                ? "bg-fundu-500 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <DollarSign className="h-3.5 w-3.5" />
            <span>Pricing & Rule 32 Margin</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("specs")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "specs"
                ? "bg-fundu-500 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Hardware Specs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("advanced")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "advanced"
                ? "bg-fundu-500 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Supplier & Images</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: GENERAL & IDENTIFICATION */}
          {activeTab === "general" && (
            <div className="space-y-5">
              {/* Handset Code / Fun ID Section */}
              <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <label className="block text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Inventory ID / Fun Code</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <p className="text-[11px] text-blue-700/90 dark:text-blue-300 mt-0.5">
                    Handset stock code (e.g. <strong>Fun-26052</strong>) displayed under the device title across inventory tables, tax invoices & barcode labels.
                  </p>
                </div>
                <div className="w-full sm:w-64 shrink-0">
                  <Input
                    placeholder="e.g. Fun-26052"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    className="text-xs h-9 font-mono font-bold tracking-wider bg-white dark:bg-slate-900 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100 focus:ring-blue-500 shadow-xs"
                    required
                  />
                </div>
              </div>

              {/* Handset Photo Upload Section */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4 text-fundu-600 dark:text-fundu-400" />
                      <span>Handset Photos / Picture</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Upload real handset photos directly from your computer or phone gallery.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="fundu"
                      size="sm"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-1.5 text-xs font-semibold shadow-xs"
                    >
                      <UploadCloud className="h-3.5 w-3.5" />
                      <span>{isUploading ? "Uploading..." : "Upload Photo (Browse...)"}</span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowUrlInput((v) => !v)}
                      className="text-xs"
                    >
                      <span>Web Link</span>
                    </Button>
                  </div>
                </div>

                {/* Web URL input toggle */}
                {showUrlInput && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <Input
                      placeholder="https://images.unsplash.com/... or paste image URL"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="text-xs h-8"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddImageUrl}
                      className="h-8 text-xs shrink-0"
                    >
                      Add URL
                    </Button>
                  </div>
                )}

                {/* Photo Previews & Thumbnails */}
                {images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-1">
                    {images.map((imgSrc, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-xl overflow-hidden border aspect-square group bg-white dark:bg-slate-800 shadow-xs ${
                          idx === 0
                            ? "border-fundu-500 ring-2 ring-fundu-400/40"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <img
                          src={imgSrc}
                          alt={`Handset ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-fundu-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                            Primary
                          </span>
                        )}

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="px-1.5 py-0.5 rounded bg-white/90 text-slate-900 hover:bg-white text-[10px] font-semibold"
                              title="Set as primary"
                            >
                              Primary
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1 rounded bg-rose-600 text-white hover:bg-rose-700"
                            title="Delete photo"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-5 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-fundu-400 dark:hover:border-fundu-600 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors bg-white/40 dark:bg-slate-900/40"
                  >
                    <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-1.5">
                      <UploadCloud className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Click here to choose & upload photos from your device
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Supports PNG, JPG, JPEG, WEBP from your phone gallery or computer
                    </p>
                  </div>
                )}
              </div>

              {/* Brand and Model */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Brand / OEM <span className="text-rose-500">*</span>
                  </label>
                  <div className="space-y-1.5">
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full text-xs h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-slate-900 dark:text-slate-100 font-medium focus:ring-1 focus:ring-fundu-500"
                    >
                      {COMMON_BRANDS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                      {!COMMON_BRANDS.includes(brand) && (
                        <option value={brand}>{brand}</option>
                      )}
                    </select>
                    <Input
                      placeholder="Or enter custom brand..."
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="text-xs h-8"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Handset Model Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. iPhone 12 mini or Galaxy S23 Ultra"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="text-xs h-9 font-medium"
                    required
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Exact model name as printed on invoices and thermal barcode labels.
                  </p>
                </div>
              </div>

              {/* Storage, RAM, Colour */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Internal Storage <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    className="w-full text-xs h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-slate-900 dark:text-slate-100 font-medium"
                  >
                    {STORAGE_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    RAM Memory
                  </label>
                  <select
                    value={ram}
                    onChange={(e) => setRam(e.target.value)}
                    className="w-full text-xs h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-slate-900 dark:text-slate-100 font-medium"
                  >
                    {RAM_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Colour / Finish <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Midnight, Blue, Space Black"
                    value={colour}
                    onChange={(e) => setColour(e.target.value)}
                    className="text-xs h-9"
                    required
                  />
                </div>
              </div>

              {/* IMEI 1, IMEI 2, Serial Number */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-fundu-600 dark:text-fundu-400" />
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Hardware Identification & Serial Codes
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Primary IMEI 1 (15 Digits) <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g. 352819001234567"
                      value={imei1}
                      maxLength={15}
                      onChange={(e) => setImei1(e.target.value.replace(/\D/g, ""))}
                      className="text-xs h-9 font-mono font-medium tracking-wider"
                      required
                    />
                    <span className="text-[10px] text-slate-400">
                      {imei1.length}/15 digits
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Secondary IMEI 2 / eSIM
                    </label>
                    <Input
                      placeholder="e.g. 352819009876543 (optional)"
                      value={imei2}
                      maxLength={15}
                      onChange={(e) => setImei2(e.target.value.replace(/\D/g, ""))}
                      className="text-xs h-9 font-mono tracking-wider"
                    />
                    <span className="text-[10px] text-slate-400">
                      {imei2.length}/15 digits
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Serial Number / SN
                    </label>
                    <Input
                      placeholder="e.g. F2LLN8X40GXX"
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value.toUpperCase())}
                      className="text-xs h-9 font-mono uppercase"
                    />
                    <span className="text-[10px] text-slate-400">
                      Manufacturer serial
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Custom SKU / Barcode Code
                    </label>
                    <Input
                      placeholder="e.g. APP-IPH12-64"
                      value={sku}
                      onChange={(e) => setSku(e.target.value.toUpperCase())}
                      className="text-xs h-9 font-mono uppercase"
                    />
                  </div>

                  {/* Battery Health for Apple */}
                  {brand === "Apple" ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                        <Battery className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Battery Health % (Apple iPhones Only)</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={50}
                          max={100}
                          placeholder="e.g. 88"
                          value={batteryHealth ?? ""}
                          onChange={(e) =>
                            setBatteryHealth(
                              e.target.value ? Number(e.target.value) : undefined
                            )
                          }
                          className="text-xs h-9 font-bold"
                        />
                        <span className="text-xs font-semibold text-slate-500">%</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Maximum capacity as reported by iOS settings.
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center">
                      <span className="text-xs font-semibold text-slate-500">
                        Battery Health: N/A
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Battery health percentage is strictly tracked for Apple iOS handsets per company policy.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status and Store Outlet Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Operational Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as DeviceStatus)}
                    className="w-full text-xs h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-slate-900 dark:text-slate-100 font-semibold"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    &quot;Ready for Sale&quot; devices show in POS billing; &quot;In Stock&quot; is in warehouse.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Store className="h-3.5 w-3.5 text-fundu-600" />
                    <span>Store Outlet / Warehouse Location</span>
                  </label>
                  <select
                    value={warehouse}
                    onChange={(e) => setWarehouse(e.target.value)}
                    className="w-full text-xs h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-slate-900 dark:text-slate-100 font-medium"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.name}>
                        {w.name} ({w.code})
                      </option>
                    ))}
                    {!warehouses.some((w) => w.name === warehouse) && (
                      <option value={warehouse}>{warehouse}</option>
                    )}
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Current physical location of the smartphone.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRICING & RULE 32 MARGIN */}
          {activeTab === "pricing" && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-fundu-50/50 dark:bg-fundu-950/20 border border-fundu-200 dark:border-fundu-800 flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-fundu-600 dark:text-fundu-400 mt-0.5 shrink-0" />
                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    GST Rule 32(5) Margin Scheme Pricing Engine
                  </p>
                  <p>
                    For second-hand goods under Rule 32(5), GST is computed solely on the positive margin
                    (Selling Price − Purchase Price). Adjust the prices and landed cost overheads below.
                  </p>
                </div>
              </div>

              {/* Core Prices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Internal Purchase Cost (₹) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-sm font-semibold text-slate-400">₹</span>
                    <Input
                      type="number"
                      min={0}
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(Number(e.target.value))}
                      className="pl-8 text-base font-bold font-mono h-10"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Base acquisition cost from vendor / customer buyback.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-3">
                  <label className="block text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    Target Selling Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-sm font-semibold text-emerald-600">₹</span>
                    <Input
                      type="number"
                      min={0}
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(Number(e.target.value))}
                      className="pl-8 text-base font-bold font-mono text-emerald-700 dark:text-emerald-300 h-10 border-emerald-300 dark:border-emerald-700"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                    Gross invoice price charged to end customer.
                  </p>
                </div>
              </div>

              {/* Overheads & Landed Cost Breakdown */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/40">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Additional Landed Cost Overheads (Optional)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Repair & Parts (₹)
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={repairCost}
                      onChange={(e) => setRepairCost(Number(e.target.value))}
                      className="text-xs h-8 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      QC Testing (₹)
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={testingCost}
                      onChange={(e) => setTestingCost(Number(e.target.value))}
                      className="text-xs h-8 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Packaging (₹)
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={packagingCost}
                      onChange={(e) => setPackagingCost(Number(e.target.value))}
                      className="text-xs h-8 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Logistics (₹)
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={logisticsCost}
                      onChange={(e) => setLogisticsCost(Number(e.target.value))}
                      className="text-xs h-8 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Other Costs (₹)
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={otherCost}
                      onChange={(e) => setOtherCost(Number(e.target.value))}
                      className="text-xs h-8 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Live Margin & Landed Preview Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900 text-white shadow-inner">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400">
                    Total Landed Cost
                  </span>
                  <p className="text-lg font-bold font-mono text-slate-100">
                    {formatINR(totalLandedCost)}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Purchase + all refurbishing overheads
                  </p>
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400">
                    Projected Gross Margin
                  </span>
                  <p
                    className={`text-lg font-bold font-mono ${
                      projectedProfit >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {formatINR(projectedProfit)}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Rule 32(5) taxable value basis
                  </p>
                </div>

                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400">
                    Profit Margin %
                  </span>
                  <p
                    className={`text-lg font-bold font-mono ${
                      profitMarginPercent >= 15
                        ? "text-fundu-400"
                        : profitMarginPercent >= 0
                        ? "text-amber-400"
                        : "text-rose-400"
                    }`}
                  >
                    {profitMarginPercent}%
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Target gross return on sale
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HARDWARE SPECS */}
          {activeTab === "specs" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Technical hardware parameters displayed on customer spec sheet and technical audit logs.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Processor / Chipset
                  </label>
                  <Input
                    placeholder="e.g. Apple A14 Bionic (5nm) or Snapdragon 8 Gen 2"
                    value={chipset}
                    onChange={(e) => setChipset(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Screen & Display
                  </label>
                  <Input
                    placeholder='e.g. 5.4" Super Retina XDR OLED (2340x1080)'
                    value={screenSize}
                    onChange={(e) => setScreenSize(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Camera System
                  </label>
                  <Input
                    placeholder="e.g. Dual 12MP Ultra Wide and Wide cameras with Night mode"
                    value={cameraSpecs}
                    onChange={(e) => setCameraSpecs(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Network & Connectivity
                  </label>
                  <Input
                    placeholder="e.g. 5G Sub-6 GHz, Gigabit LTE, Wi-Fi 6, Bluetooth 5.0"
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Operating System Version
                  </label>
                  <Input
                    placeholder="e.g. iOS 17.5 / Android 14"
                    value={osVersion}
                    onChange={(e) => setOsVersion(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ADVANCED / SUPPLIER / IMAGES */}
          {activeTab === "advanced" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Supplier / Vendor Name
                  </label>
                  <Input
                    placeholder="e.g. Esterline Bonaparte Corp or Customer Walk-in"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Intake / Purchase Date
                  </label>
                  <Input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>
              </div>

              {/* Handset Photo Upload in Tab 4 */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4 text-fundu-600 dark:text-fundu-400" />
                      <span>Handset Photos & Inspection Gallery</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Upload from phone or computer disk. First photo is used as main catalog thumbnail.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="fundu"
                      size="sm"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-1.5 text-xs font-semibold shadow-xs"
                    >
                      <UploadCloud className="h-3.5 w-3.5" />
                      <span>{isUploading ? "Uploading..." : "Upload Photo (Browse...)"}</span>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <Input
                    placeholder="Or paste external image URL..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="text-xs h-8"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddImageUrl}
                    className="h-8 text-xs shrink-0"
                  >
                    Add URL
                  </Button>
                </div>

                {images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-1">
                    {images.map((imgSrc, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-xl overflow-hidden border aspect-square group bg-white dark:bg-slate-800 shadow-xs ${
                          idx === 0
                            ? "border-fundu-500 ring-2 ring-fundu-400/40"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <img
                          src={imgSrc}
                          alt={`Handset ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-fundu-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                            Primary
                          </span>
                        )}

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="px-1.5 py-0.5 rounded bg-white/90 text-slate-900 hover:bg-white text-[10px] font-semibold"
                              title="Set as primary"
                            >
                              Primary
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1 rounded bg-rose-600 text-white hover:bg-rose-700"
                            title="Delete photo"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-5 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-fundu-400 dark:hover:border-fundu-600 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors bg-white/40 dark:bg-slate-900/40"
                  >
                    <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-1.5">
                      <UploadCloud className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      No photos uploaded yet. Click here to select photos from your device.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 shrink-0">
          <div className="text-xs text-slate-500">
            Editing will update local storage and all sales/invoice registers immediately.
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="fundu"
              size="sm"
              className="gap-1.5 text-xs font-semibold px-4 shadow-sm"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Building2,
  Image as ImageIcon,
  ArrowLeft,
  Sparkles,
  Layers,
  UploadCloud,
  X,
  Battery,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { DeviceGrade, DeviceStatus, WarehouseLocation } from "@/lib/types";

// Zod Schema
const phoneFormSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  storage: z.string().min(1, "Storage is required"),
  ram: z.string().optional(),
  colour: z.string().min(1, "Colour is required"),

  imei1: z.string().min(14, "IMEI 1 must be at least 14-15 digits"),
  imei2: z.string().optional(),
  serialNumber: z.string().min(3, "Serial number is required"),
  sku: z.string().optional(),

  batteryHealth: z.coerce.number().min(50, "Battery health must be >= 50").max(100, "Max 100"),
  displayCheck: z.boolean().default(true),
  touchCheck: z.boolean().default(true),
  cameraCheck: z.boolean().default(true),
  faceIdCheck: z.boolean().default(true),
  fingerprintCheck: z.boolean().default(true),
  speakerCheck: z.boolean().default(true),
  micCheck: z.boolean().default(true),
  chargingCheck: z.boolean().default(true),
  networkCheck: z.boolean().default(true),

  purchasePrice: z.coerce.number().min(1, "Purchase price required"),
  repairCost: z.coerce.number().default(0),
  testingCost: z.coerce.number().default(500),
  logisticsCost: z.coerce.number().default(500),
  otherCost: z.coerce.number().default(200),
  sellingPrice: z.coerce.number().min(1, "Selling price required"),

  supplier: z.string().min(1, "Supplier required"),
  purchaseDate: z.string().min(1, "Purchase date required"),
  warehouse: z.string().min(1, "Warehouse required"),
  grade: z.string().optional(),
  status: z.string().min(1, "Status required"),
});

type PhoneFormData = z.infer<typeof phoneFormSchema>;

export default function AddNewPhonePage() {
  const router = useRouter();
  const { addDevice, suppliers, warehouses, showToast } = useApp();

  const [imageUrls, setImageUrls] = useState<string[]>([
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
  ]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      brand: "Apple",
      model: "iPhone 15",
      storage: "128GB",
      ram: "6GB",
      colour: "Natural Titanium",
      imei1: "35" + Math.floor(1000000000000 + Math.random() * 9000000000000),
      imei2: "35" + Math.floor(1000000000000 + Math.random() * 9000000000000),
      serialNumber: "F2LZ" + Math.random().toString(36).substring(2, 7).toUpperCase(),
      sku: "APL-IP15-128-NT",
      batteryHealth: 96,
      displayCheck: true,
      touchCheck: true,
      cameraCheck: true,
      faceIdCheck: true,
      fingerprintCheck: true,
      speakerCheck: true,
      micCheck: true,
      chargingCheck: true,
      networkCheck: true,
      purchasePrice: 48000,
      repairCost: 0,
      testingCost: 500,
      logisticsCost: 500,
      otherCost: 200,
      sellingPrice: 59999,
      supplier: suppliers[0]?.name || "Esterline Bulk Refurb Solutions",
      purchaseDate: new Date().toISOString().split("T")[0],
      warehouse: "Lucknow Store (LKO-01)",
      status: "In Stock",
    },
  });

  // Watch financials for live profit calculation
  const purchasePrice = Number(watch("purchasePrice") || 0);
  const repairCost = Number(watch("repairCost") || 0);
  const testingCost = Number(watch("testingCost") || 0);
  const logisticsCost = Number(watch("logisticsCost") || 0);
  const otherCost = Number(watch("otherCost") || 0);
  const sellingPrice = Number(watch("sellingPrice") || 0);

  const totalLandedCost = purchasePrice + repairCost + testingCost + logisticsCost + otherCost;
  const projectedProfit = sellingPrice - totalLandedCost;
  const marginPercent = sellingPrice > 0 ? ((projectedProfit / sellingPrice) * 100).toFixed(1) : "0";

  const handleSimulatedImageAdd = () => {
    const samples = [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
    ];
    const nextImg = samples[imageUrls.length % samples.length];
    setImageUrls((prev) => [...prev, nextImg]);
    showToast("Product inspection photo attached.", "info");
  };

  const onSubmit = (data: PhoneFormData) => {
    addDevice({
      brand: data.brand,
      model: data.model,
      storage: data.storage,
      ram: data.ram,
      colour: data.colour,
      imei1: data.imei1,
      imei2: data.imei2,
      serialNumber: data.serialNumber,
      sku: data.sku,
      batteryHealth: data.batteryHealth,
      status: data.status as DeviceStatus,
      warehouse: data.warehouse as WarehouseLocation,
      costs: {
        purchasePrice: data.purchasePrice,
        repairCost: data.repairCost,
        testingCost: data.testingCost,
        packagingCost: 400,
        logisticsCost: data.logisticsCost,
        otherCost: data.otherCost,
        totalLandedCost,
        sellingPrice: data.sellingPrice,
        projectedProfit,
        profitMarginPercent: Number(marginPercent),
      },
      supplierName: data.supplier,
      purchaseDate: data.purchaseDate,
      images: imageUrls,
      qcInspection: {
        id: `QC-${Date.now().toString().slice(-4)}`,
        deviceId: "",
        inspectorName: "Intake Station #1",
        inspectionDate: data.purchaseDate,
        batteryHealthPercent: data.batteryHealth,
        checklist: {
          display: data.displayCheck,
          touchscreen: data.touchCheck,
          battery: true,
          faceId: data.faceIdCheck,
          fingerprint: data.fingerprintCheck,
          cameras: data.cameraCheck,
          speakers: data.speakerCheck,
          microphone: data.micCheck,
          chargingPort: data.chargingCheck,
          simNetwork: data.networkCheck,
          wifi: true,
          bluetooth: true,
          physicalCondition: true,
        },
        notes: "Intake registration checklist approved.",
        images: imageUrls,
        status: data.status === "Under Repair" ? "Needs Repair" : "Approved",
      },
    });

    router.push("/inventory");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/inventory">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Add New Smartphone</span>
              <Badge variant="fundu" size="sm">
                Multi-Section Intake
              </Badge>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Register individual handset into TheFundu Inventory OS with full diagnostic & landed cost tracking.
            </p>
          </div>
        </div>

        <Link href="/inventory">
          <Button variant="outline" size="sm">
            Cancel
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* SECTION A: BASIC INFORMATION */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-sm flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-fundu-600" />
              <span>Section A: Basic Information</span>
            </CardTitle>
            <CardDescription>Brand, handset model, memory tier and finish</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            {/* Brand */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Brand *
              </label>
              <select
                {...register("brand")}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="Apple">Apple</option>
              </select>
            </div>

            {/* Model */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Model Name *
              </label>
              <Input
                placeholder="e.g. iPhone 15 Pro Max"
                {...register("model")}
              />
              {errors.model && (
                <p className="text-rose-500 text-[10px] mt-1">{errors.model.message}</p>
              )}
            </div>

            {/* Storage */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Internal Storage *
              </label>
              <select
                {...register("storage")}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="64GB">64GB</option>
                <option value="128GB">128GB</option>
                <option value="256GB">256GB</option>
                <option value="512GB">512GB</option>
                <option value="1TB">1TB</option>
              </select>
            </div>

            {/* RAM */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                RAM / Memory
              </label>
              <Input placeholder="e.g. 8GB" {...register("ram")} />
            </div>

            {/* Colour */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Official Finish / Colour *
              </label>
              <Input placeholder="e.g. Natural Titanium" {...register("colour")} />
            </div>
          </CardContent>
        </Card>

        {/* SECTION B: DEVICE IDENTIFICATION */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-sm flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-fundu-600" />
              <span>Section B: Device Identification & Telecom Numbers</span>
            </CardTitle>
            <CardDescription>IMEI 1 & 2, factory serial number, and barcode SKU</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {/* IMEI 1 */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Primary IMEI (IMEI 1) *
              </label>
              <Input
                placeholder="15-digit TAC+Serial"
                className="font-mono text-xs"
                {...register("imei1")}
              />
              {errors.imei1 && (
                <p className="text-rose-500 text-[10px] mt-1">{errors.imei1.message}</p>
              )}
            </div>

            {/* IMEI 2 */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Secondary IMEI (eSIM / SIM 2)
              </label>
              <Input
                placeholder="Optional secondary"
                className="font-mono text-xs"
                {...register("imei2")}
              />
            </div>

            {/* Serial Number */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Serial Number *
              </label>
              <Input
                placeholder="e.g. F2LZW88DK0"
                className="font-mono text-xs"
                {...register("serialNumber")}
              />
            </div>

            {/* SKU */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Stock Keeping Unit (SKU)
              </label>
              <Input
                placeholder="e.g. APL-IP15-128"
                className="font-mono text-xs"
                {...register("sku")}
              />
            </div>
          </CardContent>
        </Card>

        {/* SECTION C: DEVICE CONDITION & 10-POINT CHECKS */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-sm flex items-center gap-2">
              <Battery className="h-4 w-4 text-fundu-600" />
              <span>Section C: Device Condition & Hardware Checkpoints</span>
            </CardTitle>
            <CardDescription>Battery health % and critical hardware functional tests</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs">
            <div className="max-w-xs">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Battery Health Percentage (50-100%) *
              </label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min={50}
                  max={100}
                  {...register("batteryHealth")}
                />
                <span className="font-bold text-slate-700 dark:text-slate-300">%</span>
              </div>
            </div>

            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Hardware Functional Test Passes:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { id: "displayCheck", label: "Display & TrueTone" },
                  { id: "touchCheck", label: "Touchscreen Matrix" },
                  { id: "cameraCheck", label: "Cameras (Main/UW/Tele)" },
                  { id: "faceIdCheck", label: "Face ID / Biometrics" },
                  { id: "fingerprintCheck", label: "Fingerprint Scanner" },
                  { id: "speakerCheck", label: "Stereo Speakers" },
                  { id: "micCheck", label: "Microphone Array" },
                  { id: "chargingCheck", label: "Charging & Wireless" },
                  { id: "networkCheck", label: "Cellular & Wi-Fi" },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 cursor-pointer hover:bg-slate-100"
                  >
                    <input
                      type="checkbox"
                      {...register(item.id as any)}
                      className="rounded border-slate-300 text-fundu-600 focus:ring-fundu-500 cursor-pointer"
                    />
                    <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION D: FINANCIAL DETAILS & PROFIT PREVIEW */}
        <Card className="border-fundu-200/80 dark:border-fundu-900/60">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-fundu-600" />
                <span>Section D: Financial Landed Costs & Selling Price</span>
              </div>
              <span className="text-xs font-bold text-fundu-600 dark:text-fundu-400">
                Live Margin Simulator
              </span>
            </CardTitle>
            <CardDescription>Record procurement cost, repair estimates and target selling price</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Purchase Price *
                </label>
                <Input type="number" {...register("purchasePrice")} />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Repair Cost
                </label>
                <Input type="number" {...register("repairCost")} />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Testing Cost
                </label>
                <Input type="number" {...register("testingCost")} />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Logistics Cost
                </label>
                <Input type="number" {...register("logisticsCost")} />
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Other Costs
                </label>
                <Input type="number" {...register("otherCost")} />
              </div>
              <div>
                <label className="font-semibold text-fundu-700 dark:text-fundu-300 block mb-1">
                  Selling Price *
                </label>
                <Input
                  type="number"
                  className="border-fundu-400 focus:ring-fundu-500 font-bold"
                  {...register("sellingPrice")}
                />
              </div>
            </div>

            {/* Calculated Profit Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-fundu-50/40 dark:from-slate-900 dark:to-fundu-950/30 border border-fundu-200 dark:border-fundu-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-slate-400">Total Landed Cost:</span>
                <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {formatINR(totalLandedCost)}
                </p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400">Target Selling Price:</span>
                <p className="text-base font-bold text-fundu-600 dark:text-fundu-400">
                  {formatINR(sellingPrice)}
                </p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400">Projected Gross Profit:</span>
                <p
                  className={`text-base font-bold ${
                    projectedProfit >= 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {formatINR(projectedProfit)}
                </p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400">Gross Margin %:</span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-base font-bold ${
                      Number(marginPercent) >= 15
                        ? "text-emerald-600"
                        : Number(marginPercent) > 0
                        ? "text-amber-600"
                        : "text-rose-600"
                    }`}
                  >
                    {marginPercent}%
                  </span>
                  <Badge variant={Number(marginPercent) >= 15 ? "success" : "warning"} size="sm">
                    {Number(marginPercent) >= 15 ? "Healthy" : "Low Margin"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION E: INVENTORY INFORMATION */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4 text-fundu-600" />
              <span>Section E: Inventory Classification & Sourcing</span>
            </CardTitle>
            <CardDescription>Supplier link, assignment warehouse, condition grade and initial state</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-xs">
            {/* Supplier */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Supplier Source *
              </label>
              <select
                {...register("supplier")}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Purchase Date */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Intake Date *
              </label>
              <Input type="date" {...register("purchaseDate")} />
            </div>

            {/* Store Location */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Store Location *
              </label>
              <select
                {...register("warehouse")}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.name}>
                    {w.name} {w.code ? `(${w.code})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock Status */}
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Initial Stock Status *
              </label>
              <select
                {...register("status")}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="In Stock">In Stock</option>
                <option value="Ready for Sale">Ready for Sale</option>
                <option value="QC Pending">QC Pending</option>
                <option value="Under Repair">Under Repair</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* SECTION F: MEDIA & INSPECTION PHOTOS */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-fundu-600" />
                <span>Section F: Media & Inspection Photos</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSimulatedImageAdd}
                className="gap-1 text-xs"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                <span>Upload Another Photo</span>
              </Button>
            </CardTitle>
            <CardDescription>Attach high-res photos of device front, back, chassis and inspection certificate</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {imageUrls.map((url, i) => (
                <div
                  key={i}
                  className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video group"
                >
                  <img src={url} alt="Phone preview" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2">
                    <button
                      type="button"
                      onClick={() => setImageUrls((prev) => prev.filter((_, idx) => idx !== i))}
                      className="p-1 rounded-full bg-black/60 text-white hover:bg-black"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="absolute bottom-2 left-2 text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-white">
                    Preview {i + 1}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link href="/inventory">
            <Button variant="outline" type="button">
              Discard
            </Button>
          </Link>
          <Button
            type="submit"
            variant="fundu"
            size="lg"
            isLoading={isSubmitting}
            className="shadow-md"
          >
            Save & Register Phone into Inventory
          </Button>
        </div>
      </form>
    </div>
  );
}

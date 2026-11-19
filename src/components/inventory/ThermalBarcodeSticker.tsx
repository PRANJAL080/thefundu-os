"use client";

import React, { useRef, useState } from "react";
import { Printer, Download, Check, Sparkles, Sliders, Smartphone, X, QrCode } from "lucide-react";
import { Device } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from "@/components/common/QRCodeSVG";
import { BarcodeSVG } from "@/components/common/BarcodeSVG";

interface ThermalBarcodeStickerProps {
  device: Device;
  labelSize?: "50x25" | "50x38" | "100x50";
}

export function ThermalBarcodeSticker({
  device,
  labelSize = "50x38",
}: ThermalBarcodeStickerProps) {
  // Size classes for on-screen preview & exact millimeter print sizing
  const isCompact = labelSize === "50x25";
  const isLarge = labelSize === "100x50";

  return (
    <div
      className={`thermal-sticker-box border-2 border-black bg-white text-black p-2 mx-auto select-none rounded font-sans transition-all shadow-md ${
        isCompact
          ? "w-[240px] min-h-[120px] text-[9px]"
          : isLarge
          ? "w-[360px] min-h-[190px] text-[11px]"
          : "w-[270px] min-h-[155px] text-[10px]"
      }`}
      style={{
        pageBreakInside: "avoid",
        boxSizing: "border-box",
      }}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between border-b border-black pb-1 mb-1 leading-none">
        <div className="flex items-center gap-1">
          <span className="font-black text-xs uppercase tracking-tight">TheFundu</span>
          <span className="text-[7.5px] font-bold bg-black text-white px-1 py-0.5 rounded-xs uppercase">
            Certified Refurb
          </span>
        </div>
        <div className="text-right">
          <span className="font-mono text-[9px] font-black bg-black text-white px-1 rounded-xs">
            {device.id}
          </span>
        </div>
      </div>

      {/* Model & Spec Line */}
      <div className="font-black text-[11px] leading-tight truncate uppercase">
        {device.brand} {device.model}
      </div>
      <div className="flex items-center justify-between text-[9px] font-semibold text-neutral-800 border-b border-black/40 pb-0.5 mb-1">
        <span>
          {device.storage} • {device.colour}
        </span>
        <span className="font-bold font-mono">
          STORE: LKO-01
        </span>
      </div>

      {/* Store & Verification Banner */}
      <div className="flex items-center justify-between bg-neutral-100 border border-black/60 px-1.5 py-0.5 mb-1 rounded-xs">
        <div className="font-black text-[9.5px] tracking-tight uppercase">
          LUCKNOW STORE • GOMTI NAGAR
        </div>
        <div className="text-[8px] font-mono font-bold">
          VERIFIED BY THEFUNDU
        </div>
      </div>

      {/* Barcode & Verification QR Section */}
      <div className="my-0.5 flex items-center justify-between gap-1">
        <div className="flex-1 overflow-hidden">
          <BarcodeSVG value={device.imei1} width={180} height={isCompact ? 22 : 28} />
        </div>
        <div className="shrink-0 flex flex-col items-center justify-center pl-1 border-l border-black/40">
          <QRCodeSVG
            value={`https://thefundu.com/verify/${device.serialNumber || device.id}`}
            size={isCompact ? 28 : 34}
            className="border border-black/30"
          />
          <span className="font-mono text-[6px] font-bold uppercase tracking-tight mt-0.5">
            VERIFY QR
          </span>
        </div>
      </div>

      {/* IMEI 2 & Serial Footer */}
      <div className="border-t border-black pt-1 mt-1 flex items-center justify-between text-[7.5px] font-mono font-bold leading-none">
        <div>
          <span>IMEI2: </span>
          <span>{device.imei2 || "N/A"}</span>
          {device.batteryHealth ? (
            <span className="ml-1 text-emerald-800">| BATT: {device.batteryHealth}%</span>
          ) : null}
        </div>
        <div className="text-right truncate max-w-[130px]">
          SN: {device.serialNumber || device.id} • LKO-01
        </div>
      </div>
    </div>
  );
}

interface ThermalStickerModalProps {
  devices: Device[];
  isOpen: boolean;
  onClose: () => void;
}

export function ThermalStickerModal({
  devices,
  isOpen,
  onClose,
}: ThermalStickerModalProps) {
  const [labelSize, setLabelSize] = useState<"50x25" | "50x38" | "100x50">("50x38");
  const [copies, setCopies] = useState<number>(1);
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen || devices.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="3xl">
      {/* Hide modal chrome during print */}
      <div className="space-y-6">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 flex items-center justify-center">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Thermal Barcode Sticker Printer</span>
                <Badge variant="fundu" size="sm">
                  {devices.length} {devices.length === 1 ? "Label" : "Batch Labels"}
                </Badge>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ready for standard 50×38mm / 50×25mm thermal roll printers (TVS, TSC, Zebra, Honeywell)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="fundu"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 shadow-sm font-semibold"
            >
              <Printer className="h-4 w-4" />
              <span>Print Sticker Now</span>
            </Button>
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800 text-xs">
          <div>
            <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
              Thermal Label Roll Size
            </label>
            <select
              value={labelSize}
              onChange={(e) => setLabelSize(e.target.value as any)}
              className="w-full h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="50x38">50mm × 38mm (Recommended - Standard Handset)</option>
              <option value="50x25">50mm × 25mm (Ultra-Compact - Phone Back)</option>
              <option value="100x50">100mm × 50mm (Large Outer Box / Consignment)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
              Target Printer Mode
            </label>
            <div className="flex items-center gap-1.5 h-8 px-2 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px]">Direct Thermal / 203 DPI</span>
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
              Copies per Device
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={copies}
              onChange={(e) => setCopies(Math.max(1, Number(e.target.value)))}
              className="w-full h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
        </div>

        {/* Live Sticker Preview Canvas (also targeted by print CSS) */}
        <div
          ref={printAreaRef}
          className="p-6 bg-slate-200 dark:bg-slate-950/80 rounded-xl border border-slate-300 dark:border-slate-800 overflow-y-auto max-h-[50vh] flex flex-wrap gap-4 items-center justify-center print:p-0 print:m-0 print:border-none print:bg-white"
        >
          {devices.map((device, devIdx) =>
            Array.from({ length: copies }).map((_, copyIdx) => (
              <div
                key={`${device.id}-${devIdx}-${copyIdx}`}
                className="print:break-after-page print:m-0"
              >
                <ThermalBarcodeSticker device={device} labelSize={labelSize} />
              </div>
            ))
          )}
        </div>

        {/* Operating Instruction Box */}
        <div className="flex items-start gap-3 p-3 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 rounded-lg text-xs text-blue-800 dark:text-blue-300">
          <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Thermal Printer Print Setup Tip:</p>
            <p className="text-[11px] leading-relaxed text-blue-700 dark:text-blue-400">
              In your browser print dialog, select your thermal printer (e.g. TVS LP 46 / Zebra ZD220).
              Set <strong>Margins: None</strong>, Scale: <strong>100%</strong>, and Paper Size to <strong>50mm × 38mm (or 2" × 1.5")</strong>.
              The barcode is high-contrast vector SVG and will scan instantaneously with any 1D/2D barcode gun.
            </p>
          </div>
        </div>
      </div>

      {/* Scoped CSS for strict thermal printer dimensions */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .thermal-sticker-box,
          .thermal-sticker-box * {
            visibility: visible;
          }
          .thermal-sticker-box {
            position: absolute;
            left: 0;
            top: 0;
            width: ${labelSize === "50x25" ? "50mm" : labelSize === "100x50" ? "100mm" : "50mm"} !important;
            height: ${labelSize === "50x25" ? "25mm" : labelSize === "100x50" ? "50mm" : "38mm"} !important;
            margin: 0 !important;
            padding: 1.5mm !important;
            border: 1px solid black !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </Dialog>
  );
}

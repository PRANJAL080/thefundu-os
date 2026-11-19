"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ScanLine,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Printer,
  FileText,
  Wrench,
  ShieldCheck,
  Search,
  ExternalLink,
  Volume2,
  Plus,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import { Device } from "@/lib/types";
import { formatINR, getGradeBadgeColor, getStatusBadgeColor } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface QuickBarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDeviceProfile?: (device: Device) => void;
  onPrintSticker?: (device: Device) => void;
  onGenerateInvoice?: (device: Device) => void;
}

export function QuickBarcodeScannerModal({
  isOpen,
  onClose,
  onOpenDeviceProfile,
  onPrintSticker,
  onGenerateInvoice,
}: QuickBarcodeScannerModalProps) {
  const router = useRouter();
  const { devices, showToast } = useApp();
  const [scannedInput, setScannedInput] = useState("");
  const [matchedDevice, setMatchedDevice] = useState<Device | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically when modal opens
  useEffect(() => {
    if (isOpen) {
      setScannedInput("");
      setMatchedDevice(null);
      setHasSearched(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Play high-frequency warehouse scanner confirmation beep using Web Audio API
  const playScanBeep = (success: boolean) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      if (success) {
        osc.frequency.setValueAtTime(1760, audioCtx.currentTime); // High pitch A6 beep
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.12);
      } else {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); // Low warning buzz
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.25);
      }
    } catch {
      // AudioContext not permitted or supported
    }
  };

  const handleLookup = (query: string) => {
    // Strip carriage return, linefeed, control chars sent by hardware guns
    const clean = query.replace(/[\r\n\t]/g, "").trim().toUpperCase();
    if (!clean) return;

    const cleanNoDash = clean.replace(/[^A-Z0-9]/g, "");

    // Search by exact IMEI1, IMEI2, Inventory ID, SKU, Serial Number, or flexible partial match
    const found = devices.find((d) => {
      const dIdUpper = d.id.toUpperCase();
      const dIdNoDash = dIdUpper.replace(/[^A-Z0-9]/g, "");
      const dSerialUpper = d.serialNumber?.toUpperCase() || "";
      const dSkuUpper = d.sku?.toUpperCase() || "";

      return (
        d.imei1 === clean ||
        d.imei2 === clean ||
        dIdUpper === clean ||
        dIdNoDash === cleanNoDash ||
        dSerialUpper === clean ||
        dSkuUpper === clean ||
        (clean.length >= 5 && /^\d+$/.test(clean) && dIdNoDash.endsWith(clean))
      );
    });

    setHasSearched(true);
    if (found) {
      setMatchedDevice(found);
      playScanBeep(true);
      showToast(`Scanned: ${found.brand} ${found.model} (${found.id})`, "success");
    } else {
      setMatchedDevice(null);
      playScanBeep(false);
      showToast(`No handset registered with IMEI/ID: "${clean}"`, "error");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLookup(scannedInput);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-fundu-500/10 text-fundu-600 dark:bg-fundu-500/20 flex items-center justify-center animate-pulse">
              <ScanLine className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Hardware Barcode & IMEI Scanner</span>
                <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  USB Gun Ready
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aim any handheld 1D/2D scanner gun at the phone box, screen, or sticker. Or type manually and press Enter.
              </p>
            </div>
          </div>
        </div>

        {/* Gun Input Area */}
        <div className="relative">
          <Input
            ref={inputRef}
            placeholder="Scan barcode or type IMEI 1 / IMEI 2 / Inventory ID (e.g. 354086485372166)..."
            value={scannedInput}
            onChange={(e) => {
              const val = e.target.value;
              setScannedInput(val);
              const cleanVal = val.replace(/[\r\n\t]/g, "").trim().toUpperCase();
              // Instant auto-lookup for hardware scanner guns emitting complete IMEI or Fun Code
              if (
                (cleanVal.length === 15 && /^\d+$/.test(cleanVal)) ||
                (cleanVal.startsWith("FUN-26") && cleanVal.length >= 9) ||
                (cleanVal.startsWith("FUN26") && cleanVal.length >= 8)
              ) {
                handleLookup(cleanVal);
              }
            }}
            onKeyDown={handleKeyDown}
            className="text-base font-mono tracking-wider h-12 pr-28 shadow-inner border-2 border-fundu-500/50 focus:border-fundu-600"
          />
          <div className="absolute right-2 top-2 flex items-center gap-1.5">
            <Button
              variant="fundu"
              size="sm"
              onClick={() => handleLookup(scannedInput)}
              className="h-8 text-xs font-semibold"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Matched Device Card Result */}
        {matchedDevice && (
          <div className="p-4 bg-slate-50 dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-14 w-14 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                  {matchedDevice.images?.[0] ? (
                    <img
                      src={matchedDevice.images[0]}
                      alt={matchedDevice.model}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Smartphone className="h-6 w-6 text-slate-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {matchedDevice.brand} {matchedDevice.model}
                    </h3>
                    <Badge variant="fundu" size="sm">
                      {matchedDevice.id}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {matchedDevice.storage} • {matchedDevice.colour} • <span className="font-semibold text-fundu-700 dark:text-fundu-300">Refurbished</span>
                    {matchedDevice.brand.toLowerCase() === "apple" && matchedDevice.batteryHealth && (
                      <>
                        {" "}• Battery{" "}
                        <span className="font-bold text-emerald-600">
                          {matchedDevice.batteryHealth}%
                        </span>
                      </>
                    )}
                  </p>
                  <p className="font-mono text-[11px] text-slate-400 mt-0.5">
                    IMEI 1: <strong className="text-slate-700 dark:text-slate-300">{matchedDevice.imei1}</strong> | IMEI 2: {matchedDevice.imei2}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[11px] text-slate-400 uppercase font-bold">Selling Price</p>
                <p className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {formatINR(matchedDevice.costs.sellingPrice)}
                </p>
                <div className="inline-block mt-1">
                  <Badge variant={matchedDevice.status === "Ready for Sale" ? "success" : "secondary"} size="sm">
                    {matchedDevice.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Quick Action Matrix */}
            <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onPrintSticker?.(matchedDevice);
                }}
                className="gap-1.5 justify-center bg-white dark:bg-slate-800"
              >
                <Printer className="h-3.5 w-3.5 text-emerald-600" />
                <span>Print Sticker</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onGenerateInvoice?.(matchedDevice);
                }}
                className="gap-1.5 justify-center bg-white dark:bg-slate-800"
              >
                <FileText className="h-3.5 w-3.5 text-blue-600" />
                <span>Generate Bill</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  router.push("/quality-check");
                }}
                className="gap-1.5 justify-center bg-white dark:bg-slate-800"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-fundu-600" />
                <span>Run QC</span>
              </Button>

              <Button
                variant="fundu"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenDeviceProfile?.(matchedDevice);
                }}
                className="gap-1.5 justify-center font-semibold"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Full Profile</span>
              </Button>
            </div>
          </div>
        )}

        {/* Not Found State */}
        {hasSearched && !matchedDevice && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Handset Not Found in Inventory</p>
                <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                  No registered handset matches <code>{scannedInput}</code>. Would you like to inward this phone into stock?
                </p>
              </div>
            </div>

            <Button
              variant="fundu"
              size="sm"
              onClick={() => {
                onClose();
                router.push(`/inventory/add?imei=${encodeURIComponent(scannedInput)}`);
              }}
              className="gap-1.5 shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Inward New Phone</span>
            </Button>
          </div>
        )}

        {/* Quick Tips */}
        <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between px-1">
          <span>Tip: Press <strong>Esc</strong> to exit scanner modal.</span>
          <span>Sample IMEIs in system: 354086485372166, 354086485372174, Fun-26000</span>
        </div>
      </div>
    </Dialog>
  );
}

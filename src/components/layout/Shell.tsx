"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { GlobalSearch } from "@/components/common/GlobalSearch";
import { QuickBarcodeScannerModal } from "@/components/common/QuickBarcodeScannerModal";
import { AiVoiceCopilotModal } from "@/components/common/AiVoiceCopilotModal";
import { ThermalStickerModal } from "@/components/inventory/ThermalBarcodeSticker";
import { DeviceDetailsModal } from "@/components/inventory/DeviceDetailsModal";
import { InvoiceModal } from "@/components/invoice/InvoiceModal";
import { AuthGate } from "@/components/auth/AuthGate";
import { useApp } from "@/lib/store";
import { Device } from "@/lib/types";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export function Shell({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState(false);

  // Cross-app modal states
  const [stickerDevices, setStickerDevices] = useState<Device[]>([]);
  const [isStickerOpen, setIsStickerOpen] = useState(false);
  
  const [invoiceDevice, setInvoiceDevice] = useState<Device | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const [detailsDevice, setDetailsDevice] = useState<Device | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { toasts, dismissToast, currentUser } = useApp();
  const pathname = usePathname();

  // Public routes (Customers scanning QR codes on phone boxes/invoices) bypass staff login
  const isPublicRoute = pathname?.startsWith("/verify");

  // Listen for global hotkeys: F2 (Barcode Gun), F3 (AI Copilot)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault();
        setIsScannerOpen((prev) => !prev);
      } else if (e.key === "F3") {
        e.preventDefault();
        setIsAiCopilotOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleOpenSticker = (device: Device) => {
    setStickerDevices([device]);
    setIsStickerOpen(true);
  };

  const handleOpenInvoice = (device: Device) => {
    setInvoiceDevice(device);
    setIsInvoiceOpen(true);
  };

  const handleOpenDetails = (device: Device) => {
    setDetailsDevice(device);
    setIsDetailsOpen(true);
  };

  // If user is not authenticated and not on a public verification route, show Auth Gate
  if (!currentUser && !isPublicRoute) {
    return <AuthGate />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50/60 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav
          onOpenGlobalSearch={() => setIsSearchOpen(true)}
          onOpenBarcodeScanner={() => setIsScannerOpen(true)}
          onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
        />

        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {/* Global Cmd+K Search Dialog */}
      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Global F2 Barcode Scanner Dialog */}
      <QuickBarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onOpenDeviceProfile={handleOpenDetails}
        onPrintSticker={handleOpenSticker}
        onGenerateInvoice={handleOpenInvoice}
      />

      {/* Global F3 AI Voice & Hindi Copilot Dialog */}
      <AiVoiceCopilotModal
        isOpen={isAiCopilotOpen}
        onClose={() => setIsAiCopilotOpen(false)}
        onOpenDeviceProfile={handleOpenDetails}
        onPrintSticker={handleOpenSticker}
        onGenerateInvoice={handleOpenInvoice}
      />

      {/* Global Thermal Barcode Sticker Modal (50x38mm / 50x25mm) */}
      <ThermalStickerModal
        devices={stickerDevices}
        isOpen={isStickerOpen}
        onClose={() => {
          setIsStickerOpen(false);
          setStickerDevices([]);
        }}
      />

      {/* Global Device Profile Dossier Modal */}
      <DeviceDetailsModal
        device={detailsDevice}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setDetailsDevice(null);
        }}
      />

      {/* Global GST Invoice Modal */}
      <InvoiceModal
        device={invoiceDevice}
        isOpen={isInvoiceOpen}
        onClose={() => {
          setIsInvoiceOpen(false);
          setInvoiceDevice(null);
        }}
      />

      {/* Toast notifications portal */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 p-3.5 rounded-xl shadow-lg border text-xs font-medium animate-in slide-in-from-bottom-2 fade-in duration-200 ${
              toast.type === "success"
                ? "bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200"
                : toast.type === "error"
                ? "bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
            }`}
          >
            {toast.type === "success" && (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            )}
            {toast.type === "error" && (
              <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            )}
            {toast.type === "info" && (
              <Info className="h-4 w-4 text-fundu-500 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 leading-snug">{toast.message}</div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

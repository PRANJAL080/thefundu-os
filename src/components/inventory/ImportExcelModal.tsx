"use client";

import React, { useState } from "react";
import { UploadCloud, FileSpreadsheet, Download, CheckCircle2, AlertCircle } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";

interface ImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportExcelModal({ isOpen, onClose }: ImportExcelModalProps) {
  const { addDevice, showToast } = useApp();
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Sample parsed rows preview
  const sampleImportData = [
    { brand: "Apple", model: "iPhone 15 Pro", storage: "128GB", colour: "Blue Titanium", imei1: "359182049182001", batteryHealth: 96, grade: "A+", purchasePrice: 72000, warehouse: "Mumbai Central Hub" },
    { brand: "Samsung", model: "Galaxy S23", storage: "256GB", colour: "Phantom Black", imei1: "869102948192002", batteryHealth: 91, grade: "A", purchasePrice: 38000, warehouse: "Delhi NCR Depot" },
    { brand: "OnePlus", model: "OnePlus 11 5G", storage: "128GB", colour: "Titan Black", imei1: "861928401920003", batteryHealth: 94, grade: "A", purchasePrice: 29000, warehouse: "Bengaluru Tech Park" },
  ];

  const handleDownloadTemplate = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Brand,Model,Storage,RAM,Colour,IMEI1,IMEI2,SerialNumber,BatteryHealth,Grade,PurchasePrice,SellingPrice,Warehouse,Supplier\n" +
      "Apple,iPhone 15 Pro,128GB,8GB,Natural Titanium,354928198421092,354928198421093,F2LZW88DK0P1,98,A+,74000,89999,Mumbai Central Hub,Esterline Bulk Solutions\n" +
      "Samsung,Galaxy S24 Ultra,512GB,12GB,Titanium Gray,869102948102948,869102948102949,R5CW2098KLA,99,A+,78000,97999,Mumbai Central Hub,Global Trade Tech Dubai\n" +
      "Google,Pixel 8 Pro,128GB,12GB,Bay Blue,358102948192840,358102948192841,39201FDF029,95,A,42000,53999,Bengaluru Tech Park,Recommerce Supply India\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "thefundu_inventory_bulk_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Sample inventory template downloaded!", "success");
  };

  const handleSimulatedFileUpload = () => {
    setFileName("TheFundu_Lot_November_Consignment.xlsx");
    setFileUploaded(true);
  };

  const handleConfirmImport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Add the sample devices into the store
      sampleImportData.forEach((item) => {
        addDevice({
          brand: item.brand,
          model: item.model,
          storage: item.storage,
          colour: item.colour,
          imei1: item.imei1,
          batteryHealth: item.batteryHealth,
          grade: item.grade as any,
          costs: {
            purchasePrice: item.purchasePrice,
            repairCost: 0,
            testingCost: 500,
            packagingCost: 400,
            logisticsCost: 500,
            otherCost: 200,
            totalLandedCost: item.purchasePrice + 1600,
            sellingPrice: Math.round(item.purchasePrice * 1.25),
            projectedProfit: Math.round(item.purchasePrice * 0.25) - 1600,
            profitMarginPercent: 18.5,
          },
          warehouse: item.warehouse as any,
          status: "In Stock",
        });
      });

      setIsProcessing(false);
      setFileUploaded(false);
      showToast(`Successfully imported ${sampleImportData.length} devices from Excel!`, "success");
      onClose();
    }, 1000);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Bulk Import Smartphone Inventory"
      description="Upload bulk consignment spreadsheets (.xlsx or .csv) with automatic column mapping"
      maxWidth="2xl"
    >
      <div className="space-y-5 text-xs text-slate-600 dark:text-slate-300">
        {/* Template download notice */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Need the official TheFundu CSV structure?
            </p>
            <p className="text-[11px] text-slate-400">
              Includes pre-configured headers for IMEI 1 & 2, battery health %, and cost breakdown.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadTemplate}
            className="gap-1.5 shrink-0"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Template</span>
          </Button>
        </div>

        {/* Upload Dropzone */}
        {!fileUploaded ? (
          <div
            onClick={handleSimulatedFileUpload}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:border-fundu-500 hover:bg-fundu-50/20 dark:hover:bg-fundu-950/10 cursor-pointer transition-all"
          >
            <UploadCloud className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
              Click to select or drag and drop spreadsheet
            </p>
            <p className="text-slate-400 text-[11px] mt-1">
              Supports .XLSX, .XLS, or .CSV up to 25MB (max 2,000 devices per batch)
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-emerald-900 dark:text-emerald-200 text-xs">
                    {fileName}
                  </p>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                    3 valid smartphone records identified • Ready to parse
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFileUploaded(false)}
                className="text-slate-500"
              >
                Change File
              </Button>
            </div>

            {/* Preview Table */}
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200 mb-2">
                Parsed Data Preview (First 3 Units)
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-50 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-400">
                    <tr>
                      <th className="p-2">Model</th>
                      <th className="p-2">IMEI</th>
                      <th className="p-2">Battery</th>
                      <th className="p-2">Grade</th>
                      <th className="p-2">Purchase Price</th>
                      <th className="p-2">Warehouse</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {sampleImportData.map((row, i) => (
                      <tr key={i}>
                        <td className="p-2 font-medium">{row.brand} {row.model} ({row.storage})</td>
                        <td className="p-2 font-mono">{row.imei1}</td>
                        <td className="p-2">{row.batteryHealth}%</td>
                        <td className="p-2">{row.grade}</td>
                        <td className="p-2">₹{row.purchasePrice.toLocaleString()}</td>
                        <td className="p-2">{row.warehouse}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setFileUploaded(false)}>
                Cancel
              </Button>
              <Button
                variant="fundu"
                size="sm"
                isLoading={isProcessing}
                onClick={handleConfirmImport}
              >
                Confirm & Import 3 Units
              </Button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}

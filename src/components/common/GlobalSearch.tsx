"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Smartphone,
  Truck,
  Users,
  ShoppingBag,
  ReceiptText,
  Boxes,
  ArrowRight,
  X,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const router = useRouter();
  const { devices, suppliers, customers, purchases, sales } = useApp();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Toggle search
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Recent / top items
      return {
        devices: devices.slice(0, 4),
        suppliers: suppliers.slice(0, 2),
        customers: customers.slice(0, 2),
        purchases: purchases.slice(0, 2),
        sales: sales.slice(0, 2),
      };
    }

    return {
      devices: devices.filter(
        (d) =>
          d.brand.toLowerCase().includes(q) ||
          d.model.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q) ||
          d.imei1.includes(q) ||
          (d.imei2 && d.imei2.includes(q)) ||
          d.sku.toLowerCase().includes(q)
      ),
      suppliers: suppliers.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.company.toLowerCase().includes(q) ||
          s.contactPerson.toLowerCase().includes(q)
      ),
      customers: customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email.toLowerCase().includes(q)
      ),
      purchases: purchases.filter(
        (p) =>
          p.id.toLowerCase().includes(q) ||
          p.supplierName.toLowerCase().includes(q) ||
          p.invoiceNumber.toLowerCase().includes(q)
      ),
      sales: sales.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.customerName.toLowerCase().includes(q) ||
          s.imei.includes(q)
      ),
    };
  }, [query, devices, suppliers, customers, purchases, sales]);

  if (!isOpen) return null;

  const navigateTo = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="h-5 w-5 text-slate-400 mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Search phones by model, IMEI, SKU, PO number, customer..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-4">
          {/* Phones */}
          {results.devices.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Smartphone className="h-3 w-3" /> Devices ({results.devices.length})
              </p>
              <div className="space-y-1">
                {results.devices.map((dev) => (
                  <div
                    key={dev.id}
                    onClick={() => navigateTo(`/inventory?search=${encodeURIComponent(dev.id)}`)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                        {dev.brand[0]}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {dev.brand} {dev.model} ({dev.storage}, {dev.colour})
                        </p>
                        <p className="text-[11px] text-slate-400">
                          ID: <span className="font-mono text-slate-500">{dev.id}</span> • IMEI: <span className="font-mono">{dev.imei1}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" size="sm">
                        Grade {dev.grade}
                      </Badge>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {formatINR(dev.costs.sellingPrice)}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Purchases */}
          {results.purchases.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <ShoppingBag className="h-3 w-3" /> Purchase Orders ({results.purchases.length})
              </p>
              <div className="space-y-1">
                {results.purchases.map((po) => (
                  <div
                    key={po.id}
                    onClick={() => navigateTo(`/purchases?search=${po.id}`)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {po.id} — {po.supplierName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Invoice: {po.invoiceNumber} • {po.itemsCount} units
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success" size="sm">
                        {po.paymentStatus}
                      </Badge>
                      <span className="text-xs font-semibold">
                        {formatINR(po.totalAmount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customers */}
          {results.customers.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Users className="h-3 w-3" /> Customers ({results.customers.length})
              </p>
              <div className="space-y-1">
                {results.customers.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => navigateTo(`/customers?search=${encodeURIComponent(c.name)}`)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {c.name} ({c.city})
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {c.phone} • {c.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" size="sm">
                        {c.loyaltyTier}
                      </Badge>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

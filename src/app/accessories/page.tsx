"use client";

import React, { useState } from "react";
import {
  Headphones,
  Plus,
  Search,
  BatteryCharging,
  PackageCheck,
  Shield,
  Layers,
  AlertTriangle,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Accessory } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";

export default function AccessoriesPage() {
  const { accessories, updateAccessoryStock, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAccessories = accessories.filter((acc) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      acc.name.toLowerCase().includes(q) ||
      acc.category.toLowerCase().includes(q) ||
      acc.sku.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Accessories & Packaging Kits</span>
            <Badge variant="secondary" size="sm">
              Refurb In-Box Bundles
            </Badge>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Original fast chargers, braided cables, TheFundu eco unboxing boxes, and tempered screen protectors.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="max-w-md">
            <Input
              placeholder="Search accessories by name, category, SKU..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAccessories.map((item) => {
          const isLowStock = item.stockQty <= item.reorderLevel;

          return (
            <Card key={item.id} className="hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" size="sm">
                    {item.category}
                  </Badge>
                  {isLowStock ? (
                    <Badge variant="warning" size="sm" className="gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Low Stock
                    </Badge>
                  ) : (
                    <Badge variant="success" size="sm">
                      In Stock
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-sm mt-1">{item.name}</CardTitle>
                <CardDescription className="font-mono text-[10px]">
                  SKU: {item.sku} • {item.warehouse}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-3 space-y-3 text-xs flex-1">
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400">Cost Price</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatINR(item.costPrice)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Selling Price</span>
                    <p className="font-bold text-fundu-600 dark:text-fundu-400">
                      {formatINR(item.sellingPrice)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Available Stock:</span>
                  <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {item.stockQty} Units
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Reorder Threshold:</span>
                  <span>{item.reorderLevel} Units</span>
                </div>
              </CardContent>

              <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateAccessoryStock(item.id, 25)}
                  className="h-7 text-xs"
                >
                  +25 Restock
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => updateAccessoryStock(item.id, -1)}
                  className="h-7 text-xs"
                >
                  -1 Dispatch
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

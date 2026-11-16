"use client";

import React, { useState } from "react";
import {
  Smartphone,
  Plus,
  Search,
  Filter,
  Layers,
  TrendingUp,
  Tag,
  Boxes,
  ArrowRight,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";

export default function ProductsCatalogPage() {
  const { devices } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  // Group devices into distinct Product Catalog models
  const catalogModels = [
    {
      id: "PROD-IP15PM",
      brand: "Apple",
      model: "iPhone 15 Pro Max",
      category: "Ultra-Premium Flagship",
      availableStock: devices.filter((d) => d.model.includes("iPhone 15 Pro Max") && d.status !== "Sold").length,
      avgSellingPrice: 104999,
      storageOptions: ["256GB", "512GB", "1TB"],
      demandScore: "Very High",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "PROD-S24U",
      brand: "Samsung",
      model: "Galaxy S24 Ultra",
      category: "Android Flagship",
      availableStock: devices.filter((d) => d.model.includes("S24 Ultra") && d.status !== "Sold").length,
      avgSellingPrice: 97999,
      storageOptions: ["256GB", "512GB"],
      demandScore: "High",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "PROD-IP14",
      brand: "Apple",
      model: "iPhone 14",
      category: "Mid-Premium Volume",
      availableStock: devices.filter((d) => d.model.includes("iPhone 14") && d.status !== "Sold").length,
      avgSellingPrice: 47999,
      storageOptions: ["128GB", "256GB"],
      demandScore: "Extremely High",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "PROD-IP13",
      brand: "Apple",
      model: "iPhone 13",
      category: "Best-Selling Value",
      availableStock: devices.filter((d) => d.model.includes("iPhone 13") && d.status !== "Sold").length,
      avgSellingPrice: 39999,
      storageOptions: ["128GB", "256GB"],
      demandScore: "Top Seller",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "PROD-PX8P",
      brand: "Google",
      model: "Pixel 8 Pro",
      category: "AI Photography Flagship",
      availableStock: devices.filter((d) => d.model.includes("Pixel 8 Pro") && d.status !== "Sold").length,
      avgSellingPrice: 53999,
      storageOptions: ["128GB", "256GB"],
      demandScore: "Medium-High",
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "PROD-OP12",
      brand: "OnePlus",
      model: "OnePlus 12",
      category: "Performance Flagship",
      availableStock: devices.filter((d) => d.model.includes("OnePlus 12") && d.status !== "Sold").length,
      avgSellingPrice: 49999,
      storageOptions: ["256GB", "512GB"],
      demandScore: "High",
      image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Product Model Catalog</span>
            <Badge variant="secondary" size="sm">
              Standardized SKUs
            </Badge>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Master smartphone specifications, pricing bands, and aggregate inventory availability across India hubs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {catalogModels.map((prod) => (
          <Card key={prod.id} className="overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
              <img src={prod.image} alt={prod.model} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" size="sm" className="bg-black/60 text-white border-0">
                  {prod.brand}
                </Badge>
              </div>
              <div className="absolute top-2 right-2">
                <Badge variant="success" size="sm">
                  {prod.demandScore}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4 space-y-3 text-xs flex-1">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {prod.model}
                </h3>
                <p className="text-[11px] text-slate-400">{prod.category}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <span className="text-[10px] text-slate-400">Average Refurb Price</span>
                  <p className="text-base font-bold text-fundu-600 dark:text-fundu-400">
                    {formatINR(prod.avgSellingPrice)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400">Available Units</span>
                  <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {prod.availableStock} in Stock
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {prod.storageOptions.map((st) => (
                  <span key={st} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                    {st}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

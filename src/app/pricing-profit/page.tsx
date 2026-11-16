"use client";

import React, { useState } from "react";
import {
  BadgePercent,
  TrendingUp,
  DollarSign,
  Sliders,
  Sparkles,
  Layers,
  ArrowUpRight,
  PackageCheck,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";

export default function PricingProfitPage() {
  const { devices } = useApp();

  // Pricing Calculator Simulator State
  const [calcPurchase, setCalcPurchase] = useState(42000);
  const [calcRepair, setCalcRepair] = useState(2500);
  const [calcTesting, setCalcTesting] = useState(600);
  const [calcPackaging, setCalcPackaging] = useState(450);
  const [calcLogistics, setCalcLogistics] = useState(650);
  const [calcOther, setCalcOther] = useState(300);
  const [targetMarginPercent, setTargetMarginPercent] = useState(20);

  // Calculations
  const calcTotalLanded = calcPurchase + calcRepair + calcTesting + calcPackaging + calcLogistics + calcOther;
  const suggestedSellingPrice = Math.round(calcTotalLanded / (1 - targetMarginPercent / 100));
  const calcNetProfit = suggestedSellingPrice - calcTotalLanded;

  // Aggregate stats across inventory
  const totalPurchaseSpend = devices.reduce((acc, d) => acc + (d.costs?.purchasePrice || 0), 0);
  const totalRepairSpend = devices.reduce((acc, d) => acc + (d.costs?.repairCost || 0), 0);
  const totalTestingSpend = devices.reduce((acc, d) => acc + (d.costs?.testingCost || 0), 0);
  const totalLandedSum = devices.reduce((acc, d) => acc + (d.costs?.totalLandedCost || 0), 0);
  const totalProjectedRevenue = devices.reduce((acc, d) => acc + (d.costs?.sellingPrice || 0), 0);
  const totalProjectedProfit = devices.reduce((acc, d) => acc + (d.costs?.projectedProfit || 0), 0);
  const avgMargin = totalProjectedRevenue > 0 ? ((totalProjectedProfit / totalProjectedRevenue) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Pricing & Profit Intelligence</span>
            <Badge variant="success" size="sm">
              Avg {avgMargin}% Margin
            </Badge>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Landed cost formulas, repair amortisation, dynamic price markups, and margin simulators.
          </p>
        </div>
      </div>

      {/* Aggregate Financial Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-medium text-slate-400">Total Landed Investment</span>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {formatINR(totalLandedSum)}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">All {devices.length} inventory units</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-medium text-slate-400">Target Retail Potential</span>
            <p className="text-xl font-bold text-fundu-600 dark:text-fundu-400 mt-1">
              {formatINR(totalProjectedRevenue)}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">At catalog list prices</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-medium text-slate-400">Projected Gross Profit</span>
            <p className="text-xl font-bold text-emerald-600 mt-1">
              {formatINR(totalProjectedProfit)}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">Net of refurb expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-medium text-slate-400">Average Profit Margin</span>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {avgMargin}%
            </p>
            <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">
              Exceeds 15% threshold target
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Pricing Calculator Simulator */}
      <Card className="border-fundu-200 dark:border-fundu-900">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-base flex items-center gap-2">
            <Sliders className="h-4.5 w-4.5 text-fundu-600" />
            <span>Interactive Landed Cost & Selling Price Calculator</span>
          </CardTitle>
          <CardDescription>
            Simulate margins on new refurbished smartphone procurement lots before buying
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Inputs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-xs">
            <div>
              <label className="font-semibold block mb-1">Procurement Base (₹)</label>
              <Input
                type="number"
                value={calcPurchase}
                onChange={(e) => setCalcPurchase(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Repair Allowance (₹)</label>
              <Input
                type="number"
                value={calcRepair}
                onChange={(e) => setCalcRepair(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Diagnostic Testing (₹)</label>
              <Input
                type="number"
                value={calcTesting}
                onChange={(e) => setCalcTesting(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Packaging Box (₹)</label>
              <Input
                type="number"
                value={calcPackaging}
                onChange={(e) => setCalcPackaging(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Logistics / Courier (₹)</label>
              <Input
                type="number"
                value={calcLogistics}
                onChange={(e) => setCalcLogistics(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Target Margin %</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={5}
                  max={50}
                  value={targetMarginPercent}
                  onChange={(e) => setTargetMarginPercent(Number(e.target.value))}
                />
                <span className="font-bold">%</span>
              </div>
            </div>
          </div>

          {/* Calculator Output Highlight Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Total Landed Cost
              </span>
              <p className="text-2xl font-bold mt-1">{formatINR(calcTotalLanded)}</p>
              <div className="mt-2 text-[11px] text-slate-400 space-y-0.5">
                <p>Base: {formatINR(calcPurchase)}</p>
                <p>Refurbishing & Overheads: {formatINR(calcTotalLanded - calcPurchase)}</p>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Recommended Retail Price
              </span>
              <p className="text-2xl font-bold text-fundu-400 mt-1">
                {formatINR(suggestedSellingPrice)}
              </p>
              <p className="mt-2 text-[11px] text-slate-300">
                Calibrated to deliver exact {targetMarginPercent}% gross margin.
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                Projected Net Profit
              </span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">
                {formatINR(calcNetProfit)}
              </p>
              <span className="inline-block mt-2 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                Per Handset Yield
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device-by-Device Cost Breakdown Ledger */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-sm">Active Stock Landed Cost Breakdown</CardTitle>
          <CardDescription>Individual phone unit margins and expense allocation</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200/80 dark:border-slate-800">
                <tr>
                  <th className="p-3">Device ID</th>
                  <th className="p-3">Handset Model</th>
                  <th className="p-3 text-right">Purchase</th>
                  <th className="p-3 text-right">Repair</th>
                  <th className="p-3 text-right">Testing</th>
                  <th className="p-3 text-right">Logistics & Pkg</th>
                  <th className="p-3 text-right">Total Landed</th>
                  <th className="p-3 text-right">Selling Price</th>
                  <th className="p-3 text-right">Gross Profit</th>
                  <th className="p-3 text-center">Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {devices.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    <td className="p-3 font-mono font-bold">{d.id}</td>
                    <td className="p-3 font-semibold">{d.brand} {d.model} ({d.storage})</td>
                    <td className="p-3 text-right font-medium">{formatINR(d.costs.purchasePrice)}</td>
                    <td className="p-3 text-right text-slate-500">{formatINR(d.costs.repairCost)}</td>
                    <td className="p-3 text-right text-slate-500">{formatINR(d.costs.testingCost)}</td>
                    <td className="p-3 text-right text-slate-500">{formatINR(d.costs.packagingCost + d.costs.logisticsCost)}</td>
                    <td className="p-3 text-right font-bold text-slate-900 dark:text-slate-100">{formatINR(d.costs.totalLandedCost)}</td>
                    <td className="p-3 text-right font-bold text-fundu-600 dark:text-fundu-400">{formatINR(d.costs.sellingPrice)}</td>
                    <td className="p-3 text-right font-bold text-emerald-600">{formatINR(d.costs.projectedProfit)}</td>
                    <td className="p-3 text-center">
                      <Badge variant="success" size="sm">
                        {d.costs.profitMarginPercent}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

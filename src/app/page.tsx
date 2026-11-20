"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Boxes,
  ShoppingBag,
  TrendingUp,
  ReceiptText,
  Clock,
  Wrench,
  AlertOctagon,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Sparkles,
  Plus,
  CheckCheck,
  ArrowDownToLine,
  Truck,
  ExternalLink,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDate, getGradeBadgeColor, getStatusBadgeColor } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const { devices, purchases, sales, qcInspections, repairs, dateFilter } = useApp();

  // Metrics calculation
  const totalPhonesPurchased = useMemo(() => {
    return purchases.reduce((acc, p) => acc + p.itemsCount, 0) || devices.length;
  }, [purchases, devices]);

  const totalPhonesSold = useMemo(() => {
    return sales.length;
  }, [sales]);

  const availableStock = useMemo(() => {
    return devices.filter((d) => d.status === "In Stock" || d.status === "Ready for Sale").length;
  }, [devices]);

  const reservedStock = useMemo(() => {
    return devices.filter((d) => d.status === "Reserved").length;
  }, [devices]);

  const qcPendingCount = useMemo(() => {
    return devices.filter((d) => d.status === "QC Pending").length;
  }, [devices]);

  const underRepairCount = useMemo(() => {
    return devices.filter((d) => d.status === "Under Repair").length;
  }, [devices]);

  const damagedStockCount = useMemo(() => {
    return devices.filter((d) => d.status === "Damaged").length;
  }, [devices]);

  const totalInventoryValue = useMemo(() => {
    return devices
      .filter((d) => d.status !== "Sold")
      .reduce((acc, d) => acc + (d.costs?.purchasePrice || 0), 0);
  }, [devices]);

  const monthlyRevenue = useMemo(() => {
    return sales.reduce((acc, s) => acc + (s.finalAmount || 0), 0);
  }, [sales]);

  const monthlyProfit = useMemo(() => {
    return Math.round(monthlyRevenue * 0.185);
  }, [monthlyRevenue]);

  // Chart Data: Stock Movement (Last 7 Days)
  const stockMovementData = [
    { day: "Mon", inward: 28, outward: 19 },
    { day: "Tue", inward: 35, outward: 24 },
    { day: "Wed", inward: 42, outward: 31 },
    { day: "Thu", inward: 22, outward: 28 },
    { day: "Fri", inward: 51, outward: 38 },
    { day: "Sat", inward: 45, outward: 40 },
    { day: "Sun", inward: 18, outward: 22 },
  ];

  // Chart Data: Purchase vs Sales (Monthly)
  const purchaseVsSalesData = [
    { month: "Jun", purchases: 1420000, sales: 1780000 },
    { month: "Jul", purchases: 1890000, sales: 2240000 },
    { month: "Aug", purchases: 2150000, sales: 2650000 },
    { month: "Sep", purchases: 2400000, sales: 2980000 },
    { month: "Oct", purchases: 2850000, sales: 3420000 },
    { month: "Nov (MTD)", purchases: 1950000, sales: 2450000 },
  ];

  // Brand-wise Inventory Share
  const brandData = [
    { name: "Apple", value: 58, color: "#0f172a" },
    { name: "Samsung", value: 24, color: "#0284c7" },
    { name: "OnePlus", value: 9, color: "#ea580c" },
    { name: "Google", value: 6, color: "#10b981" },
    { name: "Xiaomi & Others", value: 3, color: "#8b5cf6" },
  ];

  // Top Selling Models
  const topSellingModels = [
    { model: "iPhone 13 128GB", units: 142, revenue: 5679858, share: "28%" },
    { model: "iPhone 15 Pro Max 256GB", units: 88, revenue: 9239912, share: "21%" },
    { model: "Galaxy S24 Ultra 512GB", units: 64, revenue: 6271936, share: "17%" },
    { model: "iPhone 14 128GB", units: 59, revenue: 2831941, share: "14%" },
    { model: "OnePlus 12 256GB", units: 48, revenue: 2399952, share: "11%" },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Operations Overview
            </h1>
            <Badge variant="success" size="sm">
              Live Feed
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time refurbished smartphone inventory, quality metrics, and commerce intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/inventory/add">
            <Button variant="fundu" size="sm" className="gap-1.5 shadow-xs">
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Phone</span>
            </Button>
          </Link>
          <Link href="/stock-inward">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowDownToLine className="h-3.5 w-3.5" />
              <span>Record Inward</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 10 Core KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* 1. Total Phones Purchased */}
        <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Purchased Units
              </span>
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                <ShoppingBag className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {totalPhonesPurchased.toLocaleString()}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
                +14.2% <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Across all suppliers</p>
          </CardContent>
        </Card>

        {/* 2. Total Phones Sold */}
        <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Total Phones Sold
              </span>
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <ReceiptText className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {totalPhonesSold.toLocaleString()}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
                +19.8% <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Delivered & verified</p>
          </CardContent>
        </Card>

        {/* 3. Available Stock */}
        <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-all border-fundu-200/50 dark:border-fundu-900/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Available Stock
              </span>
              <div className="p-1.5 rounded-lg bg-fundu-50 dark:bg-fundu-950/50 text-fundu-600 dark:text-fundu-400">
                <Boxes className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-fundu-700 dark:text-fundu-300">
                {availableStock}
              </span>
              <Badge variant="success" size="sm">
                Ready
              </Badge>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Passed 13-point QC</p>
          </CardContent>
        </Card>

        {/* 4. Reserved Stock */}
        <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Reserved Stock
              </span>
              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                <Clock className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {reservedStock}
              </span>
              <span className="text-[10px] text-slate-400">Awaiting dispatch</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Customer token held</p>
          </CardContent>
        </Card>

        {/* 5. QC Pending */}
        <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                QC Pending
              </span>
              <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                <CheckCheck className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                {qcPendingCount}
              </span>
              <Badge variant="warning" size="sm">
                Action req.
              </Badge>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">In inspection bays</p>
          </CardContent>
        </Card>

        {/* 6. Under Repair */}
        <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Under Repair
              </span>
              <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                <Wrench className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {underRepairCount}
              </span>
              <span className="text-[10px] text-slate-400">Tech bays active</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Screens, batteries, flex</p>
          </CardContent>
        </Card>

        {/* 7. Damaged Stock */}
        <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Damaged Stock
              </span>
              <div className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                <AlertOctagon className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-xl font-bold text-rose-600 dark:text-rose-400">
                {damagedStockCount}
              </span>
              <Badge variant="danger" size="sm">
                Scrap / Parts
              </Badge>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Chassis / motherboard flaws</p>
          </CardContent>
        </Card>

        {/* 8. Total Inventory Value */}
        <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Inventory Value
              </span>
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {formatINR(totalInventoryValue)}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Landed cost baseline</p>
          </CardContent>
        </Card>

        {/* 9. Monthly Revenue */}
        <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-all bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Monthly Revenue
              </span>
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {formatINR(monthlyRevenue)}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
                +24.5% <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Refurb phone sales</p>
          </CardContent>
        </Card>

        {/* 10. Monthly Profit */}
        <Card className="hover:border-slate-300 dark:hover:border-slate-700 transition-all border-fundu-300/60 dark:border-fundu-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Net Profit (Est.)
              </span>
              <div className="p-1.5 rounded-lg bg-fundu-50 dark:bg-fundu-950 text-fundu-600 dark:text-fundu-400">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-lg font-bold text-fundu-700 dark:text-fundu-300">
                {formatINR(monthlyProfit)}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600">
                18.5%
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">After testing & repairs</p>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Charts (Stock Movement & Purchase vs Sales) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Movement Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Stock Movement Velocity</CardTitle>
              <CardDescription>Daily inward intake vs outward sales volume</CardDescription>
            </div>
            <Badge variant="secondary" size="sm">
              7-Day Trend
            </Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stockMovementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorInward" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorOutward" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      borderRadius: "8px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Area
                    type="monotone"
                    dataKey="inward"
                    name="Inward (Units)"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorInward)"
                  />
                  <Area
                    type="monotone"
                    dataKey="outward"
                    name="Outward (Units)"
                    stroke="#0284c7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorOutward)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Purchase vs Sales Comparison */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Purchases vs Sales Financials</CardTitle>
              <CardDescription>Monthly capital deployed vs gross sales value</CardDescription>
            </div>
            <span className="text-xs font-semibold text-fundu-600 dark:text-fundu-400">
              Avg. 22% Margin
            </span>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={purchaseVsSalesData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                  />
                  <Tooltip
                    formatter={(value: any) => formatINR(Number(value))}
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      borderRadius: "8px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Bar dataKey="purchases" name="Purchases (₹)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sales" name="Sales Revenue (₹)" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Brand Share & Top Selling Models */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Brand-Wise Donut Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Brand-Wise Inventory Share</CardTitle>
            <CardDescription>Concentration across OEM manufacturers</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={brandData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {brandData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => `${val}% of active stock`}
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      borderRadius: "8px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full mt-2 text-xs">
              {brandData.map((b) => (
                <div key={b.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: b.color }}
                    />
                    <span className="text-slate-600 dark:text-slate-400">{b.name}</span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {b.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Phone Models */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Top-Selling Phone Models</CardTitle>
              <CardDescription>Highest revenue generators in secondary market</CardDescription>
            </div>
            <Link href="/reports">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                <span>View Full Report</span>
                <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-medium">
                    <th className="pb-2.5 font-semibold">Model</th>
                    <th className="pb-2.5 font-semibold text-right">Units Sold</th>
                    <th className="pb-2.5 font-semibold text-right">Gross Revenue</th>
                    <th className="pb-2.5 font-semibold text-right">Volume Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {topSellingModels.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                      <td className="py-2.5 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">
                          {i + 1}
                        </span>
                        <span>{item.model}</span>
                      </td>
                      <td className="py-2.5 text-right font-medium text-slate-600 dark:text-slate-300">
                        {item.units}
                      </td>
                      <td className="py-2.5 text-right font-semibold text-slate-900 dark:text-slate-100">
                        {formatINR(item.revenue)}
                      </td>
                      <td className="py-2.5 text-right">
                        <Badge variant="secondary" size="sm">
                          {item.share}
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

      {/* Row 4: Recent Purchases, Recent Sales & Low Stock Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Purchases */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm">Recent Purchases</CardTitle>
              <CardDescription>Latest inbound consignments</CardDescription>
            </div>
            <Link href="/purchases">
              <ArrowUpRight className="h-4 w-4 text-slate-400 hover:text-slate-600" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {purchases.slice(0, 3).map((po) => (
              <div
                key={po.id}
                className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {po.id} — {po.supplierName}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {po.itemsCount} units • {formatDate(po.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    {formatINR(po.totalAmount)}
                  </p>
                  <Badge variant={po.paymentStatus === "Paid" ? "success" : "warning"} size="sm">
                    {po.paymentStatus}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Sales Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm">Recent Sales Orders</CardTitle>
              <CardDescription>Customer fulfillment pipeline</CardDescription>
            </div>
            <Link href="/sales">
              <ArrowUpRight className="h-4 w-4 text-slate-400 hover:text-slate-600" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {sales.slice(0, 3).map((s) => (
              <div
                key={s.id}
                className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {s.id} — {s.customerName}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[140px]">
                    {s.deviceModel}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    {formatINR(s.finalAmount)}
                  </p>
                  <Badge variant="info" size="sm">
                    {s.deliveryStatus}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Low Stock & Operational Alerts */}
        <Card className="border-amber-200/60 dark:border-amber-900/40">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                <ShieldAlert className="h-4 w-4" />
                Operational Alerts
              </CardTitle>
              <CardDescription>Attention required immediately</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/30 text-xs">
              <p className="font-semibold text-amber-900 dark:text-amber-200">
                Low Stock: iPhone 13 128GB
              </p>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                Only 1 unit remaining in Mumbai Central Hub. Reorder suggested.
              </p>
            </div>

            <div className="p-2.5 rounded-lg border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/30 text-xs">
              <p className="font-semibold text-purple-900 dark:text-purple-200">
                Parts Awaiting: iPhone 12 (REP-8822)
              </p>
              <p className="text-[11px] text-purple-700 dark:text-purple-400 mt-0.5">
                Back glass laser housing delayed from Mumbai supplier.
              </p>
            </div>

            <div className="p-2.5 rounded-lg border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30 text-xs">
              <p className="font-semibold text-blue-900 dark:text-blue-200">
                QC Queue: 18 Phones in Inward
              </p>
              <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-0.5">
                Consignment from PO-8831 ready for 13-point diagnostic intake.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

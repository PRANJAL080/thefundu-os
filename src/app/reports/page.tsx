"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Calendar,
  Download,
  TrendingUp,
  Boxes,
  ShoppingBag,
  ReceiptText,
  Wrench,
  Building2,
  Users,
  Sparkles,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TabsList, TabTrigger } from "@/components/ui/tabs";
import { formatINR } from "@/lib/utils";
import { exportGSTRule32AuditCSV } from "@/lib/exportGSTRule32";

type ReportType =
  | "stock"
  | "sales"
  | "purchases"
  | "profit"
  | "repairs"
  | "brand"
  | "warehouse"
  | "employee";

export default function ReportsAnalyticsPage() {
  const { devices, purchases, sales, repairs, warehouses, employees, dateFilter, setDateFilter, showToast } = useApp();

  const [activeReport, setActiveReport] = useState<ReportType>("stock");

  // Sample trend data for charts
  const salesTrendData = [
    { period: "Week 1", revenue: 420000, profit: 84000, units: 14 },
    { period: "Week 2", revenue: 580000, profit: 116000, units: 19 },
    { period: "Week 3", revenue: 740000, profit: 148000, units: 25 },
    { period: "Week 4", revenue: 890000, profit: 178000, units: 29 },
  ];

  const repairExpensesData = [
    { month: "Jun", screens: 45000, batteries: 18000, logicBoard: 12000 },
    { month: "Jul", screens: 52000, batteries: 22000, logicBoard: 15000 },
    { month: "Aug", screens: 48000, batteries: 24000, logicBoard: 9000 },
    { month: "Sep", screens: 61000, batteries: 29000, logicBoard: 18000 },
    { month: "Oct", screens: 72000, batteries: 34000, logicBoard: 22000 },
    { month: "Nov", screens: 54000, batteries: 26000, logicBoard: 14000 },
  ];

  const handleExportReport = () => {
    exportGSTRule32AuditCSV(devices, `TheFundu_${activeReport.toUpperCase()}_Rule32_Audit.csv`);
    showToast(`Downloaded GST Rule 32(5) GSTR-1 Margin Report for CA Audit!`, "success");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Executive Reports & Analytics</span>
            <Badge variant="fundu" size="sm">
              Enterprise BI
            </Badge>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Comprehensive audit reports across stock velocity, sales margins, repair costs, and staff throughput.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportReport}
            className="gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Report Data</span>
          </Button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabTrigger active={activeReport === "stock"} onClick={() => setActiveReport("stock")}>
            Stock Velocity
          </TabTrigger>
          <TabTrigger active={activeReport === "sales"} onClick={() => setActiveReport("sales")}>
            Sales Report
          </TabTrigger>
          <TabTrigger active={activeReport === "purchases"} onClick={() => setActiveReport("purchases")}>
            Purchases Report
          </TabTrigger>
          <TabTrigger active={activeReport === "profit"} onClick={() => setActiveReport("profit")}>
            Profit Intelligence
          </TabTrigger>
          <TabTrigger active={activeReport === "repairs"} onClick={() => setActiveReport("repairs")}>
            Repair Expenses
          </TabTrigger>
          <TabTrigger active={activeReport === "brand"} onClick={() => setActiveReport("brand")}>
            Brand-Wise
          </TabTrigger>
          <TabTrigger active={activeReport === "warehouse"} onClick={() => setActiveReport("warehouse")}>
            Warehouse Audit
          </TabTrigger>
          <TabTrigger active={activeReport === "employee"} onClick={() => setActiveReport("employee")}>
            Employee Efficiency
          </TabTrigger>
        </TabsList>
      </div>

      {/* REPORT 1: STOCK REPORT */}
      {activeReport === "stock" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily & Weekly Smartphone Stock Ledger</CardTitle>
              <CardDescription>Breakdown by Grade, Availability and Condition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="p-3 border rounded-xl">
                  <span className="text-slate-400 text-xs">Total Stocked</span>
                  <p className="text-xl font-bold mt-1">{devices.length} Units</p>
                </div>
                <div className="p-3 border rounded-xl">
                  <span className="text-slate-400 text-xs">Grade A+ / A Ratio</span>
                  <p className="text-xl font-bold text-emerald-600 mt-1">
                    {Math.round(
                      (devices.filter((d) => d.grade === "A+" || d.grade === "A").length /
                        (devices.length || 1)) *
                        100
                    )}%
                  </p>
                </div>
                <div className="p-3 border rounded-xl">
                  <span className="text-slate-400 text-xs">Apple Avg Battery Health</span>
                  <p className="text-xl font-bold text-blue-600 mt-1">
                    {(() => {
                      const appleDevices = devices.filter((d) => d.brand === "Apple" && d.batteryHealth);
                      if (appleDevices.length === 0) return "N/A";
                      const avg = Math.round(
                        appleDevices.reduce((acc, d) => acc + (d.batteryHealth || 0), 0) / appleDevices.length
                      );
                      return `${avg}%`;
                    })()}
                  </p>
                </div>
                <div className="p-3 border rounded-xl">
                  <span className="text-slate-400 text-xs">Active Value</span>
                  <p className="text-xl font-bold mt-1">
                    {formatINR(devices.reduce((acc, d) => acc + d.costs.purchasePrice, 0))}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900 font-semibold text-slate-500">
                    <tr>
                      <th className="p-3">Device Model</th>
                      <th className="p-3">Grade</th>
                      <th className="p-3">Battery</th>
                      <th className="p-3">Warehouse</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Landed Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {devices.map((d) => (
                      <tr key={d.id}>
                        <td className="p-3 font-medium">{d.brand} {d.model} ({d.storage})</td>
                        <td className="p-3 font-bold">Grade {d.grade}</td>
                        <td className="p-3">{d.batteryHealth}%</td>
                        <td className="p-3">{d.warehouse}</td>
                        <td className="p-3">{d.status}</td>
                        <td className="p-3 text-right font-semibold">{formatINR(d.costs.totalLandedCost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* REPORT 2: SALES REPORT */}
      {activeReport === "sales" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Revenue & Dispatch Realization</CardTitle>
              <CardDescription>Weekly sales volume, average order values and payment channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                    <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(val) => formatINR(Number(val))} />
                    <Area type="monotone" dataKey="revenue" name="Sales Revenue" stroke="#0d9488" fill="#0d9488" fillOpacity={0.2} />
                    <Area type="monotone" dataKey="profit" name="Gross Profit" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900 font-semibold text-slate-500">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Handset</th>
                      <th className="p-3">Payment Method</th>
                      <th className="p-3 text-right">Selling Price</th>
                      <th className="p-3 text-right">Tax (GST)</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {sales.map((s) => (
                      <tr key={s.id}>
                        <td className="p-3 font-mono font-bold">{s.id}</td>
                        <td className="p-3 font-medium">{s.customerName}</td>
                        <td className="p-3">{s.deviceModel}</td>
                        <td className="p-3">{s.paymentMethod}</td>
                        <td className="p-3 text-right font-bold">{formatINR(s.finalAmount)}</td>
                        <td className="p-3 text-right text-slate-500">{formatINR(s.taxAmount)}</td>
                        <td className="p-3 font-medium text-emerald-600">{s.deliveryStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* REPORT 3: REPAIR EXPENSES */}
      {activeReport === "repairs" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Refurbishing & Repair Cost Allocation</CardTitle>
              <CardDescription>Monthly expense spend on display replacement, battery replacement, and motherboard rework</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={repairExpensesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(val) => formatINR(Number(val))} />
                    <Legend />
                    <Bar dataKey="screens" name="Displays & Touch" fill="#0284c7" stackId="a" />
                    <Bar dataKey="batteries" name="OEM Batteries" fill="#10b981" stackId="a" />
                    <Bar dataKey="logicBoard" name="Micro-soldering & IC" fill="#8b5cf6" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* REPORT 4: EMPLOYEE PERFORMANCE */}
      {activeReport === "employee" && (
        <Card>
          <CardHeader>
            <CardTitle>Technician & Staff Efficiency Scorecard</CardTitle>
            <CardDescription>QC audits completed, repair turnaround times, and accuracy rating</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 font-semibold text-slate-500">
                  <tr>
                    <th className="p-3">Staff Member</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Warehouse Hub</th>
                    <th className="p-3 text-center">Tasks Completed</th>
                    <th className="p-3 text-right">Efficiency Score</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{emp.name}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{emp.role}</td>
                      <td className="p-3">{emp.warehouse}</td>
                      <td className="p-3 text-center font-semibold">{emp.tasksCompleted} units</td>
                      <td className="p-3 text-right font-bold text-emerald-600">{emp.efficiencyScore}%</td>
                      <td className="p-3 text-center">
                        <Badge variant="success" size="sm">{emp.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fallback for other report tabs */}
      {["purchases", "profit", "brand", "warehouse"].includes(activeReport) && (
        <Card>
          <CardHeader>
            <CardTitle className="capitalize">{activeReport} Analysis Matrix</CardTitle>
            <CardDescription>Real-time dataset calculated from active inventory ledger</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 border rounded-xl">
                <span className="text-slate-400">Total Analyzed</span>
                <p className="text-xl font-bold mt-1">{devices.length} Handsets</p>
              </div>
              <div className="p-4 border rounded-xl">
                <span className="text-slate-400">Gross Value</span>
                <p className="text-xl font-bold mt-1 text-fundu-600">
                  {formatINR(devices.reduce((acc, d) => acc + d.costs.sellingPrice, 0))}
                </p>
              </div>
              <div className="p-4 border rounded-xl">
                <span className="text-slate-400">Average Turnaround</span>
                <p className="text-xl font-bold mt-1 text-emerald-600">4.2 Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

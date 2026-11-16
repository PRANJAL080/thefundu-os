"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Receipt,
  Store,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Sparkles,
  Calculator,
  Calendar,
  Smartphone,
  Layers,
  ArrowRight,
  UserCheck,
  ShieldCheck,
  Building2,
  Lock,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { DayEndSettlement } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { formatINR, formatDate } from "@/lib/utils";
import { COMPANY_CONFIG } from "@/lib/company-config";

export default function DayEndClosingPage() {
  const { sales, devices, dayEndSettlements, recordDayEndSettlement, currentUser, showToast } = useApp();

  // Denomination counter state for actual cash
  const [denoms, setDenoms] = useState({
    c500: 40, // 40 * 500 = 20,000
    c200: 25, // 25 * 200 = 5,000
    c100: 30, // 30 * 100 = 3,000
    c50: 0,
    c20: 0,
    c10: 0,
  });

  const actualCashCounted = useMemo(() => {
    return (
      denoms.c500 * 500 +
      denoms.c200 * 200 +
      denoms.c100 * 100 +
      denoms.c50 * 50 +
      denoms.c20 * 20 +
      denoms.c10 * 10
    );
  }, [denoms]);

  // Aggregate Sales for Lucknow Store
  const salesMetrics = useMemo(() => {
    const orders = sales;
    const count = orders.length;
    const fso = orders.filter((o) => (o.channel || "FSO") === "FSO").length;
    const ons = orders.filter((o) => o.channel === "ONS").length;
    const forRepair = orders.filter((o) => o.channel === "FOR").length;
    const ds = orders.filter((o) => o.channel === "DS").length;

    let gross = 0;
    let upi = 0;
    let card = 0;
    let cash = 28000; // default cash tally from store counter

    orders.forEach((o) => {
      gross += Number(o.finalAmount) || Number(o.sellingPrice) || 0;
      if (o.paymentMethod === "UPI") {
        upi += Number(o.finalAmount) || 0;
      } else if (o.paymentMethod === "Card") {
        card += Number(o.finalAmount) || 0;
      }
    });

    if (upi === 0) upi = 45000;
    if (card === 0) card = 35000;
    if (gross === 0) gross = upi + card + cash;

    return {
      count: Math.max(count, 4),
      channelBreakdown: { FSO: Math.max(fso, 3), ONS: Math.max(ons, 1), FOR: forRepair, DS: ds },
      grossRevenue: gross,
      cashExpected: cash,
      upiTotal: upi,
      cardSwipeTotal: card,
    };
  }, [sales]);

  const cashVariance = actualCashCounted - salesMetrics.cashExpected;

  // Verification & Sign-off State
  const [closedBy, setClosedBy] = useState(`${currentUser?.name || "Abhay Verma"} (Store In-Charge)`);
  const [openedBy, setOpenedBy] = useState("Store Shift Supervisor");
  const [closingNotes, setClosingNotes] = useState("All phones physically accounted for in Lucknow Aliganj safe. Registers balanced.");
  const [physicalVerified, setPhysicalVerified] = useState(true);

  // Settlement Slip Modal
  const [activeSlip, setActiveSlip] = useState<DayEndSettlement | null>(null);

  const handleFinalizeClosing = () => {
    const settlement = recordDayEndSettlement({
      date: new Date().toISOString().split("T")[0],
      storeCode: "LKO-01",
      storeName: "Lucknow Store (Aliganj & Gomti Nagar)",
      openedBy,
      closedBy,
      totalOrdersCount: salesMetrics.count,
      channelBreakdown: salesMetrics.channelBreakdown,
      grossSalesAmount: salesMetrics.grossRevenue,
      totalDiscountGiven: 1200,
      netRevenue: salesMetrics.grossRevenue,
      cashExpected: salesMetrics.cashExpected,
      cashActualCounted: actualCashCounted,
      cashVariance,
      upiTotal: salesMetrics.upiTotal,
      cardSwipeTotal: salesMetrics.cardSwipeTotal,
      bankTransferTotal: 0,
      handsetsSold: ["Fun-26001", "Fun-26002"],
      handsetsInwardedCount: 3,
      repairsCompletedCount: 1,
      physicalStockVerified: physicalVerified,
      status: cashVariance === 0 ? "Closed & Reconciled" : "Discrepancy Flagged",
      closingNotes,
    });

    setActiveSlip(settlement);
    showToast(`Day-End Z-Report ${settlement.id} finalized and reconciled!`, "success");
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Receipt className="h-6 w-6 text-fundu-600" />
              <span>Daily Store Cash Drawer &amp; Day-End Closing</span>
            </h1>
            <Badge variant="fundu" size="sm">
              Z-Report Settlement
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Lucknow Store (LKO-01) evening register closing, physical phone stock audit, cash drawer denomination reconciliation, and management settlement slips.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1.5 py-1 px-3 text-xs">
            <Calendar className="h-3.5 w-3.5 text-fundu-600" />
            <span>Date: Sat, 14 Nov 2026</span>
          </Badge>
        </div>
      </div>

      {/* METRIC HIGHLIGHTS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 font-semibold uppercase">Total Handsets Sold Today</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
              {salesMetrics.count} Units
            </span>
            <div className="text-[10px] text-slate-500 flex gap-1.5 font-medium">
              <span>FSO: {salesMetrics.channelBreakdown.FSO}</span>
              <span>• ONS: {salesMetrics.channelBreakdown.ONS}</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 font-semibold uppercase">UPI &amp; Digital Payments</p>
          <p className="text-2xl font-bold text-fundu-600 dark:text-fundu-400 mt-1 font-mono">
            {formatINR(salesMetrics.upiTotal)}
          </p>
          <p className="text-[10px] text-slate-400">Razorpay / BharatPe QR Auto-Synced</p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 font-semibold uppercase">POS Card Swipe Machine</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono">
            {formatINR(salesMetrics.cardSwipeTotal)}
          </p>
          <p className="text-[10px] text-slate-400">HDFC PineLabs EDC Terminal</p>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 font-semibold uppercase">Total Store Revenue (Gross)</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            {formatINR(salesMetrics.grossRevenue)}
          </p>
          <p className="text-[10px] text-slate-400">Rule 32(5) Margin Schemes Active</p>
        </Card>
      </div>

      {/* TWO COLUMN GRID: Left = Cash Denominations Calculator, Right = Tally & Sign-off */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ============================================================== */}
        {/* LEFT COLUMN: Cash Drawer Currency Denomination Calculator (7 cols) */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-fundu-600" />
                  <span>Physical Cash Drawer Denomination Counter</span>
                </span>
                <span className="text-xs font-mono font-bold text-slate-600">
                  Total: {formatINR(actualCashCounted)}
                </span>
              </CardTitle>
              <CardDescription className="text-xs">
                Enter currency note counts physically counted in Lucknow Store cash drawer.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "₹500 Notes", key: "c500", mult: 500 },
                  { label: "₹200 Notes", key: "c200", mult: 200 },
                  { label: "₹100 Notes", key: "c100", mult: 100 },
                  { label: "₹50 Notes", key: "c50", mult: 50 },
                  { label: "₹20 Notes", key: "c20", mult: 20 },
                  { label: "₹10 Notes / Coins", key: "c10", mult: 10 },
                ].map((d) => {
                  const count = denoms[d.key as keyof typeof denoms];
                  const sub = count * d.mult;
                  return (
                    <div
                      key={d.key}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {d.label}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          = {formatINR(sub)}
                        </span>
                      </div>
                      <Input
                        type="number"
                        min={0}
                        value={count}
                        onChange={(e) =>
                          setDenoms({ ...denoms, [d.key]: Math.max(0, Number(e.target.value)) })
                        }
                        className="h-8 text-xs font-mono font-bold"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Variance Comparison Box */}
              <div
                className={`p-4 rounded-2xl border text-xs flex items-center justify-between transition-all ${
                  cashVariance === 0
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                    : "bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200"
                }`}
              >
                <div className="space-y-0.5">
                  <p className="font-bold text-sm flex items-center gap-1.5">
                    {cashVariance === 0 ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>Cash Drawer Reconciled (Zero Discrepancy)</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 text-rose-600" />
                        <span>Cash Variance Detected</span>
                      </>
                    )}
                  </p>
                  <p className="text-[11px] opacity-80">
                    System Expected Cash: {formatINR(salesMetrics.cashExpected)} • Physical Drawer: {formatINR(actualCashCounted)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black font-mono">
                    {cashVariance >= 0 ? `+${formatINR(cashVariance)}` : formatINR(cashVariance)}
                  </span>
                  <span className="block text-[9px] uppercase tracking-wider font-semibold opacity-75">
                    {cashVariance === 0 ? "Perfect Match" : cashVariance > 0 ? "Surplus Cash" : "Shortage"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: Physical Handset Audit & Day-End Finalization (5 cols) */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-fundu-600" />
                <span>Physical Stock Audit &amp; Sign-off</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Total System Stock:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    {devices.length} Handsets
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Store Outlet:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Lucknow Aliganj (LKO-01)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">New Inwards Today:</span>
                  <span className="font-mono text-emerald-600 font-semibold">+3 Units</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400">Repairs Dispatched:</span>
                  <span className="font-mono text-fundu-600 font-semibold">1 Unit</span>
                </div>
              </div>

              {/* Physical Verification Checkbox */}
              <label className="flex items-start gap-2 cursor-pointer p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                <input
                  type="checkbox"
                  checked={physicalVerified}
                  onChange={(e) => setPhysicalVerified(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-fundu-600"
                />
                <span className="text-[11px] text-slate-700 dark:text-slate-300 leading-tight">
                  I confirm that all physical phones on display stands and safe lockers have been counted and tally 100% with system ledger.
                </span>
              </label>

              <div>
                <label className="font-semibold block mb-1">Supervisor Closing Notes</label>
                <textarea
                  rows={2}
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs dark:border-slate-800 dark:bg-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Closed By (Manager)</label>
                  <Input
                    value={closedBy}
                    onChange={(e) => setClosedBy(e.target.value)}
                    className="h-8 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Opened By</label>
                  <Input
                    value={openedBy}
                    onChange={(e) => setOpenedBy(e.target.value)}
                    className="h-8 text-xs font-medium"
                  />
                </div>
              </div>

              <Button
                variant="fundu"
                size="lg"
                onClick={handleFinalizeClosing}
                className="w-full h-11 text-xs font-bold gap-2 shadow-md"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Finalize Day-End Closing &amp; Print Z-Report</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ============================================================== */}
      {/* HISTORICAL DAY-END SETTLEMENTS LEDGER */}
      {/* ============================================================== */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-fundu-600" />
                <span>Day-End Z-Report Settlement History</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Audited daily register closing slips and cash reconciliation records for Lucknow Store.
              </CardDescription>
            </div>
            <Badge variant="fundu" size="sm">
              {dayEndSettlements.length} Closings Logged
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Z-Report ID</th>
                <th className="p-3">Closing Date</th>
                <th className="p-3">Store</th>
                <th className="p-3 text-center">Phones Sold</th>
                <th className="p-3 text-right">Gross Sales</th>
                <th className="p-3 text-right">Cash Counted</th>
                <th className="p-3 text-right">Variance</th>
                <th className="p-3">Closed By</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {dayEndSettlements.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {s.id}
                  </td>
                  <td className="p-3 font-medium text-slate-700 dark:text-slate-300">
                    {formatDate(s.date)}
                  </td>
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                    {s.storeName} ({s.storeCode})
                  </td>
                  <td className="p-3 text-center font-mono font-bold">
                    {s.totalOrdersCount}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {formatINR(s.grossSalesAmount)}
                  </td>
                  <td className="p-3 text-right font-mono font-medium">
                    {formatINR(s.cashActualCounted)}
                  </td>
                  <td className="p-3 text-right font-mono font-bold">
                    <span
                      className={s.cashVariance === 0 ? "text-emerald-600" : "text-rose-600"}
                    >
                      {s.cashVariance >= 0 ? `+${s.cashVariance}` : s.cashVariance}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 text-[11px]">
                    {s.closedBy}
                  </td>
                  <td className="p-3 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveSlip(s)}
                      className="h-7 px-2 text-[11px] gap-1"
                    >
                      <Printer className="h-3 w-3" />
                      <span>View Z-Slip</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ============================================================== */}
      {/* PRINTABLE THERMAL Z-REPORT SLIP MODAL */}
      {/* ============================================================== */}
      {activeSlip && (
        <Dialog isOpen={Boolean(activeSlip)} onClose={() => setActiveSlip(null)} maxWidth="md">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 print:hidden">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Official Z-Report Settlement Slip
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="fundu"
                  size="sm"
                  onClick={() => window.print()}
                  className="gap-1 h-7 text-xs font-bold"
                >
                  <Printer className="h-3 w-3" />
                  <span>Print Slip</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveSlip(null)}
                  className="h-7 text-xs"
                >
                  Close
                </Button>
              </div>
            </div>

            {/* Thermal Slip Layout */}
            <div
              className="p-5 bg-white text-black font-mono text-[11px] leading-tight border-2 border-black rounded-lg max-w-sm mx-auto select-none space-y-2"
              style={{ fontFamily: "'Courier New', Courier, monospace" }}
            >
              <div className="text-center space-y-0.5 border-b border-black pb-2">
                <p className="font-bold text-sm tracking-wider uppercase">
                  ESTERLINE BONAPARTE CORP
                </p>
                <p className="text-[10px]">THEFUNDU OS • STORE CLOSING</p>
                <p className="text-[9.5px]">LUCKNOW STORE (LKO-01) - ALIGANJ</p>
                <p className="text-[9px]">CIN: {COMPANY_CONFIG.cin} | GSTIN: {COMPANY_CONFIG.gstin}</p>
                <p className="font-black text-xs pt-1">*** DAILY Z-REPORT SLIP ***</p>
              </div>

              <div className="text-[10px] space-y-0.5 border-b border-black/60 pb-1.5">
                <p>REPORT ID : {activeSlip.id}</p>
                <p>DATE      : {activeSlip.date} {new Date().toLocaleTimeString()}</p>
                <p>MANAGER   : {activeSlip.closedBy}</p>
                <p>OPENED BY : {activeSlip.openedBy}</p>
              </div>

              <div className="space-y-1 border-b border-black/60 pb-1.5 text-[10.5px]">
                <div className="flex justify-between">
                  <span>HANDSETS SOLD (FSO):</span>
                  <span className="font-bold">{activeSlip.channelBreakdown.FSO} UNITS</span>
                </div>
                <div className="flex justify-between">
                  <span>HANDSETS SOLD (ONS):</span>
                  <span>{activeSlip.channelBreakdown.ONS} UNITS</span>
                </div>
                <div className="flex justify-between">
                  <span>REPAIRS COMPLETED:</span>
                  <span>{activeSlip.repairsCompletedCount} UNITS</span>
                </div>
              </div>

              <div className="space-y-1 border-b border-black/60 pb-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span>GROSS REVENUE:</span>
                  <span className="font-bold">₹{activeSlip.grossSalesAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>UPI SETTLED:</span>
                  <span>₹{activeSlip.upiTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CARD SWIPE:</span>
                  <span>₹{activeSlip.cardSwipeTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-1 border-t border-dashed border-black">
                  <span>DRAWER CASH COUNTED:</span>
                  <span>₹{activeSlip.cashActualCounted.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CASH EXPECTED:</span>
                  <span>₹{activeSlip.cashExpected.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-black text-xs">
                  <span>VARIANCE:</span>
                  <span>
                    {activeSlip.cashVariance === 0
                      ? "₹0.00 (BALANCED)"
                      : activeSlip.cashVariance > 0
                      ? `+₹${activeSlip.cashVariance.toFixed(2)} SURPLUS`
                      : `-₹${Math.abs(activeSlip.cashVariance).toFixed(2)} SHORT`}
                  </span>
                </div>
              </div>

              <div className="text-[9.5px] space-y-1 pt-1 text-center border-t border-black">
                <p>PHYSICAL STOCK VERIFIED: {activeSlip.physicalStockVerified ? "YES (100% OK)" : "NO"}</p>
                <p className="italic">"{activeSlip.closingNotes}"</p>
                <div className="pt-6 border-b border-black w-40 mx-auto" />
                <p className="text-[8.5px] uppercase font-bold pt-1">
                  STORE MANAGER AUTHORIZED SIGNATURE
                </p>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}

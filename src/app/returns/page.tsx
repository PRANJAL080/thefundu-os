"use client";

import React, { useState } from "react";
import {
  RotateCcw,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ReceiptText,
  DollarSign,
  Wrench,
  Boxes,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { formatINR, formatDate } from "@/lib/utils";

interface ReturnRequest {
  id: string;
  orderId: string;
  customerName: string;
  deviceModel: string;
  imei: string;
  requestDate: string;
  reason: string;
  refundAmount: number;
  status: "Pending Inspection" | "Refund Approved" | "Rejected" | "Restocked" | "Sent to Repair";
}

export default function ReturnsRefundsPage() {
  const { showToast } = useApp();

  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([
    {
      id: "RMA-901",
      orderId: "SO-7710",
      customerName: "Gaurav Malhotra",
      deviceModel: "Google Pixel 8 Pro 128GB",
      imei: "358102948192840",
      requestDate: "2026-11-12",
      reason: "Customer preferred different storage tier (wants 256GB)",
      refundAmount: 52999,
      status: "Pending Inspection",
    },
    {
      id: "RMA-902",
      orderId: "SO-7698",
      customerName: "Pooja Hegde",
      deviceModel: "iPhone 13 128GB",
      imei: "359182049182041",
      requestDate: "2026-11-09",
      reason: "Haptic engine rattle reported upon receipt",
      refundAmount: 39999,
      status: "Sent to Repair",
    },
    {
      id: "RMA-903",
      orderId: "SO-7685",
      customerName: "Kavya Sundaram",
      deviceModel: "Samsung Galaxy S23 256GB",
      imei: "869102948192002",
      requestDate: "2026-11-05",
      reason: "Verified clean return within 7-day test policy",
      refundAmount: 44999,
      status: "Refund Approved",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleAction = (id: string, newStatus: ReturnRequest["status"]) => {
    setReturnRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    showToast(`RMA ${id} status updated to: ${newStatus}`, "info");
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Returns & Refunds (RMA)</span>
            <Badge variant="secondary" size="sm">
              7-Day Policy Desk
            </Badge>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Customer return inspections, 7-day money-back guarantee processing, restock verifications and refund disbursements.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="max-w-md">
            <Input
              placeholder="Search by RMA ID, customer, order ID, IMEI..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-3">RMA ID</th>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Handset & IMEI</th>
                <th className="p-3">Return Reason</th>
                <th className="p-3 text-right">Refund Value</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {returnRequests.map((rma) => (
                <tr key={rma.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">{rma.id}</td>
                  <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{rma.orderId}</td>
                  <td className="p-3 font-semibold">{rma.customerName}</td>
                  <td className="p-3">
                    <p className="font-semibold">{rma.deviceModel}</p>
                    <p className="font-mono text-[10px] text-slate-400">IMEI: {rma.imei}</p>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 max-w-xs">{rma.reason}</td>
                  <td className="p-3 text-right font-bold text-slate-900 dark:text-slate-100">
                    {formatINR(rma.refundAmount)}
                  </td>
                  <td className="p-3 text-center">
                    <Badge
                      variant={
                        rma.status === "Refund Approved"
                          ? "success"
                          : rma.status === "Pending Inspection"
                          ? "warning"
                          : "purple"
                      }
                      size="sm"
                    >
                      {rma.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {rma.status === "Pending Inspection" && (
                        <>
                          <Button
                            variant="fundu"
                            size="sm"
                            onClick={() => handleAction(rma.id, "Refund Approved")}
                            className="h-7 text-xs px-2"
                          >
                            Approve Refund
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAction(rma.id, "Sent to Repair")}
                            className="h-7 text-xs px-2"
                          >
                            Route to Repair
                          </Button>
                        </>
                      )}
                      {rma.status === "Refund Approved" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleAction(rma.id, "Restocked")}
                          className="h-7 text-xs px-2"
                        >
                          Restock in Hub
                        </Button>
                      )}
                      {rma.status === "Restocked" && (
                        <span className="text-[11px] text-emerald-600 font-semibold">Done</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

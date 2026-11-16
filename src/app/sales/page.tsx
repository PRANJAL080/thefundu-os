"use client";

import React, { useState } from "react";
import {
  ReceiptText,
  Plus,
  Search,
  Filter,
  Eye,
  FileText,
  CreditCard,
  Truck,
  RotateCcw,
  CheckCircle2,
  Clock,
  User,
  Smartphone,
  ExternalLink,
  Store,
  Layers,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { SalesOrder, SalesChannelCode, SaleTypeCode } from "@/lib/types";
import { COMPANY_CONFIG } from "@/lib/company-config";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { InvoiceModal } from "@/components/invoice/InvoiceModal";
import { formatINR, formatDate } from "@/lib/utils";

export default function SalesOrdersPage() {
  const { sales, addSale, updateSalesDeliveryStatus, devices, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [saleTypeFilter, setSaleTypeFilter] = useState("all");

  // Invoice & Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

  // New Order Form State
  const [customerName, setCustomerName] = useState("Vikrant Batra");
  const [customerPhone, setCustomerPhone] = useState("+91 98200 44109");
  const [customerAadhaar, setCustomerAadhaar] = useState("");
  const [customerEmail, setCustomerEmail] = useState("vikrant.b@gmail.com");
  const [customerAddress, setCustomerAddress] = useState("102 Sea Green, Bandra West, Mumbai 400050");
  const [deviceId, setDeviceId] = useState(devices[0]?.id || "Fun-26001");
  const [channel, setChannel] = useState<SalesChannelCode>("FSO");
  const [typeOfSale, setTypeOfSale] = useState<SaleTypeCode>("B2C");
  const [sellingPrice, setSellingPrice] = useState(64999);
  const [discount, setDiscount] = useState(1500);
  const [paymentMethod, setPaymentMethod] = useState<SalesOrder["paymentMethod"]>("UPI");

  const filteredSales = sales.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.id.toLowerCase().includes(q) ||
      (s.orderNo && s.orderNo.toLowerCase().includes(q)) ||
      (s.invoiceNumber && s.invoiceNumber.toLowerCase().includes(q)) ||
      s.customerName.toLowerCase().includes(q) ||
      s.deviceModel.toLowerCase().includes(q) ||
      s.imei.includes(q);

    const matchesDelivery = deliveryFilter === "all" || s.deliveryStatus === deliveryFilter;
    const matchesChannel = channelFilter === "all" || s.channel === channelFilter;
    const matchesSaleType = saleTypeFilter === "all" || s.typeOfSale === saleTypeFilter;

    return matchesSearch && matchesDelivery && matchesChannel && matchesSaleType;
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const dev = devices.find((d) => d.id === deviceId);
    addSale({
      channel,
      typeOfSale,
      customerName,
      customerPhone,
      customerAadhaar: customerAadhaar.trim() || undefined,
      customerEmail,
      customerAddress,
      deviceId,
      deviceModel: dev ? `${dev.brand} ${dev.model} (${dev.storage}) Refurbished ${dev.colour && dev.colour !== "Default Edition" ? dev.colour : ""}`.replace(/\s+/g, " ").trim() : "Smartphone",
      imei: dev ? dev.imei1 : "354928198421092",
      serialNumber: dev?.serialNumber || "SN26001",
      sellingPrice: Number(sellingPrice),
      discount: Number(discount),
      paymentMethod,
      paymentStatus: "Completed",
      deliveryStatus: "Packed",
      warrantyMonths: 12,
    });
    setIsNewOrderOpen(false);
  };

  const handleStatusChange = (orderId: string, status: SalesOrder["deliveryStatus"]) => {
    updateSalesDeliveryStatus(orderId, status);
  };

  const openInvoice = (order: SalesOrder) => {
    setSelectedOrder(order);
    setIsInvoiceOpen(true);
  };

  const getChannelBadge = (ch?: SalesChannelCode) => {
    const conf = COMPANY_CONFIG.channels.find((c) => c.code === ch);
    switch (ch) {
      case "FSO":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800" title="Fundu Store Outlet">FSO • Store</span>;
      case "ONS":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800" title="Online Store">ONS • Online</span>;
      case "FOR":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800" title="Fundu Outward Repair">FOR • Repair</span>;
      case "DS":
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800" title="Doorstep Direct">DS • Doorstep</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200">FSO</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Sales &amp; Customer Orders</span>
            <Badge variant="success" size="sm">
              Live Commerce
            </Badge>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Systematic order serials, sales channel routing (FSO / ONS / FOR / DS), B2C/B2B invoicing and dispatch tracking.
          </p>
        </div>

        <Button
          variant="fundu"
          size="sm"
          onClick={() => setIsNewOrderOpen(true)}
          className="gap-1.5 shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create Sales Order</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-medium text-slate-400">Total Orders</span>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {sales.length} Orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-medium text-slate-400">Gross Sales Value</span>
            <p className="text-xl font-bold text-fundu-600 dark:text-fundu-400 mt-1">
              {formatINR(sales.reduce((acc, s) => acc + s.finalAmount, 0))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-medium text-slate-400">Avg Order Value</span>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {formatINR(
                sales.length ? Math.round(sales.reduce((acc, s) => acc + s.finalAmount, 0) / sales.length) : 0
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <span className="text-[11px] font-medium text-slate-400">Primary Channel</span>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-1">
              <Store className="h-4 w-4 text-emerald-600" />
              <span>FSO (Lucknow Store)</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="w-full md:w-72">
            <Input
              placeholder="Search Order ID, invoice, handset, IMEI..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
            {/* Channel Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Channel:</span>
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="all">All Channels</option>
                <option value="FSO">FSO (Store Outlet)</option>
                <option value="ONS">ONS (Online Store)</option>
                <option value="FOR">FOR (Repair &amp; Service)</option>
                <option value="DS">DS (Doorstep Direct)</option>
              </select>
            </div>

            {/* Type of Sale Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Type:</span>
              <select
                value={saleTypeFilter}
                onChange={(e) => setSaleTypeFilter(e.target.value)}
                className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="all">All Sale Types</option>
                <option value="B2C">B2C (Retail Walk-in)</option>
                <option value="B2B">B2B (Wholesale / Dealer)</option>
                <option value="Corporate">Corporate / Fleet</option>
              </select>
            </div>

            {/* Delivery Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Status:</span>
              <select
                value={deliveryFilter}
                onChange={(e) => setDeliveryFilter(e.target.value)}
                className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="all">All Statuses</option>
                <option value="Order Placed">Order Placed</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Returned">Returned</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-3">Order &amp; Channel ID</th>
                <th className="p-3">Sales Channel</th>
                <th className="p-3">Sale Type</th>
                <th className="p-3">Customer Details</th>
                <th className="p-3">Phone Model &amp; Serial</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Selling Price</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Delivery Status</th>
                <th className="p-3 text-center">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredSales.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors"
                >
                  <td className="p-3">
                    <p className="font-mono font-bold text-slate-900 dark:text-slate-100">
                      {s.orderNo || s.id}
                    </p>
                    <p className="font-mono text-[10px] text-fundu-600 dark:text-fundu-400 font-semibold">
                      {s.invoiceNumber || `INVLKO2611-${s.id.slice(-4)}`}
                    </p>
                  </td>
                  <td className="p-3">
                    {getChannelBadge(s.channel)}
                  </td>
                  <td className="p-3">
                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {s.typeOfSale || "B2C"}
                    </span>
                  </td>
                  <td className="p-3">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {s.customerName}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {s.customerPhone}
                    </p>
                  </td>
                  <td className="p-3">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {s.deviceModel}
                    </p>
                    <p className="font-mono text-[10px] text-slate-400">
                      IMEI: {s.imei} {s.serialNumber ? `• SN: ${s.serialNumber}` : ""}
                    </p>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {formatDate(s.date)}
                  </td>
                  <td className="p-3 text-right">
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                      {formatINR(s.finalAmount)}
                    </p>
                    {s.discount > 0 && (
                      <span className="text-[10px] text-emerald-600 block">
                        Saved {formatINR(s.discount)}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" size="sm">
                        {s.paymentMethod}
                      </Badge>
                      {s.emiPlan && (
                        <span className="text-[10px] font-semibold text-indigo-600">
                          {s.emiPlan.months}m EMI
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <select
                      value={s.deliveryStatus}
                      onChange={(e) => handleStatusChange(s.id, e.target.value as any)}
                      className="text-[11px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 font-medium"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Returned">Returned</option>
                    </select>
                  </td>
                  <td className="p-3 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openInvoice(s)}
                      className="h-7 text-xs gap-1 border-fundu-300 text-fundu-700 hover:bg-fundu-50 dark:border-fundu-800 dark:text-fundu-300 dark:hover:bg-fundu-950/40"
                    >
                      <FileText className="h-3 w-3" />
                      <span>Invoice</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invoice Modal */}
      {selectedOrder && (
        <InvoiceModal
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          order={selectedOrder}
          channel={selectedOrder.channel}
          typeOfSale={selectedOrder.typeOfSale}
        />
      )}

      {/* New Sales Order Modal */}
      <Dialog
        isOpen={isNewOrderOpen}
        onClose={() => setIsNewOrderOpen(false)}
        title="Create Systematic Sales Order"
        description="Book a new handset sale across Store Outlet (FSO), Online (ONS), Repair (FOR), or Doorstep (DS)."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
          {/* Sales Channel and Type of Sale Row */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <label className="font-semibold block mb-1">Sales Channel *</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as SalesChannelCode)}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="FSO">FSO — Fundu Store Outlet (Walk-in / Counter)</option>
                <option value="ONS">ONS — Online Store (Web / App / Marketplace)</option>
                <option value="FOR">FOR — Fundu Outward Repair (Service Desk)</option>
                <option value="DS">DS — Doorstep Direct (Home Pickup / Delivery)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">Type of Sale *</label>
              <select
                value={typeOfSale}
                onChange={(e) => setTypeOfSale(e.target.value as SaleTypeCode)}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="B2C">B2C — Retail Individual Customer</option>
                <option value="B2B">B2B — Wholesale / Dealer / Stockist</option>
                <option value="Corporate">Corporate — Enterprise / Institutional Fleet</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Customer Full Name *</label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Phone Number *</label>
              <Input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Email Address *</label>
              <Input
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Customer Aadhaar No. (Optional)</label>
              <Input
                placeholder="12-digit Aadhaar UID"
                className="font-mono"
                value={customerAadhaar}
                onChange={(e) => setCustomerAadhaar(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Shipping / Delivery Address *</label>
            <Input
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Select Ready Phone from Inventory *</label>
            <select
              value={deviceId}
              onChange={(e) => {
                setDeviceId(e.target.value);
                const dev = devices.find((d) => d.id === e.target.value);
                if (dev) setSellingPrice(dev.costs.sellingPrice);
              }}
              className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              {devices
                .filter((d) => d.status !== "Sold")
                .map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.brand} {d.model} ({d.storage}) — {formatINR(d.costs.sellingPrice)} [{d.serialNumber || d.id}]
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold block mb-1">Selling Price (₹) *</label>
              <Input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Discount (₹)</label>
              <Input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="UPI">UPI (GooglePay / PhonePe / QR)</option>
                <option value="Card">Credit / Debit Card</option>
                <option value="EMI">No-Cost EMI (6m / 12m)</option>
                <option value="Bank Transfer">NEFT / RTGS / IMPS</option>
                <option value="Cash">Cash at Counter</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsNewOrderOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="fundu" size="sm">
              Complete Order &amp; Generate Invoice
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

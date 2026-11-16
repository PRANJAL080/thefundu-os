"use client";

import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  ReceiptText,
  RotateCcw,
  Eye,
  Star,
  Award,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Customer } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { formatINR, formatDate } from "@/lib/utils";

export default function CustomersPage() {
  const { customers, addCustomer, sales, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNewCustOpen, setIsNewCustOpen] = useState(false);

  // New Customer Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Mumbai");

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addCustomer({
      name,
      phone,
      email,
      city,
    });
    setIsNewCustOpen(false);
    setName("");
    setPhone("");
    setEmail("");
  };

  const openProfile = (cust: Customer) => {
    setSelectedCustomer(cust);
    setIsProfileOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Customer CRM & Warranties</span>
            <Badge variant="secondary" size="sm">
              {customers.length} Verified Buyers
            </Badge>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Client profiles, lifetime order values, active warranty tracking, and return rate scoring.
          </p>
        </div>

        <Button
          variant="fundu"
          size="sm"
          onClick={() => setIsNewCustOpen(true)}
          className="gap-1.5 shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add New Customer</span>
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="max-w-md">
            <Input
              placeholder="Search by customer name, phone, email, city..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.map((cust) => (
          <Card key={cust.id} className="hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-400 font-bold">{cust.id}</span>
                <Badge
                  variant={
                    cust.loyaltyTier === "Platinum"
                      ? "purple"
                      : cust.loyaltyTier === "Gold"
                      ? "warning"
                      : "secondary"
                  }
                  size="sm"
                >
                  {cust.loyaltyTier} Tier
                </Badge>
              </div>
              <CardTitle className="text-base mt-1 flex items-center gap-1.5">
                <span>{cust.name}</span>
              </CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-slate-400" />
                <span>{cust.city}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-3 space-y-2 text-xs flex-1">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{cust.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{cust.email}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                <div>
                  <span className="text-[10px] text-slate-400">Orders Placed</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {cust.totalOrders} purchases
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Lifetime Value</span>
                  <p className="font-bold text-fundu-600 dark:text-fundu-400">
                    {formatINR(cust.lifetimeValue)}
                  </p>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Active Warranties:</span>
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {cust.activeWarrantyCount} devices
                </span>
              </div>
            </CardContent>

            <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Last: {formatDate(cust.lastPurchaseDate)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openProfile(cust)}
                className="h-7 text-xs px-2.5 gap-1"
              >
                <Eye className="h-3 w-3" />
                <span>View Orders</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <Dialog
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          title={`Customer File: ${selectedCustomer.name}`}
          description={`ID: ${selectedCustomer.id} • ${selectedCustomer.loyaltyTier} Tier Client`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <div>
                <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                <p className="mt-1"><strong>Email:</strong> {selectedCustomer.email}</p>
                <p className="mt-1"><strong>Location:</strong> {selectedCustomer.city}</p>
              </div>
              <div>
                <p><strong>Lifetime Value:</strong> {formatINR(selectedCustomer.lifetimeValue)}</p>
                <p className="mt-1"><strong>Total Orders:</strong> {selectedCustomer.totalOrders}</p>
                <p className="mt-1"><strong>Return Rate:</strong> {selectedCustomer.returnsCount} returns</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">
                Order History & Warranty Status
              </h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 dark:bg-slate-800 font-semibold">
                    <tr>
                      <th className="p-2">Order ID</th>
                      <th className="p-2">Device</th>
                      <th className="p-2 text-right">Price</th>
                      <th className="p-2 text-center">Status</th>
                      <th className="p-2">Warranty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {sales
                      .filter((s) => s.customerName === selectedCustomer.name)
                      .map((s) => (
                        <tr key={s.id}>
                          <td className="p-2 font-mono font-bold">{s.id}</td>
                          <td className="p-2 font-medium">{s.deviceModel}</td>
                          <td className="p-2 text-right font-semibold">{formatINR(s.finalAmount)}</td>
                          <td className="p-2 text-center">
                            <Badge variant="info" size="sm">{s.deliveryStatus}</Badge>
                          </td>
                          <td className="p-2 text-emerald-600 font-semibold">
                            Exp {formatDate(s.warrantyExpiry)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsProfileOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* New Customer Modal */}
      <Dialog
        isOpen={isNewCustOpen}
        onClose={() => setIsNewCustOpen(false)}
        title="Register New Customer"
        description="Add customer record for retail or online sales"
        maxWidth="md"
      >
        <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold block mb-1">Customer Full Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="font-semibold block mb-1">Phone Number *</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div>
            <label className="font-semibold block mb-1">Email Address</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="font-semibold block mb-1">City / Region</label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsNewCustOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="fundu" size="sm">
              Register Customer
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

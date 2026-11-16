"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Truck,
  Plus,
  Search,
  Building2,
  Mail,
  Phone,
  DollarSign,
  FileText,
  Star,
  CheckCircle2,
  Eye,
  Handshake,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Supplier } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { formatINR, formatDate } from "@/lib/utils";

export default function SuppliersPage() {
  const { suppliers, addSupplier, purchases, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNewSupplierOpen, setIsNewSupplierOpen] = useState(false);

  // New Supplier Form
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");

  const filteredSuppliers = suppliers.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.company.toLowerCase().includes(q) ||
      s.contactPerson.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    );
  });

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addSupplier({
      name,
      company: company || name,
      contactPerson,
      email,
      phone,
      address,
      gstNumber,
    });
    setIsNewSupplierOpen(false);
    setName("");
  };

  const openProfile = (sup: Supplier) => {
    setSelectedSupplier(sup);
    setIsProfileOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Supplier & Vendor CRM</span>
            <Badge variant="secondary" size="sm">
              {suppliers.length} Active Partners
            </Badge>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Procurement accounts, bulk liquidation contracts, credit lines, and vendor rating scores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/vendors">
            <Button
              variant="fundu"
              size="sm"
              className="gap-1.5 shadow-xs"
            >
              <Handshake className="h-3.5 w-3.5" />
              <span>Open Full Vendor Portal (VMP)</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsNewSupplierOpen(true)}
            className="gap-1.5 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Supplier</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="max-w-md">
            <Input
              placeholder="Search by supplier name, contact person, GST..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSuppliers.map((sup) => (
          <Card key={sup.id} className="hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-400 font-bold">{sup.id}</span>
                <Badge variant={sup.status === "Active" ? "success" : "warning"} size="sm">
                  {sup.status}
                </Badge>
              </div>
              <CardTitle className="text-base mt-1">{sup.name}</CardTitle>
              <CardDescription>{sup.company}</CardDescription>
            </CardHeader>

            <CardContent className="pt-3 space-y-2 text-xs flex-1">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{sup.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{sup.phone}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                <div>
                  <span className="text-[10px] text-slate-400">Purchases</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {sup.totalPurchasesCount} orders
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Total Billed</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    {formatINR(sup.totalPurchasedValue)}
                  </p>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-xs">
                <span className="text-slate-400">Outstanding:</span>
                <span className={`font-bold ${sup.outstandingBalance > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                  {formatINR(sup.outstandingBalance)}
                </span>
              </div>
            </CardContent>

            <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span>{sup.rating} Rating</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openProfile(sup)}
                className="h-7 text-xs px-2.5 gap-1"
              >
                <Eye className="h-3 w-3" />
                <span>Profile</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Supplier Profile Modal */}
      {selectedSupplier && (
        <Dialog
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          title={`Supplier Profile: ${selectedSupplier.name}`}
          description={`ID: ${selectedSupplier.id} • ${selectedSupplier.company}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <div>
                <p><strong>Contact Person:</strong> {selectedSupplier.contactPerson}</p>
                <p className="mt-1"><strong>Email:</strong> {selectedSupplier.email}</p>
                <p className="mt-1"><strong>Phone:</strong> {selectedSupplier.phone}</p>
              </div>
              <div>
                <p><strong>GST Number:</strong> {selectedSupplier.gstNumber}</p>
                <p className="mt-1"><strong>Address:</strong> {selectedSupplier.address}</p>
                <p className="mt-1"><strong>Outstanding Balance:</strong> {formatINR(selectedSupplier.outstandingBalance)}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">
                Recent Purchase Orders Placed with Supplier
              </h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 dark:bg-slate-800 font-semibold">
                    <tr>
                      <th className="p-2">PO ID</th>
                      <th className="p-2">Date</th>
                      <th className="p-2 text-center">Units</th>
                      <th className="p-2 text-right">Amount</th>
                      <th className="p-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {purchases
                      .filter((p) => p.supplierId === selectedSupplier.id)
                      .map((p) => (
                        <tr key={p.id}>
                          <td className="p-2 font-mono font-bold">{p.id}</td>
                          <td className="p-2">{formatDate(p.date)}</td>
                          <td className="p-2 text-center">{p.itemsCount} phones</td>
                          <td className="p-2 text-right font-semibold">{formatINR(p.totalAmount)}</td>
                          <td className="p-2 text-center">
                            <Badge variant="success" size="sm">{p.paymentStatus}</Badge>
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

      {/* New Supplier Modal */}
      <Dialog
        isOpen={isNewSupplierOpen}
        onClose={() => setIsNewSupplierOpen(false)}
        title="Register New Wholesale Supplier"
        description="Add refurbished handset vendor account"
        maxWidth="md"
      >
        <form onSubmit={handleCreateSupplier} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold block mb-1">Supplier Brand Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="font-semibold block mb-1">Registered Company Name</label>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold block mb-1">Contact Person</label>
              <Input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
            </div>
            <div>
              <label className="font-semibold block mb-1">Phone Number</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="font-semibold block mb-1">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold block mb-1">GST Number</label>
              <Input value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} />
            </div>
            <div>
              <label className="font-semibold block mb-1">City / Address</label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsNewSupplierOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="fundu" size="sm">
              Save Supplier
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

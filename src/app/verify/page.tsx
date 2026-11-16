"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Battery,
  Award,
  Sparkles,
  ArrowRight,
  Smartphone,
  Store,
  FileCheck2,
  Lock,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function VerifyPortalPage() {
  const router = useRouter();
  const { devices } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchQuery.trim().replace("#", "");
    if (!clean) return;
    router.push(`/verify/${clean}`);
  };

  // Sample quick devices for testing
  const sampleSerials = [
    { label: "iPhone 15 Pro Max", serial: "SN26004", id: "Fun-26004", imei: "356642157403535" },
    { label: "iPhone 12 mini", serial: "SN26001", id: "Fun-26001", imei: "355997875777052" },
    { label: "iPhone 14 Pro", serial: "SN26012", id: "Fun-26012", imei: "359078245961126" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header / Brand Badge */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fundu-100 dark:bg-fundu-950/80 border border-fundu-200 dark:border-fundu-800 text-fundu-800 dark:text-fundu-300 text-xs font-semibold shadow-xs">
            <ShieldCheck className="h-4 w-4 text-fundu-600 dark:text-fundu-400" />
            <span>TheFundu Certified Refurbished Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-slate-50">
            Handset Verification &amp; Live Warranty
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Scan your phone box QR code or enter your 15-digit IMEI / Serial number below to view your official 42-point QC diagnostic certificate and live warranty countdown.
          </p>
        </div>

        {/* Search Box */}
        <Card className="border-2 border-fundu-500/30 shadow-xl overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Enter Serial (e.g. SN26004) or 15-digit IMEI..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 h-12 text-sm sm:text-base font-mono font-medium rounded-xl border-slate-300 dark:border-slate-700 focus:ring-fundu-500"
                  />
                </div>
                <Button
                  type="submit"
                  variant="fundu"
                  size="lg"
                  className="h-12 px-8 text-sm sm:text-base font-bold rounded-xl shadow-md gap-2"
                >
                  <span>Verify Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick Sample Test Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Quick Demo Verify:
                </span>
                {sampleSerials.map((s) => (
                  <button
                    key={s.serial}
                    type="button"
                    onClick={() => router.push(`/verify/${s.serial}`)}
                    className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-fundu-50 hover:text-fundu-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[11px] transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    {s.serial} ({s.label})
                  </button>
                ))}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center mb-3">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              180 Days Warranty
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Comprehensive hardware warranty backed by Esterline Bonaparte Corp Lucknow.
            </p>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-4">
            <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center justify-center mb-3">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              42-Point QC Certified
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Displays, TrueTone, Face ID, TrueDepth, Cameras, and all RF sensors 100% verified.
            </p>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-4">
            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center mb-3">
              <Battery className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Apple OEM Battery
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Guaranteed genuine battery health &gt; 80% with Peak Performance Capability.
            </p>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-4">
            <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center mb-3">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              CEIR &amp; Police Cleared
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              100% clean title verification on Government of India Sanchar Saathi Portal.
            </p>
          </Card>
        </div>

        {/* Store Help Banner */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-fundu-50 dark:bg-fundu-950 text-fundu-600 flex items-center justify-center shrink-0">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Lucknow Store &amp; Service Bay (LKO-01)
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ED-476, Sector-Q, Aliganj &amp; Riverside Plaza, Gomti Nagar, Lucknow, UP • Toll Free: 1800-266-3863
              </p>
            </div>
          </div>
          <Link href="/invoice">
            <Button variant="outline" size="sm" className="shrink-0 text-xs">
              Go to Invoice Desk →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

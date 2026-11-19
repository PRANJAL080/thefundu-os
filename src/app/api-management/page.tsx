"use client";

import React, { useState } from "react";
import {
  Code,
  Key,
  Copy,
  Check,
  Globe,
  ShieldCheck,
  Sparkles,
  Layers,
  Database,
  ArrowRight,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function ApiManagementPage() {
  const { showToast } = useApp();
  const [copiedKey, setCopiedKey] = useState(false);

  const mockApiKey = "tfd_live_sk_8f930219481920839481029381";

  const handleCopyKey = () => {
    navigator.clipboard.writeText(mockApiKey);
    setCopiedKey(true);
    showToast("API Key copied to clipboard!", "success");
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const endpoints = [
    {
      method: "GET",
      path: "/api/v1/inventory",
      desc: "Fetch paginated list of all devices with IMEI, grade, battery health, and warehouse location.",
    },
    {
      method: "POST",
      path: "/api/v1/inventory/device",
      desc: "Register incoming smartphone handset into OS with 13-point diagnostic checklist payload.",
    },
    {
      method: "GET",
      path: "/api/v1/inventory/device/:imei",
      desc: "Lookup individual device profile, repair log, and warranty status by 15-digit IMEI.",
    },
    {
      method: "POST",
      path: "/api/v1/orders/create",
      desc: "Dispatch and fulfill sales order, allocate serialised IMEI, and generate tax invoice.",
    },
    {
      method: "POST",
      path: "/api/v1/webhooks/qc-update",
      desc: "Trigger automated state transition when PhoneCheck or hardware tester passes a device.",
    },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>API & Webhook Management</span>
            <Badge variant="purple" size="sm">
              Developer Ecosystem
            </Badge>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Architecture ready for Phase 2 backend & database integration: manage API credentials, rate limits and sync webhooks.
          </p>
        </div>
      </div>

      {/* API Key Box */}
      <Card className="border-slate-300 dark:border-slate-700">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-sm flex items-center gap-2">
            <Key className="h-4 w-4 text-fundu-600" />
            <span>TheFundu Live REST API Secret Key</span>
          </CardTitle>
          <CardDescription>
            Authenticate external marketplace channels (Amazon Renewed, Flipkart Refurbished, TheFundu Online)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={mockApiKey}
              className="font-mono text-xs bg-slate-50 dark:bg-slate-900"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyKey}
              className="gap-1 shrink-0"
            >
              {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey ? "Copied" : "Copy Key"}</span>
            </Button>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              Environment: Production Sandboxed
            </span>
            <span>•</span>
            <span>Rate Limit: 5,000 req/min</span>
          </div>
        </CardContent>
      </Card>

      {/* Endpoints Schema */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-sm">Structured Endpoints Schema</CardTitle>
          <CardDescription>Contract definition ready for backend microservice integration</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {endpoints.map((ep, i) => (
              <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ep.method === "GET"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{ep.path}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">{ep.desc}</p>
                </div>
                <Badge variant="outline" size="sm">
                  v1.2 Spec
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

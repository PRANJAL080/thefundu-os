"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  Sparkles,
  UserCheck,
  Store,
  Wrench,
  Eye,
  EyeOff,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { COMPANY_CONFIG, INITIAL_USERS } from "@/lib/company-config";

export function AuthGate() {
  const { login } = useApp();
  const [email, setEmail] = useState("admin@thefundu.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setErrorMessage("Invalid ID / Email or Password. Please verify and try again.");
      }
      setIsLoading(false);
    }, 400);
  };

  const handleQuickLogin = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setIsLoading(true);
    setErrorMessage("");
    setTimeout(() => {
      login(userEmail, userPass);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-4 sm:p-6 text-white select-none">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-fundu-600 text-white shadow-xl shadow-fundu-600/30 ring-4 ring-fundu-500/20 mb-2">
            <Sparkles className="h-7 w-7" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-white">
              TheFundu <span className="text-fundu-400">OS</span>
            </h1>
            <Badge variant="fundu" size="sm" className="text-[10px]">
              v2.4 Enterprise
            </Badge>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            {COMPANY_CONFIG.legalName}
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            CIN: {COMPANY_CONFIG.cin} • GSTIN: {COMPANY_CONFIG.gstin}
          </p>
        </div>

        {/* Login Card */}
        <Card className="border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl rounded-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Lock className="h-4 w-4 text-fundu-400" />
                  <span>Secure Staff Login</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enter authorized credentials to access operating workspace
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1.5">
                  Email / Employee ID *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. admin@thefundu.com"
                    className="pl-9 h-10 bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 text-xs rounded-xl focus:border-fundu-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-300">
                    Password *
                  </label>
                  <span className="text-[10px] text-slate-500">
                    Default PIN: 1234
                  </span>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security password..."
                    className="pl-9 pr-10 h-10 bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 text-xs rounded-xl focus:border-fundu-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="fundu"
                size="lg"
                disabled={isLoading}
                className="w-full h-11 text-xs font-bold rounded-xl shadow-lg shadow-fundu-600/30 gap-2 mt-2"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to TheFundu OS</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Quick 1-Click Role Switcher Demo Cards */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Quick Access Login (Demo Accounts):
                </span>
                <span className="text-[10px] text-fundu-400 font-mono">1-Click</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {INITIAL_USERS.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u.email, u.password)}
                    className="p-2.5 rounded-xl border border-slate-800 bg-slate-800/60 hover:bg-slate-800 hover:border-fundu-500/50 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-[11px] group-hover:text-fundu-300">
                        {u.name.split(" ")[0]}
                      </span>
                      <span className="text-[9px] uppercase px-1 rounded font-mono font-bold bg-slate-700 text-slate-300">
                        {u.role === "admin"
                          ? "Admin"
                          : u.role === "manager"
                          ? "Manager"
                          : u.role === "cashier"
                          ? "Cashier"
                          : "Tech"}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                      {u.email}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Footer Notice */}
        <div className="text-center space-y-1 text-[11px] text-slate-500">
          <p className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>256-Bit SSL Encrypted • GST Rule 32(5) Audited Platform</span>
          </p>
          <p>
            Lucknow Corporate HQ: Sector-Q, Aliganj, Lucknow, UP 226024
          </p>
        </div>
      </div>
    </div>
  );
}

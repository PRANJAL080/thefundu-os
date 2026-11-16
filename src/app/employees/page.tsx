"use client";

import React, { useState } from "react";
import {
  UserCheck,
  Plus,
  Search,
  Mail,
  Phone,
  Building2,
  Award,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Employee, WarehouseLocation } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

export default function EmployeesPage() {
  const { employees, addEmployee, warehouses, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [isNewEmpOpen, setIsNewEmpOpen] = useState(false);

  // New Employee Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState<Employee["role"]>("QC Technician");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [warehouse, setWarehouse] = useState<WarehouseLocation>("Mumbai Central Hub");

  const filteredEmployees = employees.filter((e) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.role.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.phone.includes(q)
    );
  });

  const handleCreateEmp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    addEmployee({
      name,
      role,
      email: email || `${name.toLowerCase().replace(/\s+/g, ".")}@thefundu.com`,
      phone: phone || "+91 98000 00000",
      warehouse,
    });
    setIsNewEmpOpen(false);
    setName("");
    setEmail("");
    setPhone("");
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Staff & Engineering Personnel</span>
            <Badge variant="secondary" size="sm">
              {employees.length} Certified Technicians
            </Badge>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Internal QC engineers, hardware technicians, warehouse leads and operations executives.
          </p>
        </div>

        <Button
          variant="fundu"
          size="sm"
          onClick={() => setIsNewEmpOpen(true)}
          className="gap-1.5 shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Onboard Employee</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="max-w-md">
            <Input
              placeholder="Search by name, role, email, contact..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEmployees.map((emp) => (
          <Card key={emp.id} className="hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-400 font-bold">{emp.id}</span>
                <Badge variant="success" size="sm">
                  {emp.status}
                </Badge>
              </div>
              <CardTitle className="text-base mt-1">{emp.name}</CardTitle>
              <CardDescription className="font-semibold text-fundu-600 dark:text-fundu-400">
                {emp.role}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-3 space-y-2 text-xs flex-1">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{emp.warehouse}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{emp.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{emp.phone}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t mt-2">
                <div>
                  <span className="text-[10px] text-slate-400">Tasks Completed</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {emp.tasksCompleted} devices
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Efficiency Score</span>
                  <p className="font-bold text-emerald-600">{emp.efficiencyScore}%</p>
                </div>
              </div>
            </CardContent>

            <div className="p-3 border-t text-[11px] text-slate-400">
              Joined: {formatDate(emp.joiningDate)}
            </div>
          </Card>
        ))}
      </div>

      {/* Onboard Employee Modal */}
      <Dialog
        isOpen={isNewEmpOpen}
        onClose={() => setIsNewEmpOpen(false)}
        title="Onboard Staff / Technician"
        description="Grant user profile access in TheFundu Inventory OS"
        maxWidth="md"
      >
        <form onSubmit={handleCreateEmp} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold block mb-1">Full Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="font-semibold block mb-1">Role / Department *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="QC Technician">QC Technician (Diagnostics)</option>
              <option value="Hardware Engineer">Hardware Engineer (Repairs)</option>
              <option value="Inventory Lead">Inventory Lead (Warehousing)</option>
              <option value="Sales Manager">Sales Manager (Dispatch & B2B)</option>
              <option value="Operations Executive">Operations Executive</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold block mb-1">Work Email</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="font-semibold block mb-1">Phone</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="font-semibold block mb-1">Assigned Warehouse Hub</label>
            <select
              value={warehouse}
              onChange={(e) => setWarehouse(e.target.value as any)}
              className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              {warehouses.map((w) => (
                <option key={w.id} value={w.name}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsNewEmpOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="fundu" size="sm">
              Confirm Onboarding
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

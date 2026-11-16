"use client";

import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  AlertCircle,
  Filter,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NotificationsPage() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const [filterType, setFilterType] = useState<string>("all");

  const filteredNotifs = notifications.filter((n) => {
    if (filterType === "all") return true;
    if (filterType === "unread") return !n.read;
    return n.type === filterType;
  });

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>System Notifications & Alerts</span>
            <Badge variant="secondary" size="sm">
              Live Feed
            </Badge>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Operational alerts, stock depletion notices, QC rejections, and customer payment updates.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={markAllNotificationsAsRead}
          className="gap-1.5"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Mark All Read</span>
        </Button>
      </div>

      <div className="flex items-center gap-2 text-xs">
        {["all", "unread", "warning", "success", "info"].map((f) => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={`px-3 py-1 rounded-lg font-medium capitalize transition-all ${
              filterType === f
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "bg-white dark:bg-slate-900 border text-slate-600 dark:text-slate-400 hover:bg-slate-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredNotifs.map((notif) => (
          <Card
            key={notif.id}
            onClick={() => markNotificationAsRead(notif.id)}
            className={`cursor-pointer transition-all ${
              notif.read ? "opacity-75" : "border-slate-300 dark:border-slate-700 shadow-xs"
            }`}
          >
            <CardContent className="p-4 flex items-start gap-3">
              {notif.type === "warning" && (
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              )}
              {notif.type === "success" && (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              )}
              {notif.type === "alert" && (
                <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              )}
              {notif.type === "info" && (
                <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              )}

              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    {notif.title}
                  </h4>
                  <span className="text-[11px] text-slate-400">{notif.timestamp}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  {notif.message}
                </p>
                {!notif.read && (
                  <span className="inline-block mt-2 text-[10px] text-fundu-600 font-semibold">
                    • Unread Alert
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

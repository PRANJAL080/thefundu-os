import { Device, DeviceStatus, Warehouse } from "./types";
import { getSupabaseEnvConfig, isSupabaseReady } from "./supabase";

/**
 * Maps frontend Device model to Supabase PostgreSQL table row
 */
export function deviceToSupabaseRow(d: Device) {
  const purchasePrice = Number(d.costs?.purchasePrice) || 0;
  const sellingPrice = Number(d.costs?.sellingPrice) || 0;
  const repairCost = Number(d.costs?.repairCost) || 0;
  const testingCost = Number(d.costs?.testingCost) || 0;
  const logisticsCost = Number(d.costs?.logisticsCost) || 0;

  return {
    id: d.id,
    brand: d.brand,
    model: d.model,
    storage: d.storage || "128GB",
    ram: d.ram || null,
    colour: d.colour || "Standard",
    imei1: d.imei1 || `IMEI-${d.id}`,
    imei2: d.imei2 || null,
    serial_number: d.serialNumber || `SN-${d.id}`,
    sku: d.sku || `TFD-${d.id}`,
    battery_health: typeof d.batteryHealth === "number" ? d.batteryHealth : null,
    grade: d.grade || "A",
    status: d.status || "In Stock",
    purchase_price: purchasePrice,
    repair_cost: repairCost,
    testing_cost: testingCost,
    logistics_cost: logisticsCost,
    selling_price: sellingPrice,
    purchase_date: d.purchaseDate || new Date().toISOString().split("T")[0],
    supplier_id: d.supplierId || "SUP-001",
    warehouse_id: d.warehouse || "STR-LKO-01",
    images: Array.isArray(d.images) && d.images.length > 0 ? d.images : [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80"
    ],
    updated_at: new Date().toISOString(),
  };
}

/**
 * Maps Supabase PostgreSQL table row to frontend Device model
 */
export function supabaseRowToDevice(row: any): Device {
  const purchasePrice = Number(row.purchase_price) || 0;
  const sellingPrice = Number(row.selling_price) || 0;
  const repairCost = Number(row.repair_cost) || 0;
  const testingCost = Number(row.testing_cost) || 0;
  const logisticsCost = Number(row.logistics_cost) || 0;
  const totalLandedCost = purchasePrice + repairCost + testingCost + logisticsCost;
  const projectedProfit = sellingPrice - totalLandedCost;
  const profitMarginPercent = sellingPrice > 0 ? Math.round((projectedProfit / sellingPrice) * 100) : 0;

  return {
    id: row.id,
    brand: row.brand,
    model: row.model,
    storage: row.storage || "128GB",
    ram: row.ram || undefined,
    colour: row.colour || "Standard",
    imei1: row.imei1 || "",
    imei2: row.imei2 || undefined,
    serialNumber: row.serial_number || `SN-${row.id}`,
    sku: row.sku || `TFD-${row.id}`,
    batteryHealth: row.battery_health ? Number(row.battery_health) : undefined,
    grade: (row.grade as any) || "A",
    status: (row.status === "Sold" ? "Sold" : "In Stock") as DeviceStatus,
    warehouse: (row.warehouse_id === "STR-LKO-01" || !row.warehouse_id) ? "Lucknow Store (LKO-01)" : row.warehouse_id,
    supplierId: row.supplier_id || "SUP-001",
    supplierName: "Esterline Bulk Refurb Solutions",
    purchaseDate: row.purchase_date || new Date().toISOString().split("T")[0],
    images: Array.isArray(row.images) && row.images.length > 0 ? row.images : [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80"
    ],
    repairHistory: [],
    activityTimeline: [],
    specifications: {
      chipset: "Flagship High-Performance Processor",
      screenSize: '6.7" OLED Super Retina Display',
      cameraSpecs: "48MP Ultra-Clear + 12MP Telephoto",
      network: "5G Dual SIM VoLTE",
      osVersion: "Certified Production OS",
    },
    costs: {
      purchasePrice,
      repairCost,
      testingCost,
      packagingCost: 0,
      logisticsCost,
      otherCost: 0,
      totalLandedCost,
      sellingPrice,
      projectedProfit,
      profitMarginPercent,
    },
  };
}

/**
 * Fetch all devices currently saved in the Supabase Cloud database
 */
export async function fetchCloudDevices(): Promise<Device[] | null> {
  const env = getSupabaseEnvConfig();
  if (!isSupabaseReady(env)) return null;

  try {
    const res = await fetch(`${env.url}/rest/v1/devices?select=*&order=id.asc`, {
      method: "GET",
      headers: {
        apikey: env.anonKey,
        Authorization: `Bearer ${env.anonKey}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn("Supabase fetchCloudDevices returned", res.status, res.statusText);
      return null;
    }

    const rows = await res.json();
    if (!Array.isArray(rows)) return null;

    return rows.map(supabaseRowToDevice);
  } catch (err) {
    console.error("fetchCloudDevices error:", err);
    return null;
  }
}

/**
 * Push an array of devices to Supabase Cloud using batch UPSERT
 */
export async function upsertCloudDevices(devices: Device[]): Promise<boolean> {
  const env = getSupabaseEnvConfig();
  if (!isSupabaseReady(env) || devices.length === 0) return false;

  try {
    const rows = devices.map(deviceToSupabaseRow);

    // Upsert in batches of 50 to avoid payload size constraints
    const batchSize = 50;
    for (let i = 0; i < rows.length; i += batchSize) {
      const chunk = rows.slice(i, i + batchSize);
      const res = await fetch(`${env.url}/rest/v1/devices?on_conflict=id`, {
        method: "POST",
        headers: {
          apikey: env.anonKey,
          Authorization: `Bearer ${env.anonKey}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify(chunk),
      });

      if (!res.ok) {
        console.warn("upsertCloudDevices chunk failed:", res.status, await res.text());
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error("upsertCloudDevices error:", err);
    return false;
  }
}

/**
 * Delete a device from Supabase Cloud
 */
export async function deleteCloudDevice(id: string): Promise<boolean> {
  const env = getSupabaseEnvConfig();
  if (!isSupabaseReady(env)) return false;

  try {
    const res = await fetch(`${env.url}/rest/v1/devices?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: {
        apikey: env.anonKey,
        Authorization: `Bearer ${env.anonKey}`,
      },
    });
    return res.ok;
  } catch (err) {
    console.error("deleteCloudDevice error:", err);
    return false;
  }
}

/**
 * Fetch all warehouses/stores from Supabase Cloud
 */
export async function fetchCloudWarehouses(): Promise<Warehouse[] | null> {
  const env = getSupabaseEnvConfig();
  if (!isSupabaseReady(env)) return null;

  try {
    const res = await fetch(`${env.url}/rest/v1/warehouses?select=*&order=id.asc`, {
      method: "GET",
      headers: {
        apikey: env.anonKey,
        Authorization: `Bearer ${env.anonKey}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) return null;

    return rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      code: r.code,
      city: r.address?.includes("Lucknow") ? "Lucknow" : (r.name?.includes("Delhi") ? "Delhi" : "Lucknow"),
      location: r.address || "Gomti Nagar, Lucknow",
      address: r.address || "Gomti Nagar, Lucknow",
      managerName: r.manager_name || "Abhay Verma",
      managerPhone: r.manager_phone || "+91 79919 90508",
      totalCapacity: r.total_capacity || 2000,
      currentStockUnits: 75,
      totalStockValue: 4250000,
      underRepairUnits: 0,
      qcPendingUnits: 0,
      status: "Active",
    }));
  } catch (err) {
    console.error("fetchCloudWarehouses error:", err);
    return null;
  }
}

/**
 * Upsert a warehouse to Supabase Cloud
 */
export async function upsertCloudWarehouse(w: Warehouse): Promise<boolean> {
  const env = getSupabaseEnvConfig();
  if (!isSupabaseReady(env)) return false;

  try {
    const payload = {
      id: w.id,
      name: w.name,
      code: w.code,
      address: w.address,
      manager_name: w.managerName,
      manager_phone: w.managerPhone,
      total_capacity: w.totalCapacity || 2000,
    };

    const res = await fetch(`${env.url}/rest/v1/warehouses?on_conflict=id`, {
      method: "POST",
      headers: {
        apikey: env.anonKey,
        Authorization: `Bearer ${env.anonKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (err) {
    console.error("upsertCloudWarehouse error:", err);
    return false;
  }
}

/**
 * Intelligent Multi-Laptop Cloud Sync:
 * Combines local devices with cloud devices.
 * If local has devices not yet in cloud (e.g. Laptop 2 with 75 devices), uploads them to cloud.
 * If cloud has devices not yet in local (e.g. Laptop 1 with 64 devices), returns full set to local.
 */
export async function syncBidirectionalDevices(localDevices: Device[]): Promise<{
  devices: Device[];
  syncedToCloudCount: number;
  syncedFromCloudCount: number;
}> {
  const cloud = await fetchCloudDevices();
  if (!cloud) {
    return { devices: localDevices, syncedToCloudCount: 0, syncedFromCloudCount: 0 };
  }

  const cloudMap = new Map<string, Device>();
  cloud.forEach((d) => cloudMap.set(d.id, d));

  const localMap = new Map<string, Device>();
  localDevices.forEach((d) => localMap.set(d.id, d));

  // 1. Identify local devices missing in cloud
  const missingInCloud: Device[] = [];
  localDevices.forEach((d) => {
    if (!cloudMap.has(d.id)) {
      missingInCloud.push(d);
    }
  });

  // 2. Upload missing devices to cloud so all other laptops receive them
  let syncedToCloudCount = 0;
  if (missingInCloud.length > 0) {
    const ok = await upsertCloudDevices(missingInCloud);
    if (ok) {
      syncedToCloudCount = missingInCloud.length;
      missingInCloud.forEach((d) => cloudMap.set(d.id, d));
    }
  }

  // 3. Merge: Local authoritative Excel devices ALWAYS take precedence for costs, sellingPrice, buyPrice!
  const mergedMap = new Map<string, Device>();
  // Start with cloud devices (for custom devices added from another device)
  cloudMap.forEach((d, id) => mergedMap.set(id, d));
  // Overlay local devices: local Excel prices, costs, model, storage, imei are 100% authoritative!
  localMap.forEach((d, id) => {
    const existing = mergedMap.get(id);
    if (existing) {
      mergedMap.set(id, {
        ...existing,
        ...d,
        costs: { ...d.costs },
        sellingPrice: d.costs.sellingPrice,
        purchasePrice: d.costs.purchasePrice,
        status: (d.status === "Sold" || existing.status === "Sold") ? "Sold" : d.status,
      });
    } else {
      mergedMap.set(id, d);
    }
  });

  const merged = Array.from(mergedMap.values()).map((d) => ({
    ...d,
    status: (d.status === "Sold" ? "Sold" : "In Stock") as DeviceStatus,
    warehouse: (d.warehouse === "STR-LKO-01" || !d.warehouse) ? "Lucknow Store (LKO-01)" : d.warehouse,
  }));
  const syncedFromCloudCount = merged.length - localDevices.length;

  return {
    devices: merged,
    syncedToCloudCount,
    syncedFromCloudCount: Math.max(0, syncedFromCloudCount),
  };
}

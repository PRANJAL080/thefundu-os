import fs from "fs";
import path from "path";

const filePath = path.resolve("src/lib/store.tsx");
let txt = fs.readFileSync(filePath, "utf8");

// 1. Ensure import of COMPANY_CONFIG and sales types
if (!txt.includes("COMPANY_CONFIG")) {
  txt = txt.replace(
    'import {\n  initialDevices,',
    'import { COMPANY_CONFIG } from "./company-config";\nimport {\n  SalesChannelCode,\n  SaleTypeCode,\n} from "./types";\nimport {\n  initialDevices,'
  );
}

// 2. Bump storage keys to v5 and add sales/purchases
txt = txt.replace(
  /const STORAGE_KEYS = \{[\s\S]*?\};/,
  `const STORAGE_KEYS = {
    devices: "thefundu_devices_v5",
    repairs: "thefundu_repairs_v5",
    qcInspections: "thefundu_qc_v5",
    warehouses: "thefundu_stores_v5",
    sales: "thefundu_sales_v5",
    purchases: "thefundu_purchases_v5",
  };`
);

// 3. In hydration, clean legacy keys and hydrate sales & purchases
const oldHydratePattern = /const storedStores = localStorage\.getItem\(STORAGE_KEYS\.warehouses\);[\s\S]*?setIsHydrated\(true\);/;
const newHydrateCode = `const storedStores = localStorage.getItem(STORAGE_KEYS.warehouses);
      if (storedStores) {
        const parsed = JSON.parse(storedStores);
        if (Array.isArray(parsed) && parsed.length > 0) setWarehouses(parsed);
      }
      const storedSales = localStorage.getItem(STORAGE_KEYS.sales);
      if (storedSales) {
        const parsed = JSON.parse(storedSales);
        if (Array.isArray(parsed) && parsed.length > 0) setSales(parsed);
      }
      const storedPurchases = localStorage.getItem(STORAGE_KEYS.purchases);
      if (storedPurchases) {
        const parsed = JSON.parse(storedPurchases);
        if (Array.isArray(parsed) && parsed.length > 0) setPurchases(parsed);
      }
      // Purge old v4 caches
      try {
        localStorage.removeItem("thefundu_devices_v4");
        localStorage.removeItem("thefundu_repairs_v4");
        localStorage.removeItem("thefundu_qc_v4");
        localStorage.removeItem("thefundu_warehouses_v4");
      } catch (e) {}
    } catch (e) {
      console.warn("Could not parse cached state from localStorage", e);
    }
    setIsHydrated(true);`;

txt = txt.replace(oldHydratePattern, newHydrateCode);

// 4. Add useEffects for sales and purchases
if (!txt.includes("STORAGE_KEYS.sales")) {
  txt = txt.replace(
    'useEffect(() => {\n    if (!isHydrated || typeof window === "undefined") return;\n    try {\n      localStorage.setItem(STORAGE_KEYS.warehouses, JSON.stringify(warehouses));\n    } catch (e) {}\n  }, [warehouses, isHydrated]);',
    `useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.warehouses, JSON.stringify(warehouses));
    } catch (e) {}
  }, [warehouses, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(sales));
    } catch (e) {}
  }, [sales, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.purchases, JSON.stringify(purchases));
    } catch (e) {}
  }, [purchases, isHydrated]);`
  );
}

// 5. Update addDevice to use Fun-26000 and SN26000 and Lucknow Store
txt = txt.replace(
  /const nextNumber = 9051 \+ devices\.length;\s+const id = `TFD-2026-\$\{nextNumber\}`;/,
  `const nextNumber = 26000 + devices.length;\n    const id = \`Fun-\${nextNumber}\`;`
);
txt = txt.replace(
  /serialNumber: newDev\.serialNumber \|\| "TFD" \+ Math\.random\(\)\.toString\(36\)\.substring\(2, 9\)\.toUpperCase\(\),/,
  'serialNumber: newDev.serialNumber || `SN${nextNumber}`,'
);
txt = txt.replace(
  /warehouse: newDev\.warehouse \|\| "Mumbai Central Hub",/,
  'warehouse: newDev.warehouse || "Lucknow Store (LKO-01)",'
);
txt = txt.replace(
  /supplierName: newDev\.supplierName \|\| "Esterline Bulk Refurb Solutions",/,
  'supplierName: newDev.supplierName || "Esterline Bonaparte Corporation Private Limited",'
);
txt = txt.replace(
  /grade: newDev\.grade \|\| "A",/,
  '// Grade removed per company policy'
);

// 6. Update addSale
const oldAddSalePattern = /const addSale = \(sale: Partial<SalesOrder>\): SalesOrder => \{[\s\S]*?return fullSale;\s*\};/;
const newAddSaleCode = `const addSale = (sale: Partial<SalesOrder>): SalesOrder => {
    const channel = (sale.channel as SalesChannelCode) || "FSO";
    const typeOfSale = (sale.typeOfSale as SaleTypeCode) || "B2C";
    const seqNum = String(sales.length + 1).padStart(4, "0");
    const id = sale.id || \`TFD-\${channel}-2611-\${seqNum}\`;
    const invoiceNumber = sale.invoiceNumber || \`INVLKO2611-\${seqNum}\`;
    const channelOrderNo = sale.channelOrderNo || \`#\${channel}-LKO-2611-\${String(sales.length + 1).padStart(3, "0")}\`;
    const fullSale: SalesOrder = {
      id,
      orderNo: id,
      channelOrderNo,
      channel,
      channelName: COMPANY_CONFIG.channels.find(c => c.code === channel)?.name || "Store Outlet",
      typeOfSale,
      invoiceNumber,
      customerName: sale.customerName || "Customer",
      customerPhone: sale.customerPhone || "+91 98000 00000",
      customerEmail: sale.customerEmail || "customer@example.com",
      customerAddress: sale.customerAddress || "India",
      date: sale.date || new Date().toISOString().split("T")[0],
      deviceId: sale.deviceId || "Fun-26001",
      deviceModel: sale.deviceModel || "Smartphone",
      imei: sale.imei || "354928198421092",
      serialNumber: sale.serialNumber || (sale.deviceId ? \`SN\${sale.deviceId.replace(/\\D/g, "")}\` : "SN26001"),
      sellingPrice: sale.sellingPrice || 49999,
      discount: sale.discount || 0,
      taxAmount: Math.round(((sale.sellingPrice || 49999) - (sale.discount || 0)) * 0.18),
      finalAmount: sale.finalAmount || (sale.sellingPrice || 49999) - (sale.discount || 0),
      paymentMethod: sale.paymentMethod || "UPI",
      paymentStatus: sale.paymentStatus || "Completed",
      deliveryStatus: sale.deliveryStatus || "Packed",
      trackingNumber: \`TFD-SHIP-\${Math.floor(100000 + Math.random() * 900000)}\`,
      warrantyMonths: sale.warrantyMonths || 12,
      warrantyExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    };

    const updatedSales = [fullSale, ...sales];
    setSales(updatedSales);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(updatedSales));
      } catch (e) {}
    }

    // Update the device status to 'Sold'
    if (sale.deviceId) {
      updateDevice(sale.deviceId, { status: "Sold" });
      addStockMovement({
        type: "Outward",
        reason: "Sold",
        deviceId: sale.deviceId,
        deviceModel: fullSale.deviceModel,
        imei: fullSale.imei,
        fromLocation: "Lucknow Store (LKO-01)",
        toLocation: \`Customer (\${fullSale.customerName})\`,
        quantity: 1,
        value: fullSale.finalAmount,
        initiatedBy: "Sales Team",
        notes: \`Order \${fullSale.id} dispatched via \${fullSale.channelName}\`,
      });
    }

    showToast(\`Order \${fullSale.id} created for \${fullSale.customerName}!\`, "success");
    return fullSale;
  };`;

txt = txt.replace(oldAddSalePattern, newAddSaleCode);

// 7. Update routeDeviceToRepair with synchronous localStorage update
const oldRoutePattern = /const routeDeviceToRepair = \([\s\S]*?showToast\([\s\S]*?\);\s*\};/;
const newRouteCode = `const routeDeviceToRepair = (
    deviceId: string,
    reason: string = "Hardware diagnostic fault detected during quality inspection.",
    technicianName: string = "Karan Johar (Senior Hardware Specialist)",
    repairCost: number = 2200
  ) => {
    const targetDev = devices.find((d) => d.id === deviceId);
    if (!targetDev) return;

    const repId = \`REP-\${Math.floor(8825 + repairs.length + 1)}\`;
    const autoRepairJob: RepairJob = {
      id: repId,
      deviceId: targetDev.id,
      deviceModel: \`\${targetDev.brand} \${targetDev.model} (\${targetDev.storage})\`,
      imei: targetDev.imei1,
      technicianName,
      problemDescription: reason,
      partsReplaced: [],
      repairCost,
      status: "In Progress",
      startDate: new Date().toISOString().split("T")[0],
      beforeImages: targetDev.images || [],
      afterImages: [],
      notes: \`Directly routed to Repair Bay under technician \${technicianName}\`,
    };

    const updatedDevices = devices.map((d) =>
      d.id === targetDev.id
        ? {
            ...d,
            status: "Under Repair" as const,
            repairHistory: [...(d.repairHistory || []), autoRepairJob],
          }
        : d
    );

    const updatedRepairs = [autoRepairJob, ...repairs];

    setRepairs(updatedRepairs);
    setDevices(updatedDevices);

    // Synchronously write to localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.devices, JSON.stringify(updatedDevices));
        localStorage.setItem(STORAGE_KEYS.repairs, JSON.stringify(updatedRepairs));
      } catch (e) {}
    }

    addStockMovement({
      type: "Transfer",
      reason: "Internal Transfer (Bay)",
      deviceId: targetDev.id,
      deviceModel: \`\${targetDev.brand} \${targetDev.model}\`,
      imei: targetDev.imei1,
      fromLocation: targetDev.warehouse || "Lucknow Store (LKO-01)",
      toLocation: "Hardware Repair Bay (LKO-REP)",
      quantity: 1,
      value: targetDev.costs.purchasePrice,
      initiatedBy: "QC Diagnostic Lead",
      notes: reason,
    });

    showToast(
      \`Handset \${targetDev.id} (\${targetDev.brand} \${targetDev.model}) routed to Repair Bay! Status: Under Repair. Job: \${repId}\`,
      "info"
    );
  };`;

txt = txt.replace(oldRoutePattern, newRouteCode);

fs.writeFileSync(filePath, txt, "utf8");
console.log("Successfully updated store.tsx");

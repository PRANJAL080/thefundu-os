import fs from "fs";
import path from "path";

const filePath = path.resolve("src/lib/store.tsx");
let txt = fs.readFileSync(filePath, "utf8");

// 1. Ensure new types imported from ./types
txt = txt.replace(
  'import {\n  SalesChannelCode,\n  SaleTypeCode,\n} from "./types";',
  'import {\n  SalesChannelCode,\n  SaleTypeCode,\n  SparePart,\n  BuybackRecord,\n  DayEndSettlement,\n  WarrantyClaim,\n  UserRole,\n} from "./types";'
);

// 2. Ensure mock data additions imported
txt = txt.replace(
  'initialVendorDisputes,\n} from "./mock-data";',
  'initialVendorDisputes,\n  initialSpareParts,\n  initialBuybacks,\n  initialSettlements,\n  initialWarrantyClaims,\n} from "./mock-data";'
);

// 3. Add to AppContextType
const oldContextTypeEnd = `  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}`;

const newContextTypeAdditions = `  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // RBAC & Cashier Mode
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isCashierMode: boolean;

  // Spare Parts & Components
  spareParts: SparePart[];
  addSparePart: (part: Partial<SparePart>) => SparePart;
  updateSparePartStock: (id: string, deltaQty: number) => void;
  deductSparePartForRepair: (partId: string, repairJobId: string, deviceId: string) => void;

  // Buyback & Trade-In
  buybacks: BuybackRecord[];
  addBuyback: (buyback: Partial<BuybackRecord>, autoInwardToInventory?: boolean) => BuybackRecord;

  // Day-End Store Closing (Z-Report)
  dayEndSettlements: DayEndSettlement[];
  recordDayEndSettlement: (settlement: Partial<DayEndSettlement>) => DayEndSettlement;

  // Digital Warranty & Verification
  warrantyClaims: WarrantyClaim[];
  addWarrantyClaim: (claim: Partial<WarrantyClaim>) => WarrantyClaim;
}`;

txt = txt.replace(oldContextTypeEnd, newContextTypeAdditions);

// 4. Update STORAGE_KEYS
txt = txt.replace(
  /const STORAGE_KEYS = \{[\s\S]*?\};/,
  `const STORAGE_KEYS = {
    devices: "thefundu_devices_v5",
    repairs: "thefundu_repairs_v5",
    qcInspections: "thefundu_qc_v5",
    warehouses: "thefundu_stores_v5",
    sales: "thefundu_sales_v5",
    purchases: "thefundu_purchases_v5",
    spareParts: "thefundu_spareparts_v5",
    buybacks: "thefundu_buybacks_v5",
    settlements: "thefundu_settlements_v5",
    warrantyClaims: "thefundu_warranties_v5",
    userRole: "thefundu_user_role_v5",
  };`
);

// 5. In AppProvider state declarations
const oldStateAnchor = `  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);`;

const newStateAdditions = `  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  // RBAC State
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const isCashierMode = userRole === "cashier";

  // Spare Parts State
  const [spareParts, setSpareParts] = useState<SparePart[]>(initialSpareParts);

  // Buyback & Trade-In State
  const [buybacks, setBuybacks] = useState<BuybackRecord[]>(initialBuybacks);

  // Day-End Settlement State
  const [dayEndSettlements, setDayEndSettlements] = useState<DayEndSettlement[]>(initialSettlements);

  // Warranty Claims State
  const [warrantyClaims, setWarrantyClaims] = useState<WarrantyClaim[]>(initialWarrantyClaims);`;

txt = txt.replace(oldStateAnchor, newStateAdditions);

// 6. In hydration useEffect
const oldHydrateEnd = `// Purge old v4 caches`;
const newHydrateAdditions = `const storedParts = localStorage.getItem(STORAGE_KEYS.spareParts);
      if (storedParts) {
        const parsed = JSON.parse(storedParts);
        if (Array.isArray(parsed) && parsed.length > 0) setSpareParts(parsed);
      }
      const storedBB = localStorage.getItem(STORAGE_KEYS.buybacks);
      if (storedBB) {
        const parsed = JSON.parse(storedBB);
        if (Array.isArray(parsed) && parsed.length > 0) setBuybacks(parsed);
      }
      const storedZ = localStorage.getItem(STORAGE_KEYS.settlements);
      if (storedZ) {
        const parsed = JSON.parse(storedZ);
        if (Array.isArray(parsed) && parsed.length > 0) setDayEndSettlements(parsed);
      }
      const storedClaims = localStorage.getItem(STORAGE_KEYS.warrantyClaims);
      if (storedClaims) {
        const parsed = JSON.parse(storedClaims);
        if (Array.isArray(parsed) && parsed.length > 0) setWarrantyClaims(parsed);
      }
      const storedRole = localStorage.getItem(STORAGE_KEYS.userRole);
      if (storedRole && ["admin", "manager", "cashier", "technician"].includes(storedRole)) {
        setUserRole(storedRole as UserRole);
      }
      // Purge old v4 caches`;

txt = txt.replace(oldHydrateEnd, newHydrateAdditions);

// 7. Add useEffect persistence for new states
const oldUseEffectsAnchor = `useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.purchases, JSON.stringify(purchases));
    } catch (e) {}
  }, [purchases, isHydrated]);`;

const newUseEffects = `useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.purchases, JSON.stringify(purchases));
    } catch (e) {}
  }, [purchases, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.spareParts, JSON.stringify(spareParts));
    } catch (e) {}
  }, [spareParts, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.buybacks, JSON.stringify(buybacks));
    } catch (e) {}
  }, [buybacks, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.settlements, JSON.stringify(dayEndSettlements));
    } catch (e) {}
  }, [dayEndSettlements, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.warrantyClaims, JSON.stringify(warrantyClaims));
    } catch (e) {}
  }, [warrantyClaims, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.userRole, userRole);
    } catch (e) {}
  }, [userRole, isHydrated]);`;

txt = txt.replace(oldUseEffectsAnchor, newUseEffects);

// 8. Add implementation functions before provider return
const providerValueAnchor = `<AppContext.Provider
      value={{`;

const newActionImplementations = `  // Spare Parts Implementation
  const addSparePart = (part: Partial<SparePart>): SparePart => {
    const id = \`PRT-APL-\${String(spareParts.length + 1).padStart(3, "0")}\`;
    const fullPart: SparePart = {
      id,
      name: part.name || "Replacement Part",
      partNumber: part.partNumber || \`OEM-\${Date.now().toString().slice(-6)}\`,
      category: part.category || "Display",
      compatibleModels: part.compatibleModels || ["iPhone 13"],
      stockQuantity: Number(part.stockQuantity || 1),
      minReorderLevel: Number(part.minReorderLevel || 3),
      unitCost: Number(part.unitCost || 1000),
      sellingPrice: Number(part.sellingPrice || 1800),
      supplierName: part.supplierName || "Esterline Bonaparte Corp Hardware Sourcing",
      storeLocation: part.storeLocation || "Lucknow Store (LKO-01)",
      lastRestockedDate: new Date().toISOString().split("T")[0],
    };
    const updated = [fullPart, ...spareParts];
    setSpareParts(updated);
    if (typeof window !== "undefined") {
      try { localStorage.setItem(STORAGE_KEYS.spareParts, JSON.stringify(updated)); } catch (e) {}
    }
    showToast(\`Spare part \${fullPart.name} added to stock!\`, "success");
    return fullPart;
  };

  const updateSparePartStock = (id: string, deltaQty: number) => {
    setSpareParts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stockQuantity: Math.max(0, p.stockQuantity + deltaQty) } : p))
    );
  };

  const deductSparePartForRepair = (partId: string, repairJobId: string, deviceId: string) => {
    const targetPart = spareParts.find((p) => p.id === partId);
    if (!targetPart) return;
    if (targetPart.stockQuantity <= 0) {
      showToast(\`Insufficient stock for \${targetPart.name}!\`, "error");
      return;
    }

    // Deduct stock
    setSpareParts((prev) =>
      prev.map((p) => (p.id === partId ? { ...p, stockQuantity: p.stockQuantity - 1 } : p))
    );

    // Update repair job
    setRepairs((prev) =>
      prev.map((r) =>
        r.id === repairJobId
          ? {
              ...r,
              partsReplaced: [...(r.partsReplaced || []), targetPart.name],
              repairCost: (r.repairCost || 0) + targetPart.unitCost,
            }
          : r
      )
    );

    // Update device costs
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === deviceId) {
          const newRepairCost = (d.costs.repairCost || 0) + targetPart.unitCost;
          const newTotalLanded = d.costs.purchasePrice + newRepairCost + (d.costs.testingCost || 500) + (d.costs.packagingCost || 400) + (d.costs.logisticsCost || 500) + (d.costs.otherCost || 200);
          return {
            ...d,
            costs: {
              ...d.costs,
              repairCost: newRepairCost,
              totalLandedCost: newTotalLanded,
            },
          };
        }
        return d;
      })
    );

    showToast(\`Installed \${targetPart.name} (-1 from stock, added \${targetPart.unitCost} to repair cost)\`, "info");
  };

  // Buyback Implementation
  const addBuyback = (buyback: Partial<BuybackRecord>, autoInwardToInventory: boolean = true): BuybackRecord => {
    const id = \`BB-LKO-2611-\${String(buybacks.length + 1).padStart(3, "0")}\`;
    const fullBB: BuybackRecord = {
      id,
      date: buyback.date || new Date().toISOString().split("T")[0],
      brand: buyback.brand || "Apple",
      model: buyback.model || "iPhone 13",
      storage: buyback.storage || "128GB",
      colour: buyback.colour || "Midnight",
      imei1: buyback.imei1 || "35" + Math.floor(1000000000000 + Math.random() * 9000000000000),
      imei2: buyback.imei2,
      serialNumber: buyback.serialNumber || \`SNBB-\${2600 + buybacks.length + 1}\`,
      batteryHealth: buyback.batteryHealth || 85,
      screenCondition: buyback.screenCondition || "Flawless",
      bodyCondition: buyback.bodyCondition || "Flawless",
      functionalIssues: buyback.functionalIssues || [],
      hasOriginalBox: buyback.hasOriginalBox !== false,
      hasOriginalBill: buyback.hasOriginalBill !== false,
      baseMarketValue: Number(buyback.baseMarketValue || 30000),
      deductionsTotal: Number(buyback.deductionsTotal || 3000),
      finalOfferedPrice: Number(buyback.finalOfferedPrice || 27000),
      payoutStatus: buyback.payoutStatus || "Completed",
      payoutMethod: buyback.payoutMethod || "UPI",
      sellerName: buyback.sellerName || "Walk-in Customer",
      sellerPhone: buyback.sellerPhone || "+91 98000 00000",
      sellerIdType: buyback.sellerIdType || "Aadhaar",
      sellerIdNumber: buyback.sellerIdNumber || "XXXX-XXXX-1234",
      policeVerificationStatus: "Cleared",
      ceirStatus: "Clean",
      ownershipDeclarationSigned: true,
      evaluatedBy: buyback.evaluatedBy || "Abhay Verma (Store Manager)",
      storeLocation: buyback.storeLocation || "Lucknow Store (LKO-01)",
    };

    if (autoInwardToInventory) {
      const newDev = addDevice({
        brand: fullBB.brand,
        model: fullBB.model,
        storage: fullBB.storage,
        colour: fullBB.colour,
        imei1: fullBB.imei1,
        imei2: fullBB.imei2,
        batteryHealth: fullBB.batteryHealth,
        status: "QC Pending",
        warehouse: fullBB.storeLocation,
        supplierName: \`Customer Buyback (\${fullBB.sellerName})\`,
        costs: {
          purchasePrice: fullBB.finalOfferedPrice,
          repairCost: 0,
          testingCost: 500,
          packagingCost: 400,
          logisticsCost: 200,
          otherCost: 200,
          totalLandedCost: fullBB.finalOfferedPrice + 1300,
          sellingPrice: Math.round(fullBB.finalOfferedPrice * 1.25),
          projectedProfit: Math.round(fullBB.finalOfferedPrice * 0.25) - 1300,
          profitMarginPercent: 20,
        },
      });
      fullBB.inwardDeviceId = newDev.id;
    }

    const updated = [fullBB, ...buybacks];
    setBuybacks(updated);
    if (typeof window !== "undefined") {
      try { localStorage.setItem(STORAGE_KEYS.buybacks, JSON.stringify(updated)); } catch (e) {}
    }
    showToast(\`Buyback agreement \${fullBB.id} signed & inwarded to Lucknow Store!\`, "success");
    return fullBB;
  };

  // Day-End Settlement Implementation
  const recordDayEndSettlement = (settlement: Partial<DayEndSettlement>): DayEndSettlement => {
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const id = settlement.id || \`Z-LKO-\${todayStr}\`;
    const fullZ: DayEndSettlement = {
      id,
      date: settlement.date || new Date().toISOString().split("T")[0],
      storeCode: settlement.storeCode || "LKO-01",
      storeName: settlement.storeName || "Lucknow Store (LKO-01)",
      openedBy: settlement.openedBy || "Abhay Verma (Store Manager)",
      closedBy: settlement.closedBy || "Vikram Singhania (VP Ops)",
      totalOrdersCount: Number(settlement.totalOrdersCount || sales.length),
      channelBreakdown: settlement.channelBreakdown || {
        FSO: sales.filter((s) => s.channel === "FSO").length,
        ONS: sales.filter((s) => s.channel === "ONS").length,
        FOR: sales.filter((s) => s.channel === "FOR").length,
        DS: sales.filter((s) => s.channel === "DS").length,
      },
      grossSalesAmount: Number(settlement.grossSalesAmount || sales.reduce((a, s) => a + s.finalAmount, 0)),
      totalDiscountGiven: Number(settlement.totalDiscountGiven || sales.reduce((a, s) => a + s.discount, 0)),
      netRevenue: Number(settlement.netRevenue || sales.reduce((a, s) => a + s.finalAmount, 0)),
      cashExpected: Number(settlement.cashExpected || 0),
      cashActualCounted: Number(settlement.cashActualCounted || settlement.cashExpected || 0),
      cashVariance: Number(settlement.cashVariance || 0),
      upiTotal: Number(settlement.upiTotal || 0),
      cardSwipeTotal: Number(settlement.cardSwipeTotal || 0),
      bankTransferTotal: Number(settlement.bankTransferTotal || 0),
      handsetsSold: settlement.handsetsSold || sales.map((s) => s.deviceId),
      handsetsInwardedCount: Number(settlement.handsetsInwardedCount || devices.length),
      repairsCompletedCount: Number(settlement.repairsCompletedCount || repairs.filter((r) => r.status === "Quality Passed").length),
      physicalStockVerified: true,
      status: settlement.cashVariance && settlement.cashVariance !== 0 ? "Discrepancy Flagged" : "Closed & Reconciled",
      closingNotes: settlement.closingNotes || "Store closed and reconciled for the day.",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    };

    const updated = [fullZ, ...dayEndSettlements];
    setDayEndSettlements(updated);
    if (typeof window !== "undefined") {
      try { localStorage.setItem(STORAGE_KEYS.settlements, JSON.stringify(updated)); } catch (e) {}
    }
    showToast(\`Day-End Z-Report \${fullZ.id} finalized for Lucknow Store!\`, "success");
    return fullZ;
  };

  // Warranty Claim Implementation
  const addWarrantyClaim = (claim: Partial<WarrantyClaim>): WarrantyClaim => {
    const id = \`CLM-\${Date.now().toString().slice(-5)}\`;
    const fullClaim: WarrantyClaim = {
      id,
      deviceId: claim.deviceId || "",
      serialNumber: claim.serialNumber || "",
      customerName: claim.customerName || "Customer",
      customerPhone: claim.customerPhone || "+91 98000 00000",
      issueDescription: claim.issueDescription || "Warranty service requested",
      claimDate: new Date().toISOString().split("T")[0],
      warrantyStatus: claim.warrantyStatus || "Active",
      status: "Submitted",
      assignedTechnician: "Karan Johar",
    };
    const updated = [fullClaim, ...warrantyClaims];
    setWarrantyClaims(updated);
    if (typeof window !== "undefined") {
      try { localStorage.setItem(STORAGE_KEYS.warrantyClaims, JSON.stringify(updated)); } catch (e) {}
    }
    showToast(\`Warranty claim \${fullClaim.id} registered!\`, "success");
    return fullClaim;
  };

  <AppContext.Provider
      value={{`;

txt = txt.replace(providerValueAnchor, newActionImplementations);

// 9. Add new values to Provider value prop
const oldProviderValueEnd = `        markNotificationAsRead,
        markAllNotificationsAsRead,
      }}`;

const newProviderValueAdditions = `        markNotificationAsRead,
        markAllNotificationsAsRead,

        // RBAC
        userRole,
        setUserRole,
        isCashierMode,

        // Spare Parts
        spareParts,
        addSparePart,
        updateSparePartStock,
        deductSparePartForRepair,

        // Buyback
        buybacks,
        addBuyback,

        // Day-End Closing
        dayEndSettlements,
        recordDayEndSettlement,

        // Warranty
        warrantyClaims,
        addWarrantyClaim,
      }}`;

txt = txt.replace(oldProviderValueEnd, newProviderValueAdditions);

fs.writeFileSync(filePath, txt, "utf8");
console.log("Successfully updated store.tsx with all 6 modules!");

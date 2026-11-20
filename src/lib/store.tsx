"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  Device,
  DeviceStatus,
  PurchaseOrder,
  SalesOrder,
  StockMovement,
  QCInspection,
  RepairJob,
  Supplier,
  Customer,
  Warehouse,
  Accessory,
  Employee,
  AppNotification,
  WarehouseLocation,
  VendorConsignment,
  VendorPayout,
  VendorDispute,
  UserProfile,
  InvoiceSettings,
  SalesChannelCode,
  SaleTypeCode,
  SparePart,
  BuybackRecord,
  DayEndSettlement,
  WarrantyClaim,
  UserRole,
} from "./types";
import {
  COMPANY_CONFIG,
  DEFAULT_INVOICE_TERMS,
  DEFAULT_ROLE_PERMISSIONS,
  INITIAL_USERS,
} from "./company-config";
import {
  initialDevices,
  initialPurchases,
  initialSales,
  initialStockMovements,
  initialQCInspections,
  initialRepairs,
  initialSuppliers,
  initialCustomers,
  initialWarehouses,
  initialAccessories,
  initialEmployees,
  initialNotifications,
  initialVendorConsignments,
  initialVendorPayouts,
  initialVendorDisputes,
  initialSpareParts,
  initialBuybacks,
  initialSettlements,
  initialWarrantyClaims,
} from "./mock-data";
import {
  fetchCloudDevices,
  upsertCloudDevices,
  deleteCloudDevice,
  fetchCloudWarehouses,
  upsertCloudWarehouse,
  syncBidirectionalDevices,
} from "./supabaseSync";

export type DateFilterType = "today" | "7d" | "30d" | "this_month" | "custom";

interface ToastNotification {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface AppContextType {
  // State
  devices: Device[];
  purchases: PurchaseOrder[];
  sales: SalesOrder[];
  stockMovements: StockMovement[];
  qcInspections: QCInspection[];
  repairs: RepairJob[];
  suppliers: Supplier[];
  vendorConsignments: VendorConsignment[];
  vendorPayouts: VendorPayout[];
  vendorDisputes: VendorDispute[];
  customers: Customer[];
  warehouses: Warehouse[];
  stores: Warehouse[];
  accessories: Accessory[];
  employees: Employee[];
  notifications: AppNotification[];
  dateFilter: DateFilterType;
  globalSearch: string;
  isSidebarCollapsed: boolean;
  theme: "light" | "dark";
  toasts: ToastNotification[];

  // Setters & Actions
  setDateFilter: (filter: DateFilterType) => void;
  setGlobalSearch: (q: string) => void;
  setIsSidebarCollapsed: (v: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (t: "light" | "dark") => void;
  toggleTheme: () => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  dismissToast: (id: string) => void;

  // CRUD Actions
  addDevice: (device: Partial<Device>) => Device;
  updateDevice: (id: string, updates: Partial<Device>) => void;
  deleteDevice: (id: string) => void;
  setAllDevicesInStock: () => void;

  addPurchase: (purchase: Partial<PurchaseOrder>) => PurchaseOrder;
  addSale: (sale: Partial<SalesOrder>) => SalesOrder;
  deleteSale: (id: string) => void;
  clearAllSales: () => void;
  recoverAllSales: () => number;
  updateSalesDeliveryStatus: (id: string, status: SalesOrder["deliveryStatus"]) => void;

  addStockMovement: (movement: Partial<StockMovement>) => void;
  submitQCInspection: (qc: Partial<QCInspection>) => void;
  routeDeviceToRepair: (deviceId: string, reason?: string, technicianName?: string, repairCost?: number) => void;
  addRepairJob: (repair: Partial<RepairJob>) => void;
  updateRepairJob: (id: string, updates: Partial<RepairJob>) => void;

  transferWarehouseStock: (deviceId: string, targetWarehouse: WarehouseLocation, notes?: string) => void;
  addStore: (store: Partial<Warehouse>) => Warehouse;
  addSupplier: (supplier: Partial<Supplier>) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  addVendorConsignment: (consignment: Partial<VendorConsignment>) => void;
  updateVendorConsignmentStatus: (id: string, status: VendorConsignment["settlementStatus"]) => void;
  recordVendorPayout: (payout: Partial<VendorPayout>) => void;
  addVendorDispute: (dispute: Partial<VendorDispute>) => void;
  updateVendorDisputeStatus: (id: string, status: VendorDispute["status"]) => void;
  addCustomer: (customer: Partial<Customer>) => void;
  updateAccessoryStock: (id: string, change: number) => void;
  addEmployee: (employee: Partial<Employee>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Authentication & Access Control
  currentUser: UserProfile | null;
  login: (emailOrId: string, password: string) => boolean;
  logout: () => void;
  systemUsers: typeof INITIAL_USERS;
  updateSystemUser: (roleOrId: string, updates: Partial<typeof INITIAL_USERS[0]>) => void;
  updateCurrentUserProfile: (updates: Partial<UserProfile>) => void;
  rolePermissions: Record<string, string[]>;
  updateRolePermissions: (role: UserRole, permissions: string[]) => void;

  // RBAC & Cashier Mode
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isCashierMode: boolean;

  // Multi-Store Outlets
  selectedStoreId: string;
  setSelectedStoreId: (id: string) => void;
  updateStore: (id: string, updates: Partial<Warehouse>) => void;
  deleteStore: (id: string) => void;

  // Invoice & Company Dynamic Settings
  invoiceSettings: InvoiceSettings;
  updateInvoiceSettings: (settings: Partial<InvoiceSettings>) => void;

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

  // Multi-Laptop Cloud Synchronization & Backup
  isCloudSyncing: boolean;
  cloudSyncStatus: "synced" | "syncing" | "offline";
  syncWithCloud: () => Promise<void>;
  exportStoreBackup: () => void;
  importStoreBackup: (file: File) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [purchases, setPurchases] = useState<PurchaseOrder[]>(initialPurchases);
  const [sales, setSales] = useState<SalesOrder[]>(initialSales);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(initialStockMovements);
  const [qcInspections, setQcInspections] = useState<QCInspection[]>(initialQCInspections);
  const [repairs, setRepairs] = useState<RepairJob[]>(initialRepairs);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [vendorConsignments, setVendorConsignments] = useState<VendorConsignment[]>(initialVendorConsignments);
  const [vendorPayouts, setVendorPayouts] = useState<VendorPayout[]>(initialVendorPayouts);
  const [vendorDisputes, setVendorDisputes] = useState<VendorDispute[]>(initialVendorDisputes);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(initialWarehouses);
  const [accessories, setAccessories] = useState<Accessory[]>(initialAccessories);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  // RBAC State
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const isCashierMode = userRole === "cashier";

  // Authentication & Session State (ID/Password Protected)
  const [systemUsers, setSystemUsers] = useState(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    id: INITIAL_USERS[0].id,
    name: INITIAL_USERS[0].name,
    email: INITIAL_USERS[0].email,
    role: INITIAL_USERS[0].role,
    storeCode: INITIAL_USERS[0].storeCode,
    storeName: INITIAL_USERS[0].storeName,
    phone: INITIAL_USERS[0].phone,
    pin: INITIAL_USERS[0].pin,
  });

  // Active Store Outlet Selection
  const [selectedStoreId, setSelectedStoreId] = useState<string>("STR-LKO-01");

  // Dynamic Company & Invoice Settings
  const initialInvoiceSettings: InvoiceSettings = {
    companyLegalName: COMPANY_CONFIG.legalName,
    registeredAddress: COMPANY_CONFIG.registeredAddress,
    cin: COMPANY_CONFIG.cin,
    gstin: COMPANY_CONFIG.gstin,
    pan: COMPANY_CONFIG.pan,
    stateName: COMPANY_CONFIG.stateName,
    stateCode: COMPANY_CONFIG.stateCode,
    tollFree: COMPANY_CONFIG.tollFree,
    supportEmail: COMPANY_CONFIG.supportEmail,
    whatsappPhone: COMPANY_CONFIG.phone,
    defaultWarrantyDays: 180,
    termsAndConditions: DEFAULT_INVOICE_TERMS,
  };
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>(initialInvoiceSettings);

  // Super Admin Configurable Role Permissions
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>(DEFAULT_ROLE_PERMISSIONS);

  // Spare Parts State
  const [spareParts, setSpareParts] = useState<SparePart[]>(initialSpareParts);

  // Buyback & Trade-In State
  const [buybacks, setBuybacks] = useState<BuybackRecord[]>(initialBuybacks);

  // Day-End Settlement State
  const [dayEndSettlements, setDayEndSettlements] = useState<DayEndSettlement[]>(initialSettlements);

  // Warranty Claims State
  const [warrantyClaims, setWarrantyClaims] = useState<WarrantyClaim[]>(initialWarrantyClaims);

  const [dateFilter, setDateFilter] = useState<DateFilterType>("this_month");
  const [globalSearch, setGlobalSearch] = useState<string>("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const [isHydrated, setIsHydrated] = useState(false);

  // LocalStorage keys for cross-tab & session persistence
  const STORAGE_KEYS = {
    devices: "thefundu_devices_v20261120_v2",
    repairs: "thefundu_repairs_v5",
    qcInspections: "thefundu_qc_v5",
    warehouses: "thefundu_stores_v6",
    sales: "thefundu_sales_v20261120_v5",
    salesBackup: "thefundu_sales_vault_v20261120_v5",
    purchases: "thefundu_purchases_v5",
    spareParts: "thefundu_spareparts_v5",
    buybacks: "thefundu_buybacks_v5",
    settlements: "thefundu_settlements_v5",
    warrantyClaims: "thefundu_warranties_v5",
    userRole: "thefundu_user_role_v5",
    authUser: "thefundu_auth_user_v6",
    selectedStoreId: "thefundu_selected_store_id_v6",
    invoiceSettings: "thefundu_invoice_settings_v7",
    rolePermissions: "thefundu_role_perms_v6",
    systemUsers: "thefundu_system_users_v6",
  };

  // Hydrate from localStorage on client mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      try {
        localStorage.removeItem("thefundu_devices_v10");
        localStorage.removeItem("thefundu_devices_v9");
        localStorage.removeItem("thefundu_devices_v8");
      } catch (e) {}

      // Collect known sold handset IDs and IMEIs from baseline sales
      const soldIdentifiers = new Set([
        "fun-26083",
        "fun-26043",
        "fun-26049",
        "fun-26000",
        "fun-26004",
        "fun-26005",
        "fun-26008",
        "fun-26014",
        "fun-26016",
        "fun-26038",
        "fun-26040",
        "fun-26046",
        "fun-26050",
        "fun-26062",
        "fun-26075",
        "867179050310196",
        "867203075513251",
        "356983557725459",
        "356903557725459",
      ]);

      const storedDevs = localStorage.getItem(STORAGE_KEYS.devices);
      if (storedDevs) {
        const parsed = JSON.parse(storedDevs);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with all initial devices so no baseline phones are ever missing
          const devMap = new Map<string, Device>();
          initialDevices.forEach((d) => devMap.set(d.id, d));
          parsed.forEach((d: Device) => devMap.set(d.id, d));
          const allMapped = Array.from(devMap.values()).map((d: Device) => {
            const isSold =
              d.status === "Sold" ||
              soldIdentifiers.has(d.id.toLowerCase()) ||
              (d.imei1 && soldIdentifiers.has(d.imei1)) ||
              (d.imei2 && soldIdentifiers.has(d.imei2));
            return {
              ...d,
              status: (isSold ? "Sold" : "In Stock") as DeviceStatus,
              warehouse: (d.warehouse === "STR-LKO-01" || !d.warehouse) ? "Lucknow Store (LKO-01)" : d.warehouse,
            };
          });
          setDevices(allMapped);
        }
      } else {
        setDevices(initialDevices.map((d: Device) => {
          const isSold =
            d.status === "Sold" ||
            soldIdentifiers.has(d.id.toLowerCase()) ||
            (d.imei1 && soldIdentifiers.has(d.imei1)) ||
            (d.imei2 && soldIdentifiers.has(d.imei2));
          return {
            ...d,
            status: (isSold ? "Sold" : "In Stock") as DeviceStatus,
            warehouse: (d.warehouse === "STR-LKO-01" || !d.warehouse) ? "Lucknow Store (LKO-01)" : d.warehouse,
          };
        }));
      }
      const storedRepairs = localStorage.getItem(STORAGE_KEYS.repairs);
      if (storedRepairs) {
        const parsed = JSON.parse(storedRepairs);
        if (Array.isArray(parsed)) setRepairs(parsed);
      }
      const storedQC = localStorage.getItem(STORAGE_KEYS.qcInspections);
      if (storedQC) {
        const parsed = JSON.parse(storedQC);
        if (Array.isArray(parsed)) setQcInspections(parsed);
      }
      const storedStores = localStorage.getItem(STORAGE_KEYS.warehouses);
      if (storedStores) {
        const parsed = JSON.parse(storedStores);
        if (Array.isArray(parsed) && parsed.length > 0) setWarehouses(parsed);
      }

      // Active purge of all legacy / deprecated localStorage keys so deleted dummy bills never reappear
      try {
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const k = localStorage.key(i);
          if (k && k.startsWith("thefundu_sales") && k !== STORAGE_KEYS.sales && k !== STORAGE_KEYS.salesBackup) {
            localStorage.removeItem(k);
          }
        }
      } catch (e) {}

      const legacySalesKeys = [
        "thefundu_sales_v20261120_v4",
        "thefundu_sales_vault_v20261120_v4",
        "thefundu_sales_v20261120_v3",
        "thefundu_sales_vault_v20261120_v3",
        "thefundu_sales_v20261120_clean",
        "thefundu_sales_vault_v20261120_clean",
        "thefundu_sales_v6",
        "thefundu_sales_vault_backup",
        "thefundu_sales_backup",
        "thefundu_sales_v5",
        "thefundu_sales_v4",
        "thefundu_sales_v3",
        "thefundu_sales_v2",
        "thefundu_sales_v1",
        "thefundu_sales",
        "thefundu_sales_backup_v6",
        "thefundu_sales_backup_v5",
        "thefundu_buybacks_v5",
        "thefundu_settlements_v5",
        "thefundu_warranties_v5",
      ];
      legacySalesKeys.forEach((k) => {
        try {
          localStorage.removeItem(k);
        } catch (e) {}
      });

      // Strict validation: Reject old dummy seeds, protect authentic bills & all genuine new bills
      const isAuthenticSale = (s: any): boolean => {
        if (!s || typeof s !== "object") return false;
        // Specifically block incorrect/fake bills
        if (
          s.invoiceNumber === "INVLKO012611-0001" ||
          s.id === "TFD-FSO-2611-0001" ||
          s.deviceId === "Fun-26000" ||
          (s.deviceId === "Fun-26001" && (s.customerName || "").toLowerCase().includes("manish"))
        ) {
          return false;
        }
        const name = (s.customerName || "").toLowerCase().trim();
        const isDummy = [
          "retail customer",
          "store retail customer",
          "abhay verma",
          "vikas singh",
          "pooja sharma",
          "amitabh srivastava",
          "ramesh kumar",
          "aakash varma",
          "gaurav malhotra",
          "sneha kulkarni",
          "roshni sen",
          "mohit agarwal",
          "kavya sundaram",
          "rahul saxena",
          "priya srivastava",
        ].some((d) => name === d || name.startsWith(d + " "));
        if (isDummy) return false;
        const isAuthenticInvoice = [
          "INVLKO012611-26083",
          "INVLKO012611-26043",
          "INVLKO012611-0002",
        ].includes(s.invoiceNumber);
        if (isAuthenticInvoice) return true;
        // Any genuine bill created by the user is retained permanently
        return Boolean((s.invoiceNumber || s.id) && s.customerName);
      };

      let loadedSales: SalesOrder[] = [];
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.sales);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            parsed.forEach((s: SalesOrder) => {
              if (isAuthenticSale(s)) {
                const exists = loadedSales.some(
                  (ex) => (s.invoiceNumber && ex.invoiceNumber === s.invoiceNumber) || (s.id && ex.id === s.id)
                );
                if (!exists) {
                  loadedSales.push(s);
                }
              }
            });
          }
        }
      } catch (e) {}

      // Always guarantee the exact 3 verified bills are loaded
      initialSales.forEach((s) => {
        const exists = loadedSales.some(
          (ex) => (s.invoiceNumber && ex.invoiceNumber === s.invoiceNumber) || (s.id && ex.id === s.id)
        );
        if (!exists) {
          loadedSales.push(s);
        }
      });

      // Filter strictly to authentic bills
      loadedSales = loadedSales.filter(isAuthenticSale);

      setSales(loadedSales);
      try {
        localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(loadedSales));
        localStorage.setItem(STORAGE_KEYS.salesBackup, JSON.stringify(loadedSales));
      } catch (e) {}
      const storedPurchases = localStorage.getItem(STORAGE_KEYS.purchases);
      if (storedPurchases) {
        const parsed = JSON.parse(storedPurchases);
        if (Array.isArray(parsed) && parsed.length > 0) setPurchases(parsed);
      }
      const storedParts = localStorage.getItem(STORAGE_KEYS.spareParts);
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
      const storedUsers = localStorage.getItem(STORAGE_KEYS.systemUsers);
      if (storedUsers) {
        try {
          const parsed = JSON.parse(storedUsers);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const cleaned = parsed.map((u: any) =>
              u.name === "Vikram Singhania" ? { ...u, name: "Abhay Verma" } : u
            );
            setSystemUsers(cleaned);
          }
        } catch (e) {}
      }

      const storedAuth = localStorage.getItem(STORAGE_KEYS.authUser);
      if (storedAuth) {
        try {
          const parsed = JSON.parse(storedAuth);
          if (parsed && parsed.id) {
            if (parsed.name === "Vikram Singhania") {
              parsed.name = "Abhay Verma";
              localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(parsed));
            }
            setCurrentUser(parsed);
            setUserRole(parsed.role || "admin");
          }
        } catch (e) {}
      }
      const storedStoreId = localStorage.getItem(STORAGE_KEYS.selectedStoreId);
      if (storedStoreId) setSelectedStoreId(storedStoreId);

      const storedInvoiceSettings = localStorage.getItem(STORAGE_KEYS.invoiceSettings);
      if (storedInvoiceSettings) {
        try {
          const parsed = JSON.parse(storedInvoiceSettings);
          if (parsed && parsed.companyLegalName) {
            // Update terms to new clean concise format with repair timeline
            if (Array.isArray(parsed.termsAndConditions)) {
              const needsUpdate = parsed.termsAndConditions.some((t: string) => 
                t.includes("Voidance") || t.includes("Exclusive Lucknow Jurisdiction") || t.includes("1800") || t.includes("Liquid Ingress") || t.includes("No Physical / Liquid Damage:")
              ) || !parsed.termsAndConditions.some((t: string) => t.includes("Warrenty void"));

              if (needsUpdate) {
                parsed.termsAndConditions = DEFAULT_INVOICE_TERMS;
              }
            }
            if (parsed.tollFree && (parsed.tollFree.includes("1800") || parsed.tollFree.includes("THE-FUNDU"))) {
              parsed.tollFree = "Call & WhatsApp: 6390616616";
            }
            parsed.supportEmail = "support@thefundu.com";
            parsed.whatsappPhone = "+91 6390616616";
            setInvoiceSettings(parsed);
            try {
              localStorage.setItem(STORAGE_KEYS.invoiceSettings, JSON.stringify(parsed));
            } catch (e) {}
          }
        } catch (e) {}
      }

      const storedRolePerms = localStorage.getItem(STORAGE_KEYS.rolePermissions);
      if (storedRolePerms) {
        try {
          const parsed = JSON.parse(storedRolePerms);
          if (parsed && parsed.admin) setRolePermissions(parsed);
        } catch (e) {}
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
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever state changes after hydration
  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.devices, JSON.stringify(devices));
    } catch (e) {}
  }, [devices, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.repairs, JSON.stringify(repairs));
    } catch (e) {}
  }, [repairs, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.qcInspections, JSON.stringify(qcInspections));
    } catch (e) {}
  }, [qcInspections, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.warehouses, JSON.stringify(warehouses));
    } catch (e) {}
  }, [warehouses, isHydrated]);

  // Synchronize across multiple browser tabs in real-time
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorageEvent = (e: StorageEvent) => {
      try {
        if (e.key === STORAGE_KEYS.devices && e.newValue) {
          setDevices(JSON.parse(e.newValue));
        } else if (e.key === STORAGE_KEYS.repairs && e.newValue) {
          setRepairs(JSON.parse(e.newValue));
        } else if (e.key === STORAGE_KEYS.qcInspections && e.newValue) {
          setQcInspections(JSON.parse(e.newValue));
        } else if (e.key === STORAGE_KEYS.warehouses && e.newValue) {
          setWarehouses(JSON.parse(e.newValue));
        }
      } catch (err) {}
    };
    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, []);

  // Apply theme class to document
  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme]);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);
  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = "toast-" + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Multi-Laptop Cloud Synchronization State
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<"synced" | "syncing" | "offline">("synced");

  const syncWithCloud = async () => {
    if (isCloudSyncing) return;
    setIsCloudSyncing(true);
    setCloudSyncStatus("syncing");

    try {
      // 1. Synchronize Devices with Supabase Cloud
      const currentLocal = devices.length > 0 ? devices : initialDevices;
      const { devices: mergedDevices, syncedToCloudCount, syncedFromCloudCount } = await syncBidirectionalDevices(currentLocal);

      if (mergedDevices.length > 0) {
        setDevices(mergedDevices);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(STORAGE_KEYS.devices, JSON.stringify(mergedDevices));
          } catch (e) {}
        }
      }

      // 2. Synchronize Warehouses & Store Address with Supabase Cloud
      const cloudWarehouses = await fetchCloudWarehouses();
      if (cloudWarehouses && cloudWarehouses.length > 0) {
        setWarehouses(cloudWarehouses);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(STORAGE_KEYS.warehouses, JSON.stringify(cloudWarehouses));
          } catch (e) {}
        }
      }

      setCloudSyncStatus("synced");
      if (syncedToCloudCount > 0) {
        showToast(`Uploaded ${syncedToCloudCount} handsets to Cloud! All connected laptops updated to ${mergedDevices.length} phones.`, "success");
      } else if (syncedFromCloudCount > 0) {
        showToast(`Downloaded ${syncedFromCloudCount} handsets from Cloud! Now showing ${mergedDevices.length} phones.`, "success");
      }
    } catch (err) {
      console.error("Cloud sync error:", err);
      setCloudSyncStatus("offline");
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // Run initial multi-device cloud sync once hydrated on any laptop
  useEffect(() => {
    if (isHydrated) {
      syncWithCloud();
    }
  }, [isHydrated]);

  // One-Click Cross-Laptop Backup Export & Import
  const exportStoreBackup = () => {
    const backupData = {
      version: "1.0",
      brand: "TheFundu",
      exportedAt: new Date().toISOString(),
      devices,
      warehouses,
      sales,
      purchases,
      buybacks,
      invoiceSettings,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TheFundu_Store_Backup_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported backup file with ${devices.length} handsets & store settings!`, "success");
  };

  const importStoreBackup = async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || !Array.isArray(parsed.devices)) {
        showToast("Invalid backup file: 'devices' array missing.", "error");
        return false;
      }
      setDevices(parsed.devices);
      if (Array.isArray(parsed.warehouses)) setWarehouses(parsed.warehouses);
      if (Array.isArray(parsed.sales)) setSales(parsed.sales);
      if (Array.isArray(parsed.purchases)) setPurchases(parsed.purchases);
      if (Array.isArray(parsed.buybacks)) setBuybacks(parsed.buybacks);
      if (parsed.invoiceSettings) setInvoiceSettings(parsed.invoiceSettings);

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEYS.devices, JSON.stringify(parsed.devices));
          if (parsed.warehouses) localStorage.setItem(STORAGE_KEYS.warehouses, JSON.stringify(parsed.warehouses));
        } catch (e) {}
      }

      // Automatically push all imported devices to cloud
      await upsertCloudDevices(parsed.devices);
      if (Array.isArray(parsed.warehouses) && parsed.warehouses.length > 0) {
        for (const w of parsed.warehouses) {
          await upsertCloudWarehouse(w);
        }
      }

      showToast(`Successfully imported & cloud-synced ${parsed.devices.length} handsets across all devices!`, "success");
      return true;
    } catch (err: any) {
      showToast(`Failed to parse backup file: ${err.message}`, "error");
      return false;
    }
  };

  // Device CRUD
  const addDevice = (newDev: Partial<Device>): Device => {
    const nextNumber = 26000 + devices.length;
    const id = (newDev.id && newDev.id.trim()) ? newDev.id.trim() : `Fun-${nextNumber}`;
    const purchasePrice = Number(newDev.costs?.purchasePrice || 0);
    const repairCost = Number(newDev.costs?.repairCost || 0);
    const testingCost = Number(newDev.costs?.testingCost || 500);
    const packagingCost = Number(newDev.costs?.packagingCost || 400);
    const logisticsCost = Number(newDev.costs?.logisticsCost || 500);
    const otherCost = Number(newDev.costs?.otherCost || 200);
    const totalLandedCost = purchasePrice + repairCost + testingCost + packagingCost + logisticsCost + otherCost;
    const sellingPrice = Number(newDev.costs?.sellingPrice || totalLandedCost * 1.25);
    const projectedProfit = sellingPrice - totalLandedCost;
    const profitMarginPercent = sellingPrice > 0 ? Number(((projectedProfit / sellingPrice) * 100).toFixed(1)) : 0;

    const fullDevice: Device = {
      id,
      brand: newDev.brand || "Apple",
      model: newDev.model || "iPhone 15",
      storage: newDev.storage || "128GB",
      ram: newDev.ram || "6GB",
      colour: newDev.colour || "Space Black",
      imei1: newDev.imei1 || "35" + Math.floor(1000000000000 + Math.random() * 9000000000000),
      imei2: newDev.imei2 || "",
      serialNumber: newDev.serialNumber || `SN${nextNumber}`,
      sku: newDev.sku || `${(newDev.brand || "DEV").substring(0, 3).toUpperCase()}-${(newDev.model || "MOD").replace(/\s+/g, "").substring(0, 5).toUpperCase()}-${newDev.storage || "128"}`,
      batteryHealth: Number(newDev.batteryHealth || 95),
      // Grade removed per company policy
      status: newDev.status || "In Stock",
      warehouse: newDev.warehouse || "Lucknow Store (LKO-01)",
      costs: {
        purchasePrice,
        repairCost,
        testingCost,
        packagingCost,
        logisticsCost,
        otherCost,
        totalLandedCost,
        sellingPrice,
        projectedProfit,
        profitMarginPercent,
      },
      supplierId: newDev.supplierId || "SUP-001",
      supplierName: newDev.supplierName || "Esterline Bonaparte Corporation Private Limited",
      purchaseDate: newDev.purchaseDate || new Date().toISOString().split("T")[0],
      images: newDev.images && newDev.images.length > 0 ? newDev.images : [
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80"
      ],
      specifications: {
        chipset: newDev.specifications?.chipset || "Octa-core flagship processor",
        screenSize: newDev.specifications?.screenSize || '6.1" OLED Display',
        cameraSpecs: newDev.specifications?.cameraSpecs || "48MP Dual Camera system",
        network: newDev.specifications?.network || "5G Dual SIM",
        osVersion: newDev.specifications?.osVersion || "Latest OS",
      },
      customerKyc: newDev.customerKyc,
      activityTimeline: [
        {
          id: "ACT-" + Date.now(),
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
          user: "Inventory Admin",
          action: "Added to Inventory",
          details: `Manual entry created. Assigned ID ${id} with Status ${newDev.status || "In Stock"}.`,
        },
      ],
      repairHistory: [],
    };

    setDevices((prev) => [fullDevice, ...prev]);

    // Asynchronously push new device to Cloud so all laptops receive it
    upsertCloudDevices([fullDevice]).catch(console.error);

    // Also record inward movement
    addStockMovement({
      type: "Inward",
      reason: "Purchase Received",
      deviceId: fullDevice.id,
      deviceModel: `${fullDevice.brand} ${fullDevice.model} ${fullDevice.storage}`,
      imei: fullDevice.imei1,
      fromLocation: fullDevice.supplierName,
      toLocation: fullDevice.warehouse,
      quantity: 1,
      value: fullDevice.costs.purchasePrice,
      initiatedBy: "Inventory Admin",
      notes: "Newly registered device in OS",
    });

    showToast(`Device ${fullDevice.brand} ${fullDevice.model} added & synced to Cloud (${fullDevice.id})!`, "success");
    return fullDevice;
  };

  const updateDevice = (id: string, updates: Partial<Device>) => {
    const targetId = updates.id && updates.id.trim() ? updates.id.trim() : id;
    setDevices((prev) => {
      const next = prev.map((dev) => {
        if (dev.id === id) {
          const updated = { ...dev, ...updates, id: targetId };
          return updated;
        }
        return dev;
      });
      const target = next.find((d) => d.id === targetId || d.id === id);
      if (target) {
        upsertCloudDevices([target]).catch(console.error);
      }
      return next;
    });
    showToast(`Device ${targetId} updated successfully.`, "info");
  };

  const deleteDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    deleteCloudDevice(id).catch(console.error);
    showToast(`Device ${id} removed from active inventory.`, "info");
  };

  const setAllDevicesInStock = () => {
    setDevices((prev) =>
      prev.map((dev) => ({
        ...dev,
        status: dev.status === "Sold" ? "Sold" : ("In Stock" as DeviceStatus),
      }))
    );
    showToast("All active smartphones updated to 'In Stock' status (Sold phones remain Sold)!", "success");
  };

  // Purchase Order
  const addPurchase = (purchase: Partial<PurchaseOrder>): PurchaseOrder => {
    const id = `PO-${Math.floor(8840 + purchases.length)}`;
    const fullPO: PurchaseOrder = {
      id,
      supplierId: purchase.supplierId || "SUP-001",
      supplierName: purchase.supplierName || "Esterline Bulk Refurb Solutions",
      supplierContact: purchase.supplierContact || "+91 98210 55432",
      supplierGst: purchase.supplierGst || "27AABCE1234F1Z8",
      date: purchase.date || new Date().toISOString().split("T")[0],
      itemsCount: purchase.itemsCount || 5,
      devices: purchase.devices || [],
      totalAmount: purchase.totalAmount || 150000,
      paymentStatus: purchase.paymentStatus || "Paid",
      amountPaid: purchase.amountPaid || purchase.totalAmount || 150000,
      balanceDue: purchase.balanceDue || 0,
      warehouse: purchase.warehouse || "Mumbai Central Hub",
      invoiceNumber: purchase.invoiceNumber || `EST-INV-${Date.now().toString().slice(-6)}`,
      notes: purchase.notes || "Recorded via Procurement Desk",
    };

    setPurchases((prev) => [fullPO, ...prev]);
    showToast(`Purchase Order ${fullPO.id} recorded (${fullPO.itemsCount} units).`, "success");
    return fullPO;
  };

  // Sales Order
  const addSale = (sale: Partial<SalesOrder>): SalesOrder => {
    const channel = (sale.channel as SalesChannelCode) || "FSO";
    const typeOfSale = (sale.typeOfSale as SaleTypeCode) || "B2C";
    const seqNum = String(sales.length + 1).padStart(4, "0");
    const id = sale.id || `TFD-${channel}-2611-${seqNum}`;
    const invoiceNumber = sale.invoiceNumber || `INVLKO2611-${seqNum}`;
    const channelOrderNo = sale.channelOrderNo || `#${channel}-LKO-2611-${String(sales.length + 1).padStart(3, "0")}`;
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
      customerAddress: sale.customerLocalAddress || sale.customerAddress || "India",
      customerLocalAddress: sale.customerLocalAddress || sale.customerAddress || "India",
      customerPermanentAddress: sale.customerPermanentAddress || sale.customerLocalAddress || sale.customerAddress || "India",
      customerAadhaar: sale.customerAadhaar,
      customerGstin: sale.customerGstin,
      placeOfSupply: sale.placeOfSupply || "Uttar Pradesh",
      date: sale.date || new Date().toISOString().split("T")[0],
      deviceId: sale.deviceId || "Fun-26001",
      deviceModel: sale.deviceModel || "Smartphone",
      imei: sale.imei || "354928198421092",
      serialNumber: sale.serialNumber || (sale.deviceId ? `SN${sale.deviceId.replace(/\D/g, "")}` : "SN26001"),
      sellingPrice: sale.sellingPrice || 49999,
      discount: sale.discount || 0,
      taxAmount: Math.round(((sale.sellingPrice || 49999) - (sale.discount || 0)) * 0.18),
      finalAmount: sale.finalAmount || (sale.sellingPrice || 49999) - (sale.discount || 0),
      paymentMethod: sale.paymentMethod || "UPI",
      splitPayment: sale.splitPayment,
      paymentStatus: sale.paymentStatus || "Completed",
      deliveryStatus: sale.deliveryStatus || "Packed",
      trackingNumber: `TFD-SHIP-${Math.floor(100000 + Math.random() * 900000)}`,
      warrantyMonths: sale.warrantyMonths || 12,
      warrantyExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      purchasePrice: sale.purchasePrice,
      profitMargin: sale.profitMargin,
      paymentTxnId: sale.paymentTxnId || (sale.splitPayment?.onlineTxnId),
      storeName: sale.storeName || "Lucknow Flagship Store (LKO-01)",
      storeCode: sale.storeCode || "LKO-01",
    };

    // Deduplicate / update existing invoice record if re-issued or re-printed
    const existingIndex = sales.findIndex(
      (s) =>
        (sale.invoiceNumber && s.invoiceNumber === sale.invoiceNumber) ||
        (sale.id && s.id === sale.id)
    );
    let updatedSales: SalesOrder[];
    if (existingIndex >= 0) {
      updatedSales = [...sales];
      updatedSales[existingIndex] = { ...updatedSales[existingIndex], ...fullSale };
    } else {
      updatedSales = [fullSale, ...sales];
    }
    setSales(updatedSales);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(updatedSales));
        localStorage.setItem(STORAGE_KEYS.salesBackup, JSON.stringify(updatedSales));
      } catch (e) {}
    }

    // Update the device status to 'Sold' - immediately removes it from active inventory
    if (sale.deviceId || sale.imei) {
      setDevices((prev) => {
        const nextDevices = prev.map((dev) => {
          const isMatch =
            (sale.deviceId && dev.id.toLowerCase() === sale.deviceId.toLowerCase()) ||
            (sale.imei && (dev.imei1 === sale.imei || dev.imei2 === sale.imei));
          if (isMatch) {
            return { ...dev, status: "Sold" as DeviceStatus };
          }
          return dev;
        });
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(STORAGE_KEYS.devices, JSON.stringify(nextDevices));
          } catch (e) {}
        }
        return nextDevices;
      });

      addStockMovement({
        type: "Outward",
        reason: "Sold",
        deviceId: sale.deviceId || fullSale.deviceId,
        deviceModel: fullSale.deviceModel,
        imei: fullSale.imei,
        fromLocation: fullSale.storeName || "Lucknow Store (LKO-01)",
        toLocation: `Customer (${fullSale.customerName})`,
        quantity: 1,
        value: fullSale.finalAmount,
        initiatedBy: "Sales Team",
        notes: `Tax invoice ${fullSale.invoiceNumber || fullSale.id} issued. Marked Sold & automatically removed from active stock.`,
      });
    }

    showToast(`Tax Invoice ${fullSale.invoiceNumber || fullSale.id} saved! Handset marked Sold & removed from active stock.`, "success");
    return fullSale;
  };

  const deleteSale = (id: string) => {
    const PROTECTED_INVOICES = [
      "INVLKO012611-26083",
      "INVLKO012611-26043",
      "INVLKO012611-0002",
      "TFD-FSO-2611-26083",
      "TFD-FSO-2611-26043",
      "TFD-FSO-2611-0002",
    ];
    const saleToDelete = sales.find((s) => s.id === id || s.invoiceNumber === id);
    if (
      PROTECTED_INVOICES.includes(id) ||
      (saleToDelete?.invoiceNumber ? PROTECTED_INVOICES.includes(saleToDelete.invoiceNumber) : false) ||
      (saleToDelete?.id ? PROTECTED_INVOICES.includes(saleToDelete.id) : false)
    ) {
      showToast("Ye authentic tax invoice GST compliance aur legal audit ke liye locked hai. Isse delete nahi kiya ja sakta.", "error");
      return;
    }

    const updated = sales.filter((s) => s.id !== id && s.invoiceNumber !== id);
    setSales(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(updated));
        localStorage.setItem(STORAGE_KEYS.salesBackup, JSON.stringify(updated));
      } catch (e) {}
    }

    // Return handset back to In Stock if deleted/voided
    if (saleToDelete && (saleToDelete.deviceId || saleToDelete.imei)) {
      setDevices((prev) => {
        const next = prev.map((dev) => {
          const isMatch =
            (saleToDelete.deviceId && dev.id.toLowerCase() === saleToDelete.deviceId.toLowerCase()) ||
            (saleToDelete.imei && (dev.imei1 === saleToDelete.imei || dev.imei2 === saleToDelete.imei));
          if (isMatch) {
            return { ...dev, status: "In Stock" as DeviceStatus };
          }
          return dev;
        });
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(STORAGE_KEYS.devices, JSON.stringify(next));
          } catch (e) {}
        }
        return next;
      });
    }

    showToast("Invoice removed from ledger & handset returned to In Stock", "info");
  };

  const clearAllSales = () => {
    // Keep authentic baseline bills safe forever
    setSales(initialSales);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(initialSales));
        localStorage.setItem(STORAGE_KEYS.salesBackup, JSON.stringify(initialSales));
      } catch (e) {}
    }
    showToast("Ledger protected: Authentic verified bills preserved.", "info");
  };

  const recoverAllSales = (): number => {
    let recoveredCount = 0;
    const isAuthenticSale = (s: any): boolean => {
      if (!s || typeof s !== "object") return false;
      if (
        s.invoiceNumber === "INVLKO012611-0001" ||
        s.id === "TFD-FSO-2611-0001" ||
        s.deviceId === "Fun-26000" ||
        (s.deviceId === "Fun-26001" && (s.customerName || "").toLowerCase().includes("manish"))
      ) {
        return false;
      }
      const name = (s.customerName || "").toLowerCase().trim();
      const isDummy = [
        "retail customer",
        "store retail customer",
        "abhay verma",
        "vikas singh",
        "pooja sharma",
        "amitabh srivastava",
        "ramesh kumar",
        "aakash varma",
        "gaurav malhotra",
        "sneha kulkarni",
        "roshni sen",
        "mohit agarwal",
        "kavya sundaram",
        "rahul saxena",
        "priya srivastava",
      ].some((d) => name === d || name.startsWith(d + " "));
      if (isDummy) return false;
      const isAuthenticInvoice = [
        "INVLKO012611-26083",
        "INVLKO012611-26043",
        "INVLKO012611-0002",
      ].includes(s.invoiceNumber);
      if (isAuthenticInvoice) return true;
      // Retain all genuine bills created by user
      return Boolean((s.invoiceNumber || s.id) && s.customerName);
    };

    const currentSalesMap = new Map<string, SalesOrder>();
    sales.forEach((s) => {
      if (isAuthenticSale(s)) {
        if (s.invoiceNumber) currentSalesMap.set(s.invoiceNumber, s);
        if (s.id) currentSalesMap.set(s.id, s);
        if (s.deviceId) currentSalesMap.set(s.deviceId, s);
      }
    });

    if (typeof window !== "undefined") {
      const backupKeys = [
        STORAGE_KEYS.salesBackup,
        STORAGE_KEYS.sales,
      ];
      backupKeys.forEach((key) => {
        try {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              parsed.forEach((s: SalesOrder) => {
                if (s && (s.invoiceNumber || s.id) && isAuthenticSale(s)) {
                  const keyId = s.invoiceNumber || s.id;
                  if (!currentSalesMap.has(keyId)) {
                    currentSalesMap.set(keyId, s);
                    recoveredCount++;
                  }
                }
              });
            }
          }
        } catch (e) {}
      });
    }

    // Recover baseline verified sales
    initialSales.forEach((s) => {
      const keyId = s.invoiceNumber || s.id;
      if (!currentSalesMap.has(keyId)) {
        currentSalesMap.set(keyId, s);
        recoveredCount++;
      }
    });

    const allRecovered = Array.from(currentSalesMap.values()).filter(isAuthenticSale);
    setSales(allRecovered);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(allRecovered));
        localStorage.setItem(STORAGE_KEYS.salesBackup, JSON.stringify(allRecovered));
      } catch (e) {}
    }
    showToast(
      recoveredCount > 0
        ? `Recovery Success! ${recoveredCount} bills wapas restore ho gaye!`
        : `Saare bills already safely ledger me available hain (${allRecovered.length} bills).`,
      "success"
    );
    return recoveredCount;
  };

  const updateSalesDeliveryStatus = (id: string, status: SalesOrder["deliveryStatus"]) => {
    setSales((prev) =>
      prev.map((s) => (s.id === id ? { ...s, deliveryStatus: status } : s))
    );
    showToast(`Order ${id} delivery status updated to ${status}.`, "info");
  };

  // Stock Movement
  const addStockMovement = (movement: Partial<StockMovement>) => {
    const id = `MOV-${Math.floor(410 + stockMovements.length)}`;
    const fullMovement: StockMovement = {
      id,
      date: movement.date || new Date().toISOString().replace("T", " ").substring(0, 16),
      type: movement.type || "Inward",
      reason: movement.reason || "Manual Adjustment (In)",
      deviceId: movement.deviceId || "-",
      deviceModel: movement.deviceModel || "Device",
      imei: movement.imei || "-",
      fromLocation: movement.fromLocation || "Intake Bay",
      toLocation: movement.toLocation || "Mumbai Central Hub",
      quantity: movement.quantity || 1,
      value: movement.value || 0,
      initiatedBy: movement.initiatedBy || "Inventory Admin",
      notes: movement.notes || "",
    };

    setStockMovements((prev) => [fullMovement, ...prev]);
  };

  // QC Inspection
  const submitQCInspection = (qc: Partial<QCInspection>) => {
    const id = `QC-2026-${Math.floor(110 + qcInspections.length)}`;
    const fullQC: QCInspection = {
      id,
      deviceId: qc.deviceId || "",
      inspectorName: qc.inspectorName || "Sunil Verma",
      inspectionDate: qc.inspectionDate || new Date().toISOString().split("T")[0],
      batteryHealthPercent: qc.batteryHealthPercent || 90,
      gradeAssigned: qc.gradeAssigned || "A",
      checklist: qc.checklist || {
        display: true,
        touchscreen: true,
        battery: true,
        faceId: true,
        fingerprint: true,
        cameras: true,
        speakers: true,
        microphone: true,
        chargingPort: true,
        simNetwork: true,
        wifi: true,
        bluetooth: true,
        physicalCondition: true,
      },
      notes: qc.notes || "Complete 13-point diagnostic run.",
      images: qc.images || [],
      status: qc.status || "Approved",
    };

    setQcInspections((prev) => [fullQC, ...prev]);

    // Update corresponding device & auto-route to Repairs bay
    if (fullQC.deviceId) {
      const targetDev = devices.find((d) => d.id === fullQC.deviceId);
      const nextStatus =
        fullQC.status === "Approved"
          ? "Ready for Sale"
          : fullQC.status === "Needs Repair"
          ? "Under Repair"
          : "Damaged";

      if (fullQC.status === "Needs Repair") {
        const failedChecks = Object.entries(fullQC.checklist || {})
          .filter(([_, passed]) => !passed)
          .map(([k]) => k.replace(/([A-Z])/g, " $1"));

        const problemDesc =
          failedChecks.length > 0
            ? `QC Failed: ${failedChecks.join(", ")}. Notes: ${fullQC.notes}`
            : fullQC.notes || "QC Diagnostic flagged hardware fault, routed to technician.";

        const repId = `REP-${Math.floor(8825 + repairs.length + 1)}`;
        const autoRepairJob: RepairJob = {
          id: repId,
          deviceId: fullQC.deviceId,
          deviceModel: targetDev ? `${targetDev.brand} ${targetDev.model} (${targetDev.storage})` : "Smartphone",
          imei: targetDev ? targetDev.imei1 : "",
          technicianName: "Karan Johar (Senior Hardware Specialist)",
          problemDescription: problemDesc,
          partsReplaced: [],
          repairCost: 2200,
          status: "In Progress",
          startDate: new Date().toISOString().split("T")[0],
          beforeImages: fullQC.images || targetDev?.images || [],
          afterImages: [],
          notes: `Auto-routed from QC Inspection by ${fullQC.inspectorName}`,
        };

        setRepairs((prev) => [autoRepairJob, ...prev]);

        updateDevice(fullQC.deviceId, {
          grade: fullQC.gradeAssigned,
          batteryHealth: fullQC.batteryHealthPercent,
          status: nextStatus,
          qcInspection: fullQC,
          repairHistory: [...(targetDev?.repairHistory || []), autoRepairJob],
        });

        showToast(
          `Handset ${fullQC.deviceId} (${targetDev?.brand || ""} ${targetDev?.model || ""}) routed to Repair Bay! Job card ${autoRepairJob.id} generated.`,
          "info"
        );
      } else {
        updateDevice(fullQC.deviceId, {
          grade: fullQC.gradeAssigned,
          batteryHealth: fullQC.batteryHealthPercent,
          status: nextStatus,
          qcInspection: fullQC,
        });
        showToast(`QC Approved for ${targetDev?.brand || ""} ${targetDev?.model || ""}!`, "success");
      }
    }
  };

  // Direct Route Device to Repair Bay
  const routeDeviceToRepair = (
    deviceId: string,
    reason: string = "Hardware diagnostic fault detected during quality inspection.",
    technicianName: string = "Karan Johar (Senior Hardware Specialist)",
    repairCost: number = 2200
  ) => {
    const targetDev = devices.find((d) => d.id === deviceId);
    if (!targetDev) return;

    const repId = `REP-${Math.floor(8825 + repairs.length + 1)}`;
    const autoRepairJob: RepairJob = {
      id: repId,
      deviceId: targetDev.id,
      deviceModel: `${targetDev.brand} ${targetDev.model} (${targetDev.storage})`,
      imei: targetDev.imei1,
      technicianName,
      problemDescription: reason,
      partsReplaced: [],
      repairCost,
      status: "In Progress",
      startDate: new Date().toISOString().split("T")[0],
      beforeImages: targetDev.images || [],
      afterImages: [],
      notes: `Directly routed to Repair Bay under technician ${technicianName}`,
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
      type: "Outward",
      reason: "Warehouse Transfer Dispatched",
      deviceId: targetDev.id,
      deviceModel: `${targetDev.brand} ${targetDev.model}`,
      imei: targetDev.imei1,
      fromLocation: targetDev.warehouse || "Lucknow Store (LKO-01)",
      toLocation: "Hardware Repair Bay (LKO-REP)",
      quantity: 1,
      value: targetDev.costs.purchasePrice,
      initiatedBy: "QC Diagnostic Lead",
      notes: reason,
    });

    showToast(
      `Handset ${targetDev.id} (${targetDev.brand} ${targetDev.model}) routed to Repair Bay! Status: Under Repair. Job: ${repId}`,
      "info"
    );
  };

  // Repair
  const addRepairJob = (repair: Partial<RepairJob>) => {
    const id = `REP-${Math.floor(8825 + repairs.length)}`;
    const fullRepair: RepairJob = {
      id,
      deviceId: repair.deviceId || "",
      deviceModel: repair.deviceModel || "Device",
      imei: repair.imei || "",
      technicianName: repair.technicianName || "Karan Johar",
      problemDescription: repair.problemDescription || "Diagnostic flagged issue",
      partsReplaced: repair.partsReplaced || [],
      repairCost: repair.repairCost || 1500,
      status: repair.status || "Pending",
      startDate: repair.startDate || new Date().toISOString().split("T")[0],
      beforeImages: repair.beforeImages || [],
      afterImages: repair.afterImages || [],
      notes: repair.notes || "",
    };

    setRepairs((prev) => [fullRepair, ...prev]);
    if (fullRepair.deviceId) {
      updateDevice(fullRepair.deviceId, { status: "Under Repair" });
    }
    showToast(`Repair job ${fullRepair.id} assigned to ${fullRepair.technicianName}.`, "info");
  };

  const updateRepairJob = (id: string, updates: Partial<RepairJob>) => {
    setRepairs((prev) =>
      prev.map((rep) => {
        if (rep.id === id) {
          const updated = { ...rep, ...updates };
          if (updated.status === "Quality Passed" && updated.deviceId) {
            updateDevice(updated.deviceId, { status: "Ready for Sale" });
          }
          return updated;
        }
        return rep;
      })
    );
    showToast(`Repair job ${id} updated.`, "info");
  };

  // Warehouse Stock Transfer
  const transferWarehouseStock = (deviceId: string, targetWarehouse: WarehouseLocation, notes?: string) => {
    const dev = devices.find((d) => d.id === deviceId);
    if (!dev) return;

    const sourceWarehouse = dev.warehouse;
    updateDevice(deviceId, { warehouse: targetWarehouse });

    addStockMovement({
      type: "Outward",
      reason: "Warehouse Transfer Dispatched",
      deviceId: dev.id,
      deviceModel: `${dev.brand} ${dev.model}`,
      imei: dev.imei1,
      fromLocation: sourceWarehouse,
      toLocation: targetWarehouse,
      quantity: 1,
      value: dev.costs.purchasePrice,
      initiatedBy: "Warehouse Supervisor",
      notes: notes || `Transferred from ${sourceWarehouse} to ${targetWarehouse}`,
    });

    addStockMovement({
      type: "Inward",
      reason: "Warehouse Transfer Received",
      deviceId: dev.id,
      deviceModel: `${dev.brand} ${dev.model}`,
      imei: dev.imei1,
      fromLocation: sourceWarehouse,
      toLocation: targetWarehouse,
      quantity: 1,
      value: dev.costs.purchasePrice,
      initiatedBy: "Receiving Supervisor",
      notes: `Received at ${targetWarehouse}`,
    });

    showToast(`Device ${dev.id} successfully transferred to ${targetWarehouse}!`, "success");
  };

  const addStore = (store: Partial<Warehouse>): Warehouse => {
    const code = store.code?.toUpperCase().trim() || `LKO-0${warehouses.length + 1}`;
    const fullStore: Warehouse = {
      id: store.id || `STR-${code}`,
      name: store.name || `${store.city || "Lucknow"} Store (${code})`,
      code,
      city: store.city || "Lucknow",
      location: store.location || store.city || "Gomti Nagar, Lucknow",
      address: store.address || "Lucknow, Uttar Pradesh",
      managerName: store.managerName || "Store Manager",
      managerPhone: store.managerPhone || "+91 98000 00000",
      totalCapacity: store.totalCapacity || 1500,
      currentStockUnits: 0,
      totalStockValue: 0,
      underRepairUnits: 0,
      qcPendingUnits: 0,
      status: store.status || "Active",
    };
    setWarehouses((prev) => [...prev, fullStore]);
    showToast(`Store "${fullStore.name}" (${fullStore.code}) added successfully!`, "success");
    return fullStore;
  };

  // Suppliers & Customers
  const addSupplier = (supplier: Partial<Supplier>) => {
    const id = `SUP-00${suppliers.length + 1}`;
    const fullSupplier: Supplier = {
      id,
      name: supplier.name || "New Supplier",
      company: supplier.company || supplier.name || "Company",
      contactPerson: supplier.contactPerson || "Lead",
      email: supplier.email || "partner@supplier.com",
      phone: supplier.phone || "+91 98000 00000",
      address: supplier.address || "India",
      gstNumber: supplier.gstNumber || "27AAAAA0000A1Z5",
      totalPurchasesCount: 0,
      totalPurchasedValue: 0,
      outstandingBalance: 0,
      rating: 5.0,
      status: "Active",
    };
    setSuppliers((prev) => [fullSupplier, ...prev]);
    showToast(`Supplier ${fullSupplier.name} registered!`, "success");
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    showToast(`Supplier ${id} updated`, "success");
  };

  const addVendorConsignment = (consignment: Partial<VendorConsignment>) => {
    const id = `LOT-2026-BOM-${Math.floor(100 + vendorConsignments.length)}`;
    const fullLot: VendorConsignment = {
      id,
      supplierId: consignment.supplierId || "SUP-001",
      supplierName: consignment.supplierName || "Esterline Bulk Refurb Solutions",
      date: consignment.date || new Date().toISOString().split("T")[0],
      totalDevices: consignment.totalDevices || 1,
      qcPassedCount: consignment.qcPassedCount || 0,
      qcRejectedCount: consignment.qcRejectedCount || 0,
      totalValue: consignment.totalValue || 50000,
      settlementStatus: consignment.settlementStatus || "Pending QC",
      warehouse: consignment.warehouse || "Mumbai Central Hub",
      manifestItems: consignment.manifestItems || [],
    };
    setVendorConsignments((prev) => [fullLot, ...prev]);
    showToast(`Consignment lot ${fullLot.id} inwarded!`, "success");
  };

  const updateVendorConsignmentStatus = (id: string, status: VendorConsignment["settlementStatus"]) => {
    setVendorConsignments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, settlementStatus: status } : c))
    );
    showToast(`Consignment ${id} status updated to ${status}`, "info");
  };

  const recordVendorPayout = (payout: Partial<VendorPayout>) => {
    const id = `PAY-${Math.floor(9930 + vendorPayouts.length)}`;
    const fullPayout: VendorPayout = {
      id,
      supplierId: payout.supplierId || "SUP-001",
      supplierName: payout.supplierName || "Supplier",
      date: payout.date || new Date().toISOString().split("T")[0],
      amount: payout.amount || 100000,
      mode: payout.mode || "NEFT/RTGS",
      utrNumber: payout.utrNumber || `UTR${Date.now().toString().slice(-8)}`,
      tdsDeducted: payout.tdsDeducted || Math.round((payout.amount || 100000) * 0.001),
      status: payout.status || "Processed",
      invoiceRef: payout.invoiceRef || `INV-${Date.now().toString().slice(-6)}`,
      settledConsignments: payout.settledConsignments || [],
    };
    setVendorPayouts((prev) => [fullPayout, ...prev]);

    if (fullPayout.supplierId) {
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === fullPayout.supplierId
            ? { ...s, outstandingBalance: Math.max(0, s.outstandingBalance - fullPayout.amount) }
            : s
        )
      );
    }
    showToast(`Vendor payout of ₹${fullPayout.amount.toLocaleString()} recorded with UTR ${fullPayout.utrNumber}!`, "success");
  };

  const addVendorDispute = (dispute: Partial<VendorDispute>) => {
    const id = `RTV-${Math.floor(450 + vendorDisputes.length)}`;
    const fullDispute: VendorDispute = {
      id,
      supplierId: dispute.supplierId || "SUP-001",
      supplierName: dispute.supplierName || "Supplier",
      deviceId: dispute.deviceId || "DEV-000",
      deviceModel: dispute.deviceModel || "Device",
      imei: dispute.imei || "350000000000000",
      issueType: dispute.issueType || "Fake / Replaced Screen",
      detectedAt: dispute.detectedAt || new Date().toISOString().split("T")[0],
      status: dispute.status || "RTV Dispatched",
      claimedAmount: dispute.claimedAmount || 25000,
    };
    setVendorDisputes((prev) => [fullDispute, ...prev]);
    showToast(`Dispute / RTV claim ${fullDispute.id} created against ${fullDispute.supplierName}!`, "info");
  };

  const updateVendorDisputeStatus = (id: string, status: VendorDispute["status"]) => {
    setVendorDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d))
    );
    showToast(`Dispute ${id} marked as ${status}`, "info");
  };

  const addCustomer = (customer: Partial<Customer>) => {
    const id = `CUST-${Math.floor(910 + customers.length)}`;
    const fullCustomer: Customer = {
      id,
      name: customer.name || "New Customer",
      phone: customer.phone || "+91 98000 00000",
      email: customer.email || "cust@example.com",
      city: customer.city || "Mumbai",
      totalOrders: 0,
      lifetimeValue: 0,
      activeWarrantyCount: 0,
      returnsCount: 0,
      lastPurchaseDate: new Date().toISOString().split("T")[0],
      loyaltyTier: "Standard",
    };
    setCustomers((prev) => [fullCustomer, ...prev]);
    showToast(`Customer ${fullCustomer.name} created!`, "success");
  };

  const updateAccessoryStock = (id: string, change: number) => {
    setAccessories((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, stockQty: Math.max(0, acc.stockQty + change) } : acc))
    );
    showToast(`Accessory stock updated.`, "info");
  };

  const addEmployee = (emp: Partial<Employee>) => {
    const id = `EMP-${100 + employees.length + 1}`;
    const fullEmp: Employee = {
      id,
      name: emp.name || "Employee",
      role: emp.role || "QC Technician",
      email: emp.email || "staff@thefundu.com",
      phone: emp.phone || "+91 98000 00000",
      warehouse: emp.warehouse || "Mumbai Central Hub",
      tasksCompleted: 0,
      efficiencyScore: 100,
      status: "Active",
      joiningDate: new Date().toISOString().split("T")[0],
    };
    setEmployees((prev) => [fullEmp, ...prev]);
    showToast(`Employee ${fullEmp.name} onboarded!`, "success");
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast("All notifications marked as read.", "info");
  };

  // Authentication & Access Control Handlers
  const login = (emailOrId: string, pass: string): boolean => {
    const clean = emailOrId.trim().toLowerCase();
    const matched =
      systemUsers.find(
        (u) =>
          (u.email.toLowerCase() === clean || u.id.toLowerCase() === clean) &&
          u.password === pass
      ) ||
      INITIAL_USERS.find(
        (u) =>
          (u.email.toLowerCase() === clean || u.id.toLowerCase() === clean) &&
          u.password === pass
      );

    if (matched) {
      const profile: UserProfile = {
        id: matched.id,
        name: matched.name,
        email: matched.email,
        role: matched.role,
        storeCode: matched.storeCode,
        storeName: matched.storeName,
        phone: matched.phone,
        pin: matched.pin,
      };
      setCurrentUser(profile);
      setUserRole(profile.role);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(profile));
          localStorage.setItem(STORAGE_KEYS.userRole, profile.role);
        } catch (e) {}
      }
      showToast(`Welcome ${profile.name}! Logged in as ${profile.role.toUpperCase()}.`, "success");
      return true;
    }

    showToast("Invalid Credentials. Please check your Email / Employee ID and Password.", "error");
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEYS.authUser);
      } catch (e) {}
    }
    showToast("Signed out successfully.", "info");
  };

  const updateSystemUser = (roleOrId: string, updates: Partial<typeof INITIAL_USERS[0]>) => {
    const updated = systemUsers.map((u) => (u.role === roleOrId || u.id === roleOrId ? { ...u, ...updates } : u));
    setSystemUsers(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.systemUsers, JSON.stringify(updated));
      } catch (e) {}
    }
    // Also sync currentUser if this is the active user
    if (currentUser && (currentUser.role === roleOrId || currentUser.id === roleOrId)) {
      const updatedCurrent: UserProfile = {
        ...currentUser,
        ...(updates.name ? { name: updates.name } : {}),
        ...(updates.email ? { email: updates.email } : {}),
        ...(updates.phone ? { phone: updates.phone } : {}),
        ...(updates.storeCode ? { storeCode: updates.storeCode } : {}),
        ...(updates.pin ? { pin: updates.pin } : {}),
      };
      setCurrentUser(updatedCurrent);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(updatedCurrent));
        } catch (e) {}
      }
    }
    showToast(`Staff & Role assignee updated successfully!`, "success");
  };

  const updateCurrentUserProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated: UserProfile = { ...currentUser, ...updates };
    setCurrentUser(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(updated));
      } catch (e) {}
    }
    // Also sync into systemUsers
    const updatedSystem = systemUsers.map((u) =>
      u.id === currentUser.id || u.role === currentUser.role
        ? {
            ...u,
            ...(updates.name ? { name: updates.name } : {}),
            ...(updates.email ? { email: updates.email } : {}),
            ...(updates.phone ? { phone: updates.phone } : {}),
          }
        : u
    );
    setSystemUsers(updatedSystem);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.systemUsers, JSON.stringify(updatedSystem));
      } catch (e) {}
    }
    showToast(`Your profile name has been updated to "${updated.name}"!`, "success");
  };

  const updateStore = (id: string, updates: Partial<Warehouse>) => {
    const updated = warehouses.map((w) => (w.id === id || w.code === id ? { ...w, ...updates } : w));
    setWarehouses(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.warehouses, JSON.stringify(updated));
      } catch (e) {}
    }
    const target = updated.find((w) => w.id === id || w.code === id);
    if (target) {
      upsertCloudWarehouse(target).catch(console.error);
    }
    showToast("Store details updated & synced to Cloud!", "success");
  };

  const deleteStore = (id: string) => {
    if (warehouses.length <= 1) {
      showToast("Cannot delete the only configured primary store outlet.", "error");
      return;
    }
    const updated = warehouses.filter((w) => w.id !== id && w.code !== id);
    setWarehouses(updated);
    if (selectedStoreId === id || warehouses.find((w) => w.id === id)?.code === selectedStoreId) {
      setSelectedStoreId(updated[0].id);
    }
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.warehouses, JSON.stringify(updated));
      } catch (e) {}
    }
    showToast("Store outlet removed successfully.", "info");
  };

  const updateInvoiceSettings = (updates: Partial<InvoiceSettings>) => {
    setInvoiceSettings((prev) => {
      const next = { ...prev, ...updates };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEYS.invoiceSettings, JSON.stringify(next));
        } catch (e) {}
      }
      return next;
    });
    showToast("Invoice & company settings updated!", "success");
  };

  const updateRolePermissions = (role: UserRole, permissions: string[]) => {
    setRolePermissions((prev) => {
      const next = { ...prev, [role]: permissions };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEYS.rolePermissions, JSON.stringify(next));
        } catch (e) {}
      }
      return next;
    });
    showToast(`Permissions updated for ${role.toUpperCase()}!`, "success");
  };

  // Spare Parts Implementation
  const addSparePart = (part: Partial<SparePart>): SparePart => {
    const id = `PRT-APL-${String(spareParts.length + 1).padStart(3, "0")}`;
    const fullPart: SparePart = {
      id,
      name: part.name || "Replacement Part",
      partNumber: part.partNumber || `OEM-${Date.now().toString().slice(-6)}`,
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
    showToast(`Spare part ${fullPart.name} added to stock!`, "success");
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
      showToast(`Insufficient stock for ${targetPart.name}!`, "error");
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

    showToast(`Installed ${targetPart.name} (-1 from stock, added ${targetPart.unitCost} to repair cost)`, "info");
  };

  // Buyback Implementation
  const addBuyback = (buyback: Partial<BuybackRecord>, autoInwardToInventory: boolean = true): BuybackRecord => {
    const id = `BB-LKO-2611-${String(buybacks.length + 1).padStart(3, "0")}`;
    const fullBB: BuybackRecord = {
      id,
      date: buyback.date || new Date().toISOString().split("T")[0],
      brand: buyback.brand || "Apple",
      model: buyback.model || "iPhone 13",
      storage: buyback.storage || "128GB",
      colour: buyback.colour || "Midnight",
      imei1: buyback.imei1 || "35" + Math.floor(1000000000000 + Math.random() * 9000000000000),
      imei2: buyback.imei2,
      serialNumber: buyback.serialNumber || `SNBB-${2600 + buybacks.length + 1}`,
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
      sellerEmail: buyback.sellerEmail || "",
      sellerAddress: buyback.sellerAddress || "ED-476, Sector-Q, Aliganj, Lucknow, UP 226024",
      sellerIdType: buyback.sellerIdType || "Aadhaar",
      sellerIdNumber: buyback.sellerIdNumber || "XXXX-XXXX-1234",
      sellerIdPhotoFront: buyback.sellerIdPhotoFront,
      sellerIdPhotoBack: buyback.sellerIdPhotoBack,
      sellerPhoto: buyback.sellerPhoto,
      policeVerificationStatus: "Cleared",
      ceirStatus: "Clean",
      ownershipDeclarationSigned: true,
      evaluatedBy: buyback.evaluatedBy || "Abhay Verma (Store Manager)",
      storeLocation: buyback.storeLocation || "Lucknow Store (LKO-01)",
    };

    if (autoInwardToInventory) {
      const newDev = addDevice({
        id: fullBB.inwardDeviceId,
        brand: fullBB.brand,
        model: fullBB.model,
        storage: fullBB.storage,
        colour: fullBB.colour,
        imei1: fullBB.imei1,
        imei2: fullBB.imei2,
        batteryHealth: fullBB.batteryHealth,
        status: (buyback as any).status || "In Stock",
        warehouse: fullBB.storeLocation,
        supplierName: `Customer Buyback (${fullBB.sellerName})`,
        customerKyc: {
          sellerName: fullBB.sellerName,
          sellerPhone: fullBB.sellerPhone,
          sellerEmail: fullBB.sellerEmail,
          sellerAddress: fullBB.sellerAddress,
          sellerIdType: fullBB.sellerIdType,
          sellerIdNumber: fullBB.sellerIdNumber,
          sellerIdPhotoFront: fullBB.sellerIdPhotoFront,
          sellerIdPhotoBack: fullBB.sellerIdPhotoBack,
          sellerPhoto: fullBB.sellerPhoto,
          payoutAmount: fullBB.finalOfferedPrice,
          payoutMethod: fullBB.payoutMethod,
          payoutDate: fullBB.date,
          ceirStatus: fullBB.ceirStatus,
          ownershipDeclarationSigned: fullBB.ownershipDeclarationSigned,
        },
        costs: {
          purchasePrice: fullBB.finalOfferedPrice,
          repairCost: 0,
          testingCost: 500,
          packagingCost: 400,
          logisticsCost: 200,
          otherCost: 200,
          totalLandedCost: fullBB.finalOfferedPrice + 1300,
          sellingPrice: (buyback as any).costs?.sellingPrice || Math.round(fullBB.finalOfferedPrice * 1.25),
          projectedProfit: ((buyback as any).costs?.sellingPrice || Math.round(fullBB.finalOfferedPrice * 1.25)) - (fullBB.finalOfferedPrice + 1300),
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
    showToast(`Buyback agreement ${fullBB.id} signed & inwarded to Lucknow Store!`, "success");
    return fullBB;
  };

  // Day-End Settlement Implementation
  const recordDayEndSettlement = (settlement: Partial<DayEndSettlement>): DayEndSettlement => {
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const id = settlement.id || `Z-LKO-${todayStr}`;
    const fullZ: DayEndSettlement = {
      id,
      date: settlement.date || new Date().toISOString().split("T")[0],
      storeCode: settlement.storeCode || "LKO-01",
      storeName: settlement.storeName || "Lucknow Store (LKO-01)",
      openedBy: settlement.openedBy || "Abhay Verma (Store Manager)",
      closedBy: settlement.closedBy || `${currentUser?.name || "Abhay Verma"} (Admin)`,
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
    showToast(`Day-End Z-Report ${fullZ.id} finalized for Lucknow Store!`, "success");
    return fullZ;
  };

  // Warranty Claim Implementation
  const addWarrantyClaim = (claim: Partial<WarrantyClaim>): WarrantyClaim => {
    const id = `CLM-${Date.now().toString().slice(-5)}`;
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
    showToast(`Warranty claim ${fullClaim.id} registered!`, "success");
    return fullClaim;
  };

  return (
    <AppContext.Provider
      value={{
        devices,
        purchases,
        sales,
        stockMovements,
        qcInspections,
        repairs,
        suppliers,
        vendorConsignments,
        vendorPayouts,
        vendorDisputes,
        customers,
        warehouses,
        stores: warehouses,
        accessories,
        employees,
        notifications,
        dateFilter,
        globalSearch,
        isSidebarCollapsed,
        theme,
        toasts,
        setDateFilter,
        setGlobalSearch,
        setIsSidebarCollapsed,
        toggleSidebar,
        setTheme,
        toggleTheme,
        showToast,
        dismissToast,
        addDevice,
        updateDevice,
        deleteDevice,
        setAllDevicesInStock,
        addPurchase,
        addSale,
        deleteSale,
        clearAllSales,
        recoverAllSales,
        updateSalesDeliveryStatus,
        addStockMovement,
        submitQCInspection,
        routeDeviceToRepair,
        addRepairJob,
        updateRepairJob,
        transferWarehouseStock,
        addStore,
        addSupplier,
        updateSupplier,
        addVendorConsignment,
        updateVendorConsignmentStatus,
        recordVendorPayout,
        addVendorDispute,
        updateVendorDisputeStatus,
        addCustomer,
        updateAccessoryStock,
        addEmployee,
        markNotificationAsRead,
        markAllNotificationsAsRead,

        // RBAC
        currentUser,
        login,
        logout,
        systemUsers,
        updateSystemUser,
        updateCurrentUserProfile,
        rolePermissions,
        updateRolePermissions,

        // RBAC
        userRole,
        setUserRole,
        isCashierMode,

        // Multi-Store
        selectedStoreId,
        setSelectedStoreId,
        updateStore,
        deleteStore,

        // Invoice Settings
        invoiceSettings,
        updateInvoiceSettings,

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

        // Multi-Laptop Cloud Synchronization & Backup
        isCloudSyncing,
        cloudSyncStatus,
        syncWithCloud,
        exportStoreBackup,
        importStoreBackup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

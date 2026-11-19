export type DeviceGrade = 'A+' | 'A' | 'B' | 'C' | 'D' | 'Scrap';

export const SMARTPHONE_BRANDS = [
  "Apple",
  "Samsung",
  "OnePlus",
  "Google Pixel",
  "Xiaomi",
  "Redmi",
  "POCO",
  "Vivo",
  "Oppo",
  "Realme",
  "Motorola",
  "Nothing",
  "iQOO",
  "Infinix",
  "Tecno",
  "Honor",
  "Asus",
  "Sony",
  "Nokia",
  "Lava",
  "Other",
] as const;

export type SmartphoneBrand = typeof SMARTPHONE_BRANDS[number] | string;

export type DeviceStatus = 
  | 'In Stock' 
  | 'Reserved' 
  | 'QC Pending' 
  | 'Under Repair' 
  | 'Ready for Sale' 
  | 'Sold' 
  | 'Damaged' 
  | 'Returned';

export type WarehouseLocation = string;

export interface QCCheckItem {
  id: string;
  name: string;
  passed: boolean;
  notes?: string;
}

export interface QCInspection {
  id: string;
  deviceId: string;
  inspectorName: string;
  inspectionDate: string;
  batteryHealthPercent: number;
  gradeAssigned?: DeviceGrade;
  checklist: {
    display: boolean;
    touchscreen: boolean;
    battery: boolean;
    faceId: boolean;
    fingerprint: boolean;
    cameras: boolean;
    speakers: boolean;
    microphone: boolean;
    chargingPort: boolean;
    simNetwork: boolean;
    wifi: boolean;
    bluetooth: boolean;
    physicalCondition: boolean;
  };
  notes: string;
  images: string[];
  status: 'Approved' | 'Rejected' | 'Needs Repair';
}

export interface RepairJob {
  id: string;
  deviceId: string;
  deviceModel: string;
  imei: string;
  technicianName: string;
  problemDescription: string;
  partsReplaced: string[];
  repairCost: number;
  status: 'Pending' | 'In Progress' | 'Awaiting Parts' | 'Completed' | 'Quality Passed';
  startDate: string;
  completionDate?: string;
  beforeImages: string[];
  afterImages: string[];
  notes?: string;
}

export interface DeviceCosts {
  purchasePrice: number;
  repairCost: number;
  testingCost: number;
  packagingCost: number;
  logisticsCost: number;
  otherCost: number;
  totalLandedCost: number;
  sellingPrice: number;
  projectedProfit: number;
  profitMarginPercent: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface Device {
  id: string; // e.g. TFD-2026-9041
  brand: string;
  model: string;
  storage: string;
  ram?: string;
  colour: string;
  imei1: string;
  imei2?: string;
  serialNumber: string;
  sku: string;
  batteryHealth?: number; // percentage (Strictly Apple iPhones)
  grade?: DeviceGrade;
  status: DeviceStatus;
  warehouse: WarehouseLocation;
  costs: DeviceCosts;
  supplierId: string;
  supplierName: string;
  purchaseDate: string;
  images: string[];
  qcInspection?: QCInspection;
  repairHistory: RepairJob[];
  activityTimeline: ActivityLog[];
  specifications: {
    chipset: string;
    screenSize: string;
    cameraSpecs: string;
    network: string;
    osVersion: string;
  };
  customerKyc?: {
    sellerName: string;
    sellerPhone: string;
    sellerEmail?: string;
    sellerAddress?: string;
    sellerIdType: 'Aadhaar' | 'PAN' | 'Driving License';
    sellerIdNumber: string;
    sellerIdPhotoFront?: string;
    sellerIdPhotoBack?: string;
    sellerPhoto?: string;
    payoutAmount: number;
    payoutMethod: 'UPI' | 'Cash' | 'Bank Transfer';
    payoutDate: string;
    ceirStatus: 'Clean' | 'Flagged';
    ownershipDeclarationSigned: boolean;
  };
}

export interface PurchaseOrder {
  id: string; // PO-8831
  supplierId: string;
  supplierName: string;
  supplierContact: string;
  supplierGst?: string;
  date: string;
  itemsCount: number;
  devices: {
    model: string;
    imei: string;
    grade: DeviceGrade;
    price: number;
  }[];
  totalAmount: number;
  paymentStatus: 'Paid' | 'Partial' | 'Pending';
  amountPaid: number;
  balanceDue: number;
  warehouse: WarehouseLocation;
  invoiceNumber: string;
  notes?: string;
}

export type SalesChannelCode = 'FSO' | 'ONS' | 'FOR' | 'DS';
export type SaleTypeCode = 'B2C' | 'B2B' | 'Corporate';

export interface SalesOrder {
  id: string; // Systematic order ID e.g. TFD-FSO-2611-0001
  orderNo?: string; // Systematic order serial
  channelOrderNo?: string;
  channel?: SalesChannelCode;
  channelName?: string;
  typeOfSale?: SaleTypeCode;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  customerLocalAddress?: string;
  customerPermanentAddress?: string;
  customerAadhaar?: string;
  customerGstin?: string;
  placeOfSupply?: string;
  date: string;
  deviceId: string;
  deviceModel: string;
  imei: string;
  serialNumber?: string;
  sellingPrice: number;
  discount: number;
  taxAmount: number;
  finalAmount: number;
  paymentMethod: 'UPI' | 'Card' | 'Bank Transfer' | 'Cash' | 'EMI' | 'Split (Cash + Online)';
  splitPayment?: {
    cashAmount: number;
    onlineAmount: number;
    onlineMode?: 'UPI' | 'Card' | 'Bank Transfer' | 'NetBanking' | string;
    onlineTxnId?: string;
  };
  paymentStatus: 'Completed' | 'Pending' | 'Failed';
  emiPlan?: {
    months: number;
    monthlyEmi: number;
    financier: string;
    status: 'Active' | 'Settled';
  };
  deliveryStatus: 'Order Placed' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Returned';
  trackingNumber?: string;
  warrantyMonths: number;
  warrantyExpiry: string;
  invoiceUrl?: string;
  invoiceNumber?: string;
}

export interface StockMovement {
  id: string;
  date: string;
  type: 'Inward' | 'Outward';
  reason: 
    | 'Purchase Received' 
    | 'Customer Return' 
    | 'Warehouse Transfer Received' 
    | 'Manual Adjustment (In)'
    | 'Sold' 
    | 'Supplier Return' 
    | 'Warehouse Transfer Dispatched' 
    | 'Damaged Write-off';
  deviceId: string;
  deviceModel: string;
  imei: string;
  fromLocation: string;
  toLocation: string;
  quantity: number;
  value: number;
  initiatedBy: string;
  notes?: string;
}

export type VendorCategory = 
  | 'Enterprise Buyback Aggregator' 
  | 'Regional Wholesale Stockist' 
  | 'Corporate ITAD & Liquidation' 
  | 'Retail Franchise Sourcing' 
  | 'Direct OEM Exchange';

export type VendorTier = 'Tier 1 (Strategic Partner)' | 'Tier 2 (Preferred Wholesale)' | 'Tier 3 (Spot Buy Partner)';
export type VendorPaymentTerm = 'Net 0 (Immediate)' | 'Net 7' | 'Net 15' | 'Net 30' | 'Advance 50%' | 'Post-QC Settlement';

export interface Supplier {
  id: string;
  name: string;
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  gstNumber: string;
  totalPurchasesCount: number;
  totalPurchasedValue: number;
  outstandingBalance: number;
  rating: number;
  status: 'Active' | 'Under Review' | 'Inactive';
  category?: VendorCategory;
  tier?: VendorTier;
  paymentTerms?: VendorPaymentTerm;
  creditLimit?: number;
  qcPassRate?: number;
  lotRejectionCount?: number;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
    pan: string;
    upiId?: string;
  };
  kycVerified?: boolean;
}

export interface VendorConsignment {
  id: string; // LOT-2026-BOM-88
  supplierId: string;
  supplierName: string;
  date: string;
  totalDevices: number;
  qcPassedCount: number;
  qcRejectedCount: number;
  totalValue: number;
  settlementStatus: 'Pending QC' | 'QC Completed' | 'Settlement Approved' | 'Paid in Full' | 'Disputed';
  warehouse: WarehouseLocation;
  manifestItems: {
    model: string;
    imei: string;
    offeredGrade: DeviceGrade;
    evaluatedGrade: DeviceGrade;
    price: number;
    status: 'Accepted' | 'Rejected (RTV)' | 'Price Renegotiated';
    reason?: string;
  }[];
}

export interface VendorPayout {
  id: string; // PAY-9921
  supplierId: string;
  supplierName: string;
  date: string;
  amount: number;
  mode: 'NEFT/RTGS' | 'UPI' | 'Cheque' | 'Credit Note Adjustment';
  utrNumber: string;
  tdsDeducted: number;
  status: 'Processed' | 'Scheduled' | 'Pending Approval';
  invoiceRef: string;
  settledConsignments: string[];
}

export interface VendorDispute {
  id: string; // RTV-441
  supplierId: string;
  supplierName: string;
  deviceId: string;
  deviceModel: string;
  imei: string;
  issueType: 'iCloud / Activation Lock' | 'Knox / MDM Managed' | 'Fake / Replaced Screen' | 'Blacklisted / CEIR Block' | 'Severe Motherboard Water Damage';
  detectedAt: string;
  status: 'RTV Dispatched' | 'Credit Note Issued' | 'Replacement Inwarded' | 'Under Dispute';
  claimedAmount: number;
  resolutionDate?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  totalOrders: number;
  lifetimeValue: number;
  activeWarrantyCount: number;
  returnsCount: number;
  lastPurchaseDate: string;
  loyaltyTier: 'Gold' | 'Silver' | 'Platinum' | 'Standard';
}

export interface Warehouse {
  id: string;
  name: string;
  code: string; // e.g. LKO-01, DEL-01, BOM-01
  city?: string;
  location?: string; // e.g. Gomti Nagar, Lucknow
  address: string;
  managerName: string;
  managerPhone: string;
  totalCapacity: number;
  currentStockUnits: number;
  totalStockValue: number;
  underRepairUnits: number;
  qcPendingUnits: number;
  status?: 'Active' | 'Upcoming' | 'Inactive';
}

export type Store = Warehouse;

export interface Accessory {
  id: string;
  name: string;
  category: 'Charger' | 'Cable' | 'Case' | 'Screen Protector' | 'Audio' | 'Packaging Box';
  compatibleBrand: string;
  stockQty: number;
  reorderLevel: number;
  costPrice: number;
  sellingPrice: number;
  warehouse: WarehouseLocation;
  sku: string;
}

export interface Employee {
  id: string;
  name: string;
  role: 'QC Technician' | 'Hardware Engineer' | 'Inventory Lead' | 'Sales Manager' | 'Operations Executive';
  email: string;
  phone: string;
  warehouse: WarehouseLocation;
  tasksCompleted: number;
  efficiencyScore: number;
  status: 'Active' | 'On Leave' | 'Inactive';
  joiningDate: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'alert' | 'info' | 'success' | 'warning';
  link?: string;
}

// User Roles & Access Control
export type UserRole = 'admin' | 'manager' | 'cashier' | 'technician';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  storeCode: string;
  storeName: string;
  phone?: string;
  pin: string; // 4-digit POS unlock PIN
}

export interface InvoiceSettings {
  companyLegalName: string;
  registeredAddress: string;
  cin: string;
  gstin: string;
  pan: string;
  stateName: string;
  stateCode: string;
  tollFree: string;
  supportEmail: string;
  whatsappPhone: string;
  defaultWarrantyDays: number;
  termsAndConditions: string[];
}

// Technician Spare Parts & Component Inventory
export interface SparePart {
  id: string;
  name: string;
  partNumber: string;
  category: 'Display' | 'Battery' | 'Camera' | 'Housing' | 'Charging Port' | 'Speaker/Mic' | 'Motherboard IC';
  compatibleModels: string[];
  stockQuantity: number;
  minReorderLevel: number;
  unitCost: number;
  sellingPrice: number;
  supplierName: string;
  storeLocation: string;
  lastRestockedDate: string;
}

// Customer Buyback / Trade-In Valuation & CEIR Legal Declaration
export interface BuybackRecord {
  id: string;
  date: string;
  brand: string;
  model: string;
  storage: string;
  colour: string;
  imei1: string;
  imei2?: string;
  serialNumber?: string;
  batteryHealth?: number;
  screenCondition: 'Flawless' | 'Minor Scratches' | 'Cracked';
  bodyCondition: 'Flawless' | 'Minor Scratches' | 'Dented';
  functionalIssues: string[];
  hasOriginalBox: boolean;
  hasOriginalBill: boolean;
  baseMarketValue: number;
  deductionsTotal: number;
  finalOfferedPrice: number;
  payoutStatus: 'Completed' | 'Pending';
  payoutMethod: 'UPI' | 'Cash' | 'Bank Transfer';
  sellerName: string;
  sellerPhone: string;
  sellerEmail?: string;
  sellerAddress?: string;
  sellerIdType: 'Aadhaar' | 'PAN' | 'Driving License';
  sellerIdNumber: string;
  sellerIdPhotoFront?: string;
  sellerIdPhotoBack?: string;
  sellerPhoto?: string;
  policeVerificationStatus: 'Cleared' | 'Pending';
  ceirStatus: 'Clean' | 'Flagged';
  ownershipDeclarationSigned: boolean;
  evaluatedBy: string;
  storeLocation: string;
  inwardDeviceId?: string;
}

// Daily Store Cash Drawer & Day-End Closing (Z-Report)
export interface DayEndSettlement {
  id: string;
  date: string;
  storeCode: string;
  storeName: string;
  openedBy: string;
  closedBy: string;
  totalOrdersCount: number;
  channelBreakdown: { FSO: number; ONS: number; FOR: number; DS: number };
  grossSalesAmount: number;
  totalDiscountGiven: number;
  netRevenue: number;
  cashExpected: number;
  cashActualCounted: number;
  cashVariance: number;
  upiTotal: number;
  cardSwipeTotal: number;
  bankTransferTotal: number;
  handsetsSold: string[];
  handsetsInwardedCount: number;
  repairsCompletedCount: number;
  physicalStockVerified: boolean;
  status: 'Closed & Reconciled' | 'Discrepancy Flagged';
  closingNotes?: string;
  timestamp: string;
}

// Customer Warranty Verification & Claims
export interface WarrantyClaim {
  id: string;
  deviceId: string;
  serialNumber: string;
  customerName: string;
  customerPhone: string;
  issueDescription: string;
  claimDate: string;
  warrantyStatus: 'Active' | 'Expired';
  status: 'Submitted' | 'In Inspection' | 'Approved & Serviced' | 'Rejected';
  assignedTechnician?: string;
}

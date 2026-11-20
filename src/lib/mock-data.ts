import {
  SparePart,
  BuybackRecord,
  DayEndSettlement,
  WarrantyClaim,
  UserProfile,
  UserRole, Device, PurchaseOrder, SalesOrder, StockMovement, QCInspection, RepairJob, Supplier, Customer, Warehouse, Accessory, Employee, AppNotification, VendorConsignment, VendorPayout, VendorDispute } from "./types";

export const initialWarehouses: Warehouse[] = [
  {
    id: "STR-LKO-01",
    name: "Lucknow Store (LKO-01)",
    code: "LKO-01",
    city: "Lucknow",
    location: "Gomti Nagar, Lucknow",
    address: "Gomti Nagar, Lucknow",
    currentStockUnits: 75,
    managerName: "Abhay Verma",
    managerPhone: "+91 79919 90508",
    totalCapacity: 2000,
    totalStockValue: 4250000,
    underRepairUnits: 2,
    qcPendingUnits: 5,
    status: "Active",
  },
  {
    id: "STR-LKO-02",
    name: "Lucknow Gomti Nagar Store (LKO-02)",
    code: "LKO-02",
    city: "Lucknow",
    location: "Riverside Plaza, Gomti Nagar, Lucknow",
    address: "Shop 14-16, Ground Floor, Riverside Plaza, Vipin Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010.",
    managerName: "Rohan Gupta",
    managerPhone: "+91 98390 12845",
    totalCapacity: 1500,
    currentStockUnits: 28,
    totalStockValue: 1420000,
    underRepairUnits: 0,
    qcPendingUnits: 2,
    status: "Active",
  },
  {
    id: "STR-KNP-01",
    name: "Kanpur Civil Lines Experience Store (KNP-01)",
    code: "KNP-01",
    city: "Kanpur",
    location: "Civil Lines, Kanpur",
    address: "42/1, Mall Road, Near Som Dutt Plaza, Civil Lines, Kanpur, Uttar Pradesh 208001.",
    managerName: "Pradeep Mishra",
    managerPhone: "+91 94500 88214",
    totalCapacity: 1200,
    currentStockUnits: 18,
    totalStockValue: 980000,
    underRepairUnits: 1,
    qcPendingUnits: 1,
    status: "Active",
  },
  {
    id: "STR-DEL-01",
    name: "Delhi Connaught Place Hub (DEL-01)",
    code: "DEL-01",
    city: "New Delhi",
    location: "Connaught Place, Central Delhi",
    address: "Block E, Inner Circle, Connaught Place, New Delhi, Delhi 110001.",
    managerName: "Rajesh Malhotra",
    managerPhone: "+91 98110 44210",
    totalCapacity: 2500,
    currentStockUnits: 45,
    totalStockValue: 2890000,
    underRepairUnits: 3,
    qcPendingUnits: 4,
    status: "Active",
  },
];

export const initialSuppliers: Supplier[] = [
  {
    id: "SUP-001",
    name: "Esterline Bulk Refurb Solutions",
    company: "Esterline Bonaparte Corp Pte",
    contactPerson: "Rajiv Deshmukh",
    email: "procurement@esterlinebonaparte.com",
    phone: "+91 98210 55432",
    address: "Bandra Kurla Complex, Mumbai, Maharashtra 400051",
    gstNumber: "27AABCE1234F1Z8",
    totalPurchasesCount: 148,
    totalPurchasedValue: 48200000,
    outstandingBalance: 1250000,
    rating: 4.9,
    status: "Active",
    category: "Corporate ITAD & Liquidation",
    tier: "Tier 1 (Strategic Partner)",
    paymentTerms: "Net 15",
    creditLimit: 5000000,
    qcPassRate: 98.4,
    lotRejectionCount: 1,
    bankDetails: {
      accountName: "Esterline Bonaparte Corp Pte Ltd",
      accountNumber: "98201948201920",
      ifsc: "HDFC0000128",
      bankName: "HDFC Bank BKC Mumbai",
      pan: "AAACE4419E",
      upiId: "esterline@hdfcbank",
    },
    kycVerified: true,
  },
  {
    id: "SUP-002",
    name: "TheFundu Enterprise Sourcing Hub",
    company: "National Refurb Exchange Ltd",
    contactPerson: "Arjun Mehta",
    email: "sourcing@thefundu.com",
    phone: "+91 98101 22849",
    address: "Cyber City, DLF Phase 2, Gurugram, Haryana 122002",
    gstNumber: "06AAACM9981B1ZG",
    totalPurchasesCount: 84,
    totalPurchasedValue: 28400000,
    outstandingBalance: 650000,
    rating: 4.7,
    status: "Active",
    category: "Enterprise Buyback Aggregator",
    tier: "Tier 1 (Strategic Partner)",
    paymentTerms: "Net 7",
    creditLimit: 3000000,
    qcPassRate: 96.8,
    lotRejectionCount: 3,
    bankDetails: {
      accountName: "National Refurb Exchange Limited",
      accountNumber: "00210500918231",
      ifsc: "ICIC0000021",
      bankName: "ICICI Bank Cyber City Gurugram",
      pan: "AALCR4945H",
      upiId: "thefundub2b@icici",
    },
    kycVerified: true,
  },
  {
    id: "SUP-003",
    name: "Global Trade Tech Dubai",
    company: "Global Trade Tech FZCO",
    contactPerson: "Hamza Tariq",
    email: "sales@globaltradetech.ae",
    phone: "+971 50 892 4110",
    address: "DAFZA Industrial Area, Dubai, UAE",
    gstNumber: "TAX-EXP-992182",
    totalPurchasesCount: 36,
    totalPurchasedValue: 39500000,
    outstandingBalance: 0,
    rating: 4.8,
    status: "Active",
    category: "Direct OEM Exchange",
    tier: "Tier 1 (Strategic Partner)",
    paymentTerms: "Advance 50%",
    creditLimit: 8000000,
    qcPassRate: 99.1,
    lotRejectionCount: 0,
    bankDetails: {
      accountName: "Global Trade Tech FZCO",
      accountNumber: "AE480330000982019482",
      ifsc: "EBILAEADXXX",
      bankName: "Emirates NBD Bank Dubai",
      pan: "FOREIGN991",
    },
    kycVerified: true,
  },
  {
    id: "SUP-004",
    name: "Recommerce Supply India",
    company: "Recommerce Tech Pvt Ltd",
    contactPerson: "Pooja Hegde",
    email: "enterprise@recommerceindia.com",
    phone: "+91 97412 88319",
    address: "Koramangala 4th Block, Bengaluru, Karnataka 560034",
    gstNumber: "29AADCR4419E1ZP",
    totalPurchasesCount: 52,
    totalPurchasedValue: 16800000,
    outstandingBalance: 420000,
    rating: 4.6,
    status: "Active",
    category: "Regional Wholesale Stockist",
    tier: "Tier 2 (Preferred Wholesale)",
    paymentTerms: "Net 15",
    creditLimit: 2000000,
    qcPassRate: 95.2,
    lotRejectionCount: 2,
    bankDetails: {
      accountName: "Recommerce Tech Private Limited",
      accountNumber: "50200049182014",
      ifsc: "HDFC0000542",
      bankName: "HDFC Bank Koramangala Bengaluru",
      pan: "AADCR4419E",
    },
    kycVerified: true,
  },
  {
    id: "SUP-005",
    name: "InstaCash Enterprise Liquidation",
    company: "CompAsia Retail Solutions",
    contactPerson: "Devendra Verma",
    email: "wholesale@instacash.in",
    phone: "+91 96500 44102",
    address: "Nehru Place Commercial Hub, New Delhi 110019",
    gstNumber: "07AAACI7721L1ZK",
    totalPurchasesCount: 29,
    totalPurchasedValue: 9200000,
    outstandingBalance: 180000,
    rating: 4.4,
    status: "Active",
    category: "Enterprise Buyback Aggregator",
    tier: "Tier 2 (Preferred Wholesale)",
    paymentTerms: "Net 7",
    creditLimit: 1500000,
    qcPassRate: 94.6,
    lotRejectionCount: 4,
    bankDetails: {
      accountName: "CompAsia Retail Solutions Pvt Ltd",
      accountNumber: "10928401928310",
      ifsc: "KKBK0000198",
      bankName: "Kotak Mahindra Bank Nehru Place",
      pan: "AAACI7721L",
    },
    kycVerified: true,
  },
];

export const initialVendorConsignments: VendorConsignment[] = [];

export const initialVendorPayouts: VendorPayout[] = [];

export const initialVendorDisputes: VendorDispute[] = [];

export const initialCustomers: Customer[] = [
  {
    id: "CUST-001",
    name: "ALTAF",
    phone: "74608646362",
    email: "NA",
    city: "Lucknow",
    totalOrders: 1,
    lifetimeValue: 43000,
    activeWarrantyCount: 1,
    returnsCount: 0,
    lastPurchaseDate: "2026-11-15",
    loyaltyTier: "Gold",
  },
  {
    id: "CUST-002",
    name: "MANISH SINGH",
    phone: "8299800996",
    email: "hkltha1235@gmail.com",
    city: "Lucknow",
    totalOrders: 2,
    lifetimeValue: 26000,
    activeWarrantyCount: 2,
    returnsCount: 0,
    lastPurchaseDate: "2026-11-19",
    loyaltyTier: "Platinum",
  },
];

export const initialDevices: Device[] = [
  {
    "id": "Fun-26000",
    "brand": "Apple",
    "model": "iPhone 12 mini (blue)",
    "storage": "64 gb",
    "colour": "blue",
    "imei1": "355997875777052",
    "imei2": "355997875825208",
    "serialNumber": "SN26000",
    "sku": "TFD-26000-APP",
    "batteryHealth": 90,
    "grade": "A+",
    "status": "Sold",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 14040,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 14790,
      "sellingPrice": 18000,
      "projectedProfit": 3210,
      "profitMarginPercent": 17.8
    },
    "sellingPrice": 18000,
    "purchasePrice": 14040,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Apple Bionic / A-Series",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "iOS 18"
    },
    "activityTimeline": [
      {
        "id": "ACT-26000-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26000."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26001",
    "brand": "Apple",
    "model": "iPhone 15 pro max (blue)",
    "storage": "256 gb",
    "colour": "blue",
    "imei1": "355319540975419",
    "imei2": "355319540921025",
    "serialNumber": "SN26001",
    "sku": "TFD-26001-APP",
    "batteryHealth": 91,
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 54600,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 55350,
      "sellingPrice": 70000,
      "projectedProfit": 14650,
      "profitMarginPercent": 20.9
    },
    "sellingPrice": 70000,
    "purchasePrice": 54600,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Apple Bionic / A-Series",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "iOS 18"
    },
    "activityTimeline": [
      {
        "id": "ACT-26001-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26001."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26002",
    "brand": "Other",
    "model": "14 pro max (blue)",
    "storage": "256 gb",
    "colour": "blue",
    "imei1": "354064853721668",
    "imei2": "354064852239146",
    "serialNumber": "SN26002",
    "sku": "TFD-26002-OTH",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 42900,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 43650,
      "sellingPrice": 55000,
      "projectedProfit": 11350,
      "profitMarginPercent": 20.6
    },
    "sellingPrice": 55000,
    "purchasePrice": 42900,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26002-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26002."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26003",
    "brand": "Apple",
    "model": "iPhone 16 PINK",
    "storage": "128 gb",
    "colour": "Pink",
    "imei1": "352958414012677",
    "serialNumber": "SN26003",
    "sku": "TFD-26003-APP",
    "batteryHealth": 93,
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 46800,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 47550,
      "sellingPrice": 60000,
      "projectedProfit": 12450,
      "profitMarginPercent": 20.8
    },
    "sellingPrice": 60000,
    "purchasePrice": 46800,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Apple Bionic / A-Series",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "iOS 18"
    },
    "activityTimeline": [
      {
        "id": "ACT-26003-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26003."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26004",
    "brand": "Apple",
    "model": "iPHONE 15 PRO MAX (WHITE)",
    "storage": "256 GB",
    "colour": "WHITE",
    "imei1": "356642157403535",
    "serialNumber": "SN26004",
    "sku": "TFD-26004-APP",
    "batteryHealth": 94,
    "grade": "A+",
    "status": "Sold",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 56940,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 57690,
      "sellingPrice": 73000,
      "projectedProfit": 15310,
      "profitMarginPercent": 21
    },
    "sellingPrice": 73000,
    "purchasePrice": 56940,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Apple Bionic / A-Series",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "iOS 18"
    },
    "activityTimeline": [
      {
        "id": "ACT-26004-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26004."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26005",
    "brand": "Other",
    "model": "14 pro max (purple)",
    "storage": "1tb",
    "colour": "purple",
    "imei1": "357879430485082",
    "serialNumber": "SN26005",
    "sku": "TFD-26005-OTH",
    "grade": "A+",
    "status": "Sold",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 42900,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 43650,
      "sellingPrice": 55000,
      "projectedProfit": 11350,
      "profitMarginPercent": 20.6
    },
    "sellingPrice": 55000,
    "purchasePrice": 42900,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26005-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26005."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26006",
    "brand": "Other",
    "model": "15 Pro (white)",
    "storage": "256 gb",
    "colour": "white",
    "imei1": "357597632009589",
    "serialNumber": "SN26006",
    "sku": "TFD-26006-OTH",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 53040,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 53790,
      "sellingPrice": 68000,
      "projectedProfit": 14210,
      "profitMarginPercent": 20.9
    },
    "sellingPrice": 68000,
    "purchasePrice": 53040,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26006-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26006."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26007",
    "brand": "Other",
    "model": "14 pro (purple)",
    "storage": "256 gb",
    "colour": "purple",
    "imei1": "353943233721616",
    "serialNumber": "SN26007",
    "sku": "TFD-26007-OTH",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 42900,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 43650,
      "sellingPrice": 55000,
      "projectedProfit": 11350,
      "profitMarginPercent": 20.6
    },
    "sellingPrice": 55000,
    "purchasePrice": 42900,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26007-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26007."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26008",
    "brand": "Other",
    "model": "15 pro (grey)",
    "storage": "256 GB",
    "colour": "grey",
    "imei1": "356444800044612",
    "serialNumber": "SN26008",
    "sku": "TFD-26008-OTH",
    "grade": "A+",
    "status": "Sold",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 54600,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 55350,
      "sellingPrice": 70000,
      "projectedProfit": 14650,
      "profitMarginPercent": 20.9
    },
    "sellingPrice": 70000,
    "purchasePrice": 54600,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26008-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26008."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26009",
    "brand": "Other",
    "model": "13 (blue)",
    "storage": "128 gb",
    "colour": "blue",
    "imei1": "358901260026009",
    "serialNumber": "SN26009",
    "sku": "TFD-26009-OTH",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 24960,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 25710,
      "sellingPrice": 32000,
      "projectedProfit": 6290,
      "profitMarginPercent": 19.7
    },
    "sellingPrice": 32000,
    "purchasePrice": 24960,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26009-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26009."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26010",
    "brand": "Other",
    "model": "16 pro ( grey)",
    "storage": "256 gb",
    "colour": "grey",
    "imei1": "354935415832459",
    "serialNumber": "SN26010",
    "sku": "TFD-26010-OTH",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 60840,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 61590,
      "sellingPrice": 78000,
      "projectedProfit": 16410,
      "profitMarginPercent": 21
    },
    "sellingPrice": 78000,
    "purchasePrice": 60840,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26010-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26010."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26011",
    "brand": "Other",
    "model": "12 pro (baby pink)",
    "storage": "128 gb",
    "colour": "baby pink",
    "imei1": "356696727120920",
    "serialNumber": "SN26011",
    "sku": "TFD-26011-OTH",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 23400,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 24150,
      "sellingPrice": 30000,
      "projectedProfit": 5850,
      "profitMarginPercent": 19.5
    },
    "sellingPrice": 30000,
    "purchasePrice": 23400,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26011-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26011."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26012",
    "brand": "Other",
    "model": "16 (green)",
    "storage": "128 gb",
    "colour": "green",
    "imei1": "357043230995515",
    "serialNumber": "SN26012",
    "sku": "TFD-26012-OTH",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 46800,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 47550,
      "sellingPrice": 60000,
      "projectedProfit": 12450,
      "profitMarginPercent": 20.8
    },
    "sellingPrice": 60000,
    "purchasePrice": 46800,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26012-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26012."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26013",
    "brand": "Other",
    "model": "16 pro (off white)",
    "storage": "128 gb",
    "colour": "off white",
    "imei1": "350717767996825",
    "serialNumber": "SN26013",
    "sku": "TFD-26013-OTH",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 58500,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 59250,
      "sellingPrice": 75000,
      "projectedProfit": 15750,
      "profitMarginPercent": 21
    },
    "sellingPrice": 75000,
    "purchasePrice": 58500,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26013-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26013."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26014",
    "brand": "Other",
    "model": "13 pro max (white)",
    "storage": "128 gb",
    "colour": "white",
    "imei1": "350879909438510",
    "serialNumber": "SN26014",
    "sku": "TFD-26014-OTH",
    "grade": "A+",
    "status": "Sold",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 31200,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 31950,
      "sellingPrice": 40000,
      "projectedProfit": 8050,
      "profitMarginPercent": 20.1
    },
    "sellingPrice": 40000,
    "purchasePrice": 31200,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26014-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26014."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26015",
    "brand": "Other",
    "model": "15 (black)",
    "storage": "128 gb",
    "colour": "black",
    "imei1": "355820716179553",
    "serialNumber": "SN26015",
    "sku": "TFD-26015-OTH",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 39000,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 39750,
      "sellingPrice": 50000,
      "projectedProfit": 10250,
      "profitMarginPercent": 20.5
    },
    "sellingPrice": 50000,
    "purchasePrice": 39000,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26015-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26015."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26016",
    "brand": "Other",
    "model": "17 pro (orange)",
    "storage": "256 gb",
    "colour": "orange",
    "imei1": "356661402930183",
    "serialNumber": "SN26016",
    "sku": "TFD-26016-OTH",
    "grade": "A+",
    "status": "Sold",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 85800,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 86550,
      "sellingPrice": 110000,
      "projectedProfit": 23450,
      "profitMarginPercent": 21.3
    },
    "sellingPrice": 110000,
    "purchasePrice": 85800,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26016-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26016."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26017",
    "brand": "Other",
    "model": "15 pro ( grey)",
    "storage": "128 gb /8gb",
    "colour": "grey",
    "imei1": "353459391469559",
    "serialNumber": "SN26017",
    "sku": "TFD-26017-OTH",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 50700,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 51450,
      "sellingPrice": 65000,
      "projectedProfit": 13550,
      "profitMarginPercent": 20.8
    },
    "sellingPrice": 65000,
    "purchasePrice": 50700,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26017-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26017."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26018",
    "brand": "Other",
    "model": "14+ (dark blue)",
    "storage": "128 gb",
    "colour": "dark blue",
    "imei1": "353377521202302",
    "serialNumber": "SN26018",
    "sku": "TFD-26018-OTH",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 29640,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 30390,
      "sellingPrice": 38000,
      "projectedProfit": 7610,
      "profitMarginPercent": 20
    },
    "sellingPrice": 38000,
    "purchasePrice": 29640,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26018-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26018."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26019",
    "brand": "Samsung",
    "model": "samsung galaxy 24 ultra (grey)",
    "storage": "256 /12",
    "colour": "grey",
    "imei1": "352722661210255",
    "serialNumber": "SN26019",
    "sku": "TFD-26019-SAM",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 51480,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 52230,
      "sellingPrice": 66000,
      "projectedProfit": 13770,
      "profitMarginPercent": 20.9
    },
    "sellingPrice": 66000,
    "purchasePrice": 51480,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1584006682522-dc17d6c0d9ac?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26019-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26019."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26020",
    "brand": "Samsung",
    "model": "samsung galaxy s23 fe ( green)",
    "storage": "128/8",
    "colour": "green",
    "imei1": "351005194138941",
    "serialNumber": "SN26020",
    "sku": "TFD-26020-SAM",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 23400,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 24150,
      "sellingPrice": 30000,
      "projectedProfit": 5850,
      "profitMarginPercent": 19.5
    },
    "sellingPrice": 30000,
    "purchasePrice": 23400,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26020-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26020."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26021",
    "brand": "Samsung",
    "model": "samsung galaxy s10e (grey)",
    "storage": "128 gb",
    "colour": "grey",
    "imei1": "352808100961234",
    "serialNumber": "SN26021",
    "sku": "TFD-26021-SAM",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 10920,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 11670,
      "sellingPrice": 14000,
      "projectedProfit": 2330,
      "profitMarginPercent": 16.6
    },
    "sellingPrice": 14000,
    "purchasePrice": 10920,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1584006682522-dc17d6c0d9ac?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26021-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26021."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26022",
    "brand": "Samsung",
    "model": "samsung galaxy s24 ultra (golden)",
    "storage": "512 gb /12",
    "colour": "golden",
    "imei1": "353578850761279",
    "serialNumber": "SN26022",
    "sku": "TFD-26022-SAM",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 54600,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 55350,
      "sellingPrice": 70000,
      "projectedProfit": 14650,
      "profitMarginPercent": 20.9
    },
    "sellingPrice": 70000,
    "purchasePrice": 54600,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26022-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26022."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26023",
    "brand": "Samsung",
    "model": "samsung galaxy s23 ultra (black)",
    "storage": "512/12",
    "colour": "black",
    "imei1": "353992851703133",
    "serialNumber": "SN26023",
    "sku": "TFD-26023-SAM",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 40560,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 41310,
      "sellingPrice": 52000,
      "projectedProfit": 10690,
      "profitMarginPercent": 20.6
    },
    "sellingPrice": 52000,
    "purchasePrice": 40560,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1584006682522-dc17d6c0d9ac?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26023-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26023."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26024",
    "brand": "Samsung",
    "model": "samsung galaxy a56 5g (light green/sea green)",
    "storage": "256/12",
    "colour": "light green/sea green",
    "imei1": "356300332281603",
    "serialNumber": "SN26024",
    "sku": "TFD-26024-SAM",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 27300,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 28050,
      "sellingPrice": 35000,
      "projectedProfit": 6950,
      "profitMarginPercent": 19.9
    },
    "sellingPrice": 35000,
    "purchasePrice": 27300,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26024-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26024."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26025",
    "brand": "Samsung",
    "model": "samsung galaxy s23 ultra (black)",
    "storage": "256/12",
    "colour": "black",
    "imei1": "353835882416094",
    "serialNumber": "SN26025",
    "sku": "TFD-26025-SAM",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 37440,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 38190,
      "sellingPrice": 48000,
      "projectedProfit": 9810,
      "profitMarginPercent": 20.4
    },
    "sellingPrice": 48000,
    "purchasePrice": 37440,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1584006682522-dc17d6c0d9ac?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26025-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26025."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26026",
    "brand": "Samsung",
    "model": "samsung galaxy a07 (silver purple)",
    "storage": "64/4",
    "colour": "silver purple",
    "imei1": "353835882416094",
    "serialNumber": "SN26026",
    "sku": "TFD-26026-SAM",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 8580,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 9330,
      "sellingPrice": 11000,
      "projectedProfit": 1670,
      "profitMarginPercent": 15.2
    },
    "sellingPrice": 11000,
    "purchasePrice": 8580,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26026-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26026."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26027",
    "brand": "Samsung",
    "model": "samsung galaxy z fold 5 (off white)",
    "storage": "512/12",
    "colour": "off white",
    "imei1": "352271450924668",
    "serialNumber": "SN26027",
    "sku": "TFD-26027-SAM",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 45240,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 45990,
      "sellingPrice": 58000,
      "projectedProfit": 12010,
      "profitMarginPercent": 20.7
    },
    "sellingPrice": 58000,
    "purchasePrice": 45240,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1584006682522-dc17d6c0d9ac?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26027-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26027."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26028",
    "brand": "Samsung",
    "model": "samsung galaxy z fold 6 (pink)",
    "storage": "256/12",
    "colour": "pink",
    "imei1": "351379490556548",
    "serialNumber": "SN26028",
    "sku": "TFD-26028-SAM",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 54600,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 55350,
      "sellingPrice": 70000,
      "projectedProfit": 14650,
      "profitMarginPercent": 20.9
    },
    "sellingPrice": 70000,
    "purchasePrice": 54600,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26028-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26028."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26029",
    "brand": "Samsung",
    "model": "Samsung Galaxy 23 fe (orange)",
    "storage": "128/8",
    "colour": "orange",
    "imei1": "351005191215247",
    "serialNumber": "SN26029",
    "sku": "TFD-26029-SAM",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 24180,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 24930,
      "sellingPrice": 31000,
      "projectedProfit": 6070,
      "profitMarginPercent": 19.6
    },
    "sellingPrice": 31000,
    "purchasePrice": 24180,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1584006682522-dc17d6c0d9ac?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26029-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26029."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26030",
    "brand": "Other",
    "model": "Oneplus  nord 5 (blue) 10 days old",
    "storage": "256/8",
    "colour": "blue",
    "imei1": "863995079682917",
    "serialNumber": "SN26030",
    "sku": "TFD-26030-OTH",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 28860,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 29610,
      "sellingPrice": 37000,
      "projectedProfit": 7390,
      "profitMarginPercent": 20
    },
    "sellingPrice": 37000,
    "purchasePrice": 28860,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26030-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26030."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26031",
    "brand": "Other",
    "model": "Oneplus  8 (blue)",
    "storage": "128",
    "colour": "blue",
    "imei1": "869796042087034",
    "serialNumber": "SN26031",
    "sku": "TFD-26031-OTH",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 14040,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 14790,
      "sellingPrice": 18000,
      "projectedProfit": 3210,
      "profitMarginPercent": 17.8
    },
    "sellingPrice": 18000,
    "purchasePrice": 14040,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26031-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26031."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26032",
    "brand": "Other",
    "model": "Oneplus 10 pro 5g (black)",
    "storage": "256",
    "colour": "black",
    "imei1": "868368053231199",
    "serialNumber": "SN26032",
    "sku": "TFD-26032-OTH",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 21840,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 22590,
      "sellingPrice": 28000,
      "projectedProfit": 5410,
      "profitMarginPercent": 19.3
    },
    "sellingPrice": 28000,
    "purchasePrice": 21840,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26032-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26032."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26033",
    "brand": "Other",
    "model": "Motorola g8 5g (green)",
    "storage": "128/8",
    "colour": "green",
    "imei1": "352532337308015",
    "serialNumber": "SN26033",
    "sku": "TFD-26033-OTH",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 13260,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 14010,
      "sellingPrice": 17000,
      "projectedProfit": 2990,
      "profitMarginPercent": 17.6
    },
    "sellingPrice": 17000,
    "purchasePrice": 13260,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26033-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26033."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26034",
    "brand": "Other",
    "model": "Motorola  g62 5g (blue)",
    "storage": "128 gb",
    "colour": "blue",
    "imei1": "357807166012077",
    "serialNumber": "SN26034",
    "sku": "TFD-26034-OTH",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 8580,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 9330,
      "sellingPrice": 11000,
      "projectedProfit": 1670,
      "profitMarginPercent": 15.2
    },
    "sellingPrice": 11000,
    "purchasePrice": 8580,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26034-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26034."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26035",
    "brand": "Realme",
    "model": "Realme C83 5G (black)",
    "storage": "128/6",
    "colour": "black",
    "imei1": "866276083086859",
    "serialNumber": "SN26035",
    "sku": "TFD-26035-REA",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 12480,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 13230,
      "sellingPrice": 16000,
      "projectedProfit": 2770,
      "profitMarginPercent": 17.3
    },
    "sellingPrice": 16000,
    "purchasePrice": 12480,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26035-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26035."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26036",
    "brand": "Realme",
    "model": "Realme 12 pro 5G (dark blue)",
    "storage": "256/8",
    "colour": "dark blue",
    "imei1": "861888066729878",
    "serialNumber": "SN26036",
    "sku": "TFD-26036-REA",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 13260,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 14010,
      "sellingPrice": 17000,
      "projectedProfit": 2990,
      "profitMarginPercent": 17.6
    },
    "sellingPrice": 17000,
    "purchasePrice": 13260,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26036-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26036."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26037",
    "brand": "Other",
    "model": "Motorola Edge 40 (black)",
    "storage": "256",
    "colour": "black",
    "imei1": "357611735734470",
    "serialNumber": "SN26037",
    "sku": "TFD-26037-OTH",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 13260,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 14010,
      "sellingPrice": 17000,
      "projectedProfit": 2990,
      "profitMarginPercent": 17.6
    },
    "sellingPrice": 17000,
    "purchasePrice": 13260,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26037-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26037."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26038",
    "brand": "Poco",
    "model": "poco x4 pro 5g (blue)",
    "storage": "128 gb",
    "colour": "blue",
    "imei1": "862531055496351",
    "serialNumber": "SN26038",
    "sku": "TFD-26038-POC",
    "grade": "A+",
    "status": "Sold",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 11700,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 12450,
      "sellingPrice": 15000,
      "projectedProfit": 2550,
      "profitMarginPercent": 17
    },
    "sellingPrice": 15000,
    "purchasePrice": 11700,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26038-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26038."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26039",
    "brand": "Other",
    "model": "Google Pixel 9A (purple)",
    "storage": "256 gb",
    "colour": "purple",
    "imei1": "359892181623429",
    "serialNumber": "SN26039",
    "sku": "TFD-26039-OTH",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 28860,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 29610,
      "sellingPrice": 37000,
      "projectedProfit": 7390,
      "profitMarginPercent": 20
    },
    "sellingPrice": 37000,
    "purchasePrice": 28860,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26039-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26039."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26040",
    "brand": "Other",
    "model": "Google   Pixel 8",
    "storage": "128 gb",
    "colour": "Standard",
    "imei1": "357481895108463",
    "serialNumber": "SN26040",
    "sku": "TFD-26040-OTH",
    "grade": "A+",
    "status": "Sold",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 19500,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 20250,
      "sellingPrice": 25000,
      "projectedProfit": 4750,
      "profitMarginPercent": 19
    },
    "sellingPrice": 25000,
    "purchasePrice": 19500,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26040-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26040."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26041",
    "brand": "Xiaomi",
    "model": "Redmi 11 prime 5g (black)",
    "storage": "128 gb",
    "colour": "black",
    "imei1": "860825059738715",
    "serialNumber": "SN26041",
    "sku": "TFD-26041-XIA",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 8580,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 9330,
      "sellingPrice": 11000,
      "projectedProfit": 1670,
      "profitMarginPercent": 15.2
    },
    "sellingPrice": 11000,
    "purchasePrice": 8580,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26041-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26041."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26042",
    "brand": "Vivo",
    "model": "Vivo v70 fe (blue)",
    "storage": "256",
    "colour": "blue",
    "imei1": "861130083750250",
    "serialNumber": "SN26042",
    "sku": "TFD-26042-VIV",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 36660,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 37410,
      "sellingPrice": 47000,
      "projectedProfit": 9590,
      "profitMarginPercent": 20.4
    },
    "sellingPrice": 47000,
    "purchasePrice": 36660,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26042-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26042."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26043",
    "brand": "Oppo",
    "model": "Oppo K13 5g (dark grey)",
    "storage": "128",
    "colour": "dark grey",
    "imei1": "867203075513251",
    "serialNumber": "SN26043",
    "sku": "TFD-26043-OPP",
    "grade": "A+",
    "status": "Sold",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 8580,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 9330,
      "sellingPrice": 11000,
      "projectedProfit": 1670,
      "profitMarginPercent": 15.2
    },
    "sellingPrice": 11000,
    "purchasePrice": 8580,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26043-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26043."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26044",
    "brand": "Apple",
    "model": "iphone 15 (white)",
    "storage": "256gb",
    "colour": "white",
    "imei1": "352691622226447",
    "serialNumber": "SN26044",
    "sku": "TFD-26044-APP",
    "batteryHealth": 89,
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 41340,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 42090,
      "sellingPrice": 53000,
      "projectedProfit": 10910,
      "profitMarginPercent": 20.6
    },
    "sellingPrice": 53000,
    "purchasePrice": 41340,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Apple Bionic / A-Series",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "iOS 18"
    },
    "activityTimeline": [
      {
        "id": "ACT-26044-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26044."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26045",
    "brand": "Apple",
    "model": "iphone 15 (white)",
    "storage": "128gb",
    "colour": "white",
    "imei1": "359757422350951",
    "serialNumber": "SN26045",
    "sku": "TFD-26045-APP",
    "batteryHealth": 90,
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 35100,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 35850,
      "sellingPrice": 45000,
      "projectedProfit": 9150,
      "profitMarginPercent": 20.3
    },
    "sellingPrice": 45000,
    "purchasePrice": 35100,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Apple Bionic / A-Series",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "iOS 18"
    },
    "activityTimeline": [
      {
        "id": "ACT-26045-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26045."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26046",
    "brand": "Apple",
    "model": "iphone15 pro (grey)",
    "storage": "128 gb",
    "colour": "grey",
    "imei1": "355002400218829",
    "serialNumber": "SN26046",
    "sku": "TFD-26046-APP",
    "batteryHealth": 91,
    "grade": "A+",
    "status": "Sold",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 49140,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 49890,
      "sellingPrice": 63000,
      "projectedProfit": 13110,
      "profitMarginPercent": 20.8
    },
    "sellingPrice": 63000,
    "purchasePrice": 49140,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Apple Bionic / A-Series",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "iOS 18"
    },
    "activityTimeline": [
      {
        "id": "ACT-26046-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26046."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26047",
    "brand": "Vivo",
    "model": "vivo V50e (purple)",
    "storage": "256 /8",
    "colour": "purple",
    "imei1": "865186079119377",
    "serialNumber": "SN26047",
    "sku": "TFD-26047-VIV",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 20280,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 21030,
      "sellingPrice": 26000,
      "projectedProfit": 4970,
      "profitMarginPercent": 19.1
    },
    "sellingPrice": 26000,
    "purchasePrice": 20280,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26047-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26047."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26048",
    "brand": "Other",
    "model": "Moto G54 5g(black)",
    "storage": "128/8",
    "colour": "black",
    "imei1": "350835850946471",
    "serialNumber": "SN26048",
    "sku": "TFD-26048-OTH",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 8580,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 9330,
      "sellingPrice": 11000,
      "projectedProfit": 1670,
      "profitMarginPercent": 15.2
    },
    "sellingPrice": 11000,
    "purchasePrice": 8580,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26048-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26048."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26049",
    "brand": "Apple",
    "model": "iphone 14 pro (white)",
    "storage": "128gb",
    "colour": "white",
    "imei1": "356903557725459",
    "serialNumber": "SN26049",
    "sku": "TFD-26049-APP",
    "batteryHealth": 94,
    "grade": "A+",
    "status": "Sold",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 35100,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 35850,
      "sellingPrice": 45000,
      "projectedProfit": 9150,
      "profitMarginPercent": 20.3
    },
    "sellingPrice": 45000,
    "purchasePrice": 35100,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Apple Bionic / A-Series",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "iOS 18"
    },
    "activityTimeline": [
      {
        "id": "ACT-26049-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26049."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26050",
    "brand": "Samsung",
    "model": "Samsung S23 Ultra ( olive green )",
    "storage": "256 gb",
    "colour": "olive green",
    "imei1": "353835883434245",
    "serialNumber": "SN26050",
    "sku": "TFD-26050-SAM",
    "grade": "A+",
    "status": "Sold",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 41340,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 42090,
      "sellingPrice": 53000,
      "projectedProfit": 10910,
      "profitMarginPercent": 20.6
    },
    "sellingPrice": 53000,
    "purchasePrice": 41340,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26050-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26050."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26051",
    "brand": "Apple",
    "model": "iphone 15 plus (white)",
    "storage": "128 gb",
    "colour": "white",
    "imei1": "350110763563296",
    "serialNumber": "SN26051",
    "sku": "TFD-26051-APP",
    "batteryHealth": 96,
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 42900,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 43650,
      "sellingPrice": 55000,
      "projectedProfit": 11350,
      "profitMarginPercent": 20.6
    },
    "sellingPrice": 55000,
    "purchasePrice": 42900,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Apple Bionic / A-Series",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "iOS 18"
    },
    "activityTimeline": [
      {
        "id": "ACT-26051-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26051."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26052",
    "brand": "Oppo",
    "model": "Oppo A5X 5g (Dark grey)",
    "storage": "128gb",
    "colour": "Dark grey",
    "imei1": "867276071326696",
    "serialNumber": "SN26052",
    "sku": "TFD-26052-OPP",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 10530,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 11280,
      "sellingPrice": 13500,
      "projectedProfit": 2220,
      "profitMarginPercent": 16.4
    },
    "sellingPrice": 13500,
    "purchasePrice": 10530,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26052-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26052."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26053",
    "brand": "Vivo",
    "model": "Vivo t5 pro 5g (light blue)",
    "storage": "256gb/8+8",
    "colour": "light blue",
    "imei1": "860235087243219",
    "serialNumber": "SN26053",
    "sku": "TFD-26053-VIV",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 28860,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 29610,
      "sellingPrice": 37000,
      "projectedProfit": 7390,
      "profitMarginPercent": 20
    },
    "sellingPrice": 37000,
    "purchasePrice": 28860,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26053-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26053."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26054",
    "brand": "Realme",
    "model": "Realme Narzo 50 pro 5g (blue)",
    "storage": "128/6",
    "colour": "blue",
    "imei1": "861084050921719",
    "serialNumber": "SN26054",
    "sku": "TFD-26054-REA",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 11700,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 12450,
      "sellingPrice": 15000,
      "projectedProfit": 2550,
      "profitMarginPercent": 17
    },
    "sellingPrice": 15000,
    "purchasePrice": 11700,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26054-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26054."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26055",
    "brand": "Poco",
    "model": "Poco M4 5g (black)",
    "storage": "64",
    "colour": "black",
    "imei1": "869198055527792",
    "serialNumber": "SN26055",
    "sku": "TFD-26055-POC",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 8580,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 9330,
      "sellingPrice": 11000,
      "projectedProfit": 1670,
      "profitMarginPercent": 15.2
    },
    "sellingPrice": 11000,
    "purchasePrice": 8580,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26055-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26055."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26056",
    "brand": "Realme",
    "model": "Realme P3x 5g (Peach color)",
    "storage": "128/8",
    "colour": "Peach color",
    "imei1": "865758073065754",
    "serialNumber": "SN26056",
    "sku": "TFD-26056-REA",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 10530,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 11280,
      "sellingPrice": 13500,
      "projectedProfit": 2220,
      "profitMarginPercent": 16.4
    },
    "sellingPrice": 13500,
    "purchasePrice": 10530,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26056-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26056."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26057",
    "brand": "Samsung",
    "model": "Samsung galaxy F14 5g (purple)",
    "storage": "128gb",
    "colour": "purple",
    "imei1": "350145990929795",
    "serialNumber": "SN26057",
    "sku": "TFD-26057-SAM",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 9360,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 10110,
      "sellingPrice": 12000,
      "projectedProfit": 1890,
      "profitMarginPercent": 15.8
    },
    "sellingPrice": 12000,
    "purchasePrice": 9360,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1584006682522-dc17d6c0d9ac?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26057-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26057."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26058",
    "brand": "Samsung",
    "model": "Samsung  S24 FE (dark grey)",
    "storage": "128/8",
    "colour": "dark grey",
    "imei1": "350487770140585",
    "serialNumber": "SN26058",
    "sku": "TFD-26058-SAM",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 24960,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 25710,
      "sellingPrice": 32000,
      "projectedProfit": 6290,
      "profitMarginPercent": 19.7
    },
    "sellingPrice": 32000,
    "purchasePrice": 24960,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26058-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26058."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26059",
    "brand": "Samsung",
    "model": "Samsung galaxy a07 5g (purple)",
    "storage": "128/4",
    "colour": "purple",
    "imei1": "359695533663039",
    "serialNumber": "SN26059",
    "sku": "TFD-26059-SAM",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 10530,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 11280,
      "sellingPrice": 13500,
      "projectedProfit": 2220,
      "profitMarginPercent": 16.4
    },
    "sellingPrice": 13500,
    "purchasePrice": 10530,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1584006682522-dc17d6c0d9ac?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26059-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26059."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26060",
    "brand": "Vivo",
    "model": "vivo 14 funtouch 0S (blue)",
    "storage": "128/8",
    "colour": "blue",
    "imei1": "868526067064191",
    "serialNumber": "SN26060",
    "sku": "TFD-26060-VIV",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 11700,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 12450,
      "sellingPrice": 15000,
      "projectedProfit": 2550,
      "profitMarginPercent": 17
    },
    "sellingPrice": 15000,
    "purchasePrice": 11700,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26060-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26060."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26061",
    "brand": "Xiaomi",
    "model": "Xiaomi Redmi note 14 5g (white)",
    "storage": "128/6",
    "colour": "white",
    "imei1": "869958077174083",
    "serialNumber": "SN26061",
    "sku": "TFD-26061-XIA",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 13650,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 14400,
      "sellingPrice": 17500,
      "projectedProfit": 3100,
      "profitMarginPercent": 17.7
    },
    "sellingPrice": 17500,
    "purchasePrice": 13650,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26061-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26061."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26062",
    "brand": "Samsung",
    "model": "Samsung Ultra 26 Waranty April 2027",
    "storage": "258",
    "colour": "Standard",
    "imei1": "358780490491292",
    "serialNumber": "SN26062",
    "sku": "TFD-26062-SAM",
    "grade": "A+",
    "status": "Sold",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 81900,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 82650,
      "sellingPrice": 105000,
      "projectedProfit": 22350,
      "profitMarginPercent": 21.3
    },
    "sellingPrice": 105000,
    "purchasePrice": 81900,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26062-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26062."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26063",
    "brand": "Apple",
    "model": "IPhone 11ProMax",
    "storage": "64",
    "colour": "Standard",
    "imei1": "353920104147170",
    "serialNumber": "SN26063",
    "sku": "TFD-26063-APP",
    "batteryHealth": 93,
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 17940,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 18690,
      "sellingPrice": 23000,
      "projectedProfit": 4310,
      "profitMarginPercent": 18.7
    },
    "sellingPrice": 23000,
    "purchasePrice": 17940,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Apple Bionic / A-Series",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "iOS 18"
    },
    "activityTimeline": [
      {
        "id": "ACT-26063-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26063."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26065",
    "brand": "Apple",
    "model": "Ipad (A16) (GREY)",
    "storage": "128gb",
    "colour": "A16",
    "imei1": "J61VHK00C7",
    "serialNumber": "SN26065",
    "sku": "TFD-26065-APP",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 29640,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 30390,
      "sellingPrice": 38000,
      "projectedProfit": 7610,
      "profitMarginPercent": 20
    },
    "sellingPrice": 38000,
    "purchasePrice": 29640,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Apple Bionic / A-Series",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "iOS 18"
    },
    "activityTimeline": [
      {
        "id": "ACT-26065-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26065."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26067",
    "brand": "Apple",
    "model": "Iphone 17 (purple)",
    "storage": "256 gb",
    "colour": "purple",
    "imei1": "355212480060708",
    "serialNumber": "SN26067",
    "sku": "TFD-26067-APP",
    "batteryHealth": 97,
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 71760,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 72510,
      "sellingPrice": 92000,
      "projectedProfit": 19490,
      "profitMarginPercent": 21.2
    },
    "sellingPrice": 92000,
    "purchasePrice": 71760,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Apple Bionic / A-Series",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "iOS 18"
    },
    "activityTimeline": [
      {
        "id": "ACT-26067-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26067."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26068",
    "brand": "Samsung",
    "model": "Samsung Galaxy S9+ (black)",
    "storage": "256 gb",
    "colour": "black",
    "imei1": "355345090201542",
    "serialNumber": "SN26068",
    "sku": "TFD-26068-SAM",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 10140,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 10890,
      "sellingPrice": 13000,
      "projectedProfit": 2110,
      "profitMarginPercent": 16.2
    },
    "sellingPrice": 13000,
    "purchasePrice": 10140,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26068-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26068."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26070",
    "brand": "Samsung",
    "model": "Samsung galaxy a15 5g (dark blue)",
    "storage": "128 gb /8gb",
    "colour": "dark blue",
    "imei1": "354324782687277",
    "serialNumber": "SN26070",
    "sku": "TFD-26070-SAM",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 8580,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 9330,
      "sellingPrice": 11000,
      "projectedProfit": 1670,
      "profitMarginPercent": 15.2
    },
    "sellingPrice": 11000,
    "purchasePrice": 8580,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26070-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26070."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26071",
    "brand": "Samsung",
    "model": "Samsung Galaxy S22 ultra (BURGANDY)",
    "storage": "256/12",
    "colour": "BURGANDY",
    "imei1": "357187980837326",
    "serialNumber": "SN26071",
    "sku": "TFD-26071-SAM",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 34320,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 35070,
      "sellingPrice": 44000,
      "projectedProfit": 8930,
      "profitMarginPercent": 20.3
    },
    "sellingPrice": 44000,
    "purchasePrice": 34320,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1584006682522-dc17d6c0d9ac?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26071-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26071."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26075",
    "brand": "IQOO",
    "model": "IQOO 9 PRO (black)",
    "storage": "256/12",
    "colour": "black",
    "imei1": "861374059499050",
    "serialNumber": "SN26075",
    "sku": "TFD-26075-IQO",
    "grade": "A+",
    "status": "Sold",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 18720,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 19470,
      "sellingPrice": 24000,
      "projectedProfit": 4530,
      "profitMarginPercent": 18.9
    },
    "sellingPrice": 24000,
    "purchasePrice": 18720,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26075-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26075."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26076",
    "brand": "Samsung",
    "model": "Samsung s24 (blue)",
    "storage": "512",
    "colour": "blue",
    "imei1": "354267931967241",
    "serialNumber": "SN26076",
    "sku": "TFD-26076-SAM",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 35100,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 35850,
      "sellingPrice": 45000,
      "projectedProfit": 9150,
      "profitMarginPercent": 20.3
    },
    "sellingPrice": 45000,
    "purchasePrice": 35100,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26076-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26076."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26077",
    "brand": "Apple",
    "model": "iPhone 16 plus (black)",
    "storage": "128 gb",
    "colour": "black",
    "imei1": "358809666450624",
    "serialNumber": "SN26077",
    "sku": "TFD-26077-APP",
    "batteryHealth": 92,
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 50700,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 51450,
      "sellingPrice": 65000,
      "projectedProfit": 13550,
      "profitMarginPercent": 20.8
    },
    "sellingPrice": 65000,
    "purchasePrice": 50700,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Apple Bionic / A-Series",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "iOS 18"
    },
    "activityTimeline": [
      {
        "id": "ACT-26077-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26077."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26078",
    "brand": "Apple",
    "model": "iPhone 13 (dark blue)",
    "storage": "128gb",
    "colour": "dark blue",
    "imei1": "352561336238295",
    "serialNumber": "SN26078",
    "sku": "TFD-26078-APP",
    "batteryHealth": 93,
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 23400,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 24150,
      "sellingPrice": 30000,
      "projectedProfit": 5850,
      "profitMarginPercent": 19.5
    },
    "sellingPrice": 30000,
    "purchasePrice": 23400,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Apple Bionic / A-Series",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "iOS 18"
    },
    "activityTimeline": [
      {
        "id": "ACT-26078-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26078."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26079",
    "brand": "Samsung",
    "model": "Galaxy S26 ultra (white)",
    "storage": "256/12",
    "colour": "white",
    "imei1": "358780490518334",
    "serialNumber": "SN26079",
    "sku": "TFD-26079-SAM",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 85800,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 86550,
      "sellingPrice": 110000,
      "projectedProfit": 23450,
      "profitMarginPercent": 21.3
    },
    "sellingPrice": 110000,
    "purchasePrice": 85800,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1584006682522-dc17d6c0d9ac?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26079-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26079."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26080",
    "brand": "Samsung",
    "model": "Galaxy S24 (lemonish yellow)",
    "storage": "256/8",
    "colour": "lemonish yellow",
    "imei1": "356016370598456",
    "serialNumber": "SN26080",
    "sku": "TFD-26080-SAM",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 31200,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 31950,
      "sellingPrice": 40000,
      "projectedProfit": 8050,
      "profitMarginPercent": 20.1
    },
    "sellingPrice": 40000,
    "purchasePrice": 31200,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26080-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26080."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26081",
    "brand": "Other",
    "model": "S25 edge (black)",
    "storage": "256/12",
    "colour": "black",
    "imei1": "354922133130580",
    "serialNumber": "SN26081",
    "sku": "TFD-26081-OTH",
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 46800,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 47550,
      "sellingPrice": 60000,
      "projectedProfit": 12450,
      "profitMarginPercent": 20.8
    },
    "sellingPrice": 60000,
    "purchasePrice": 46800,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek Dimensity",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26081-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26081."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26082",
    "brand": "Apple",
    "model": "iPhone Air ( sky blue)",
    "storage": "256gb",
    "colour": "sky blue",
    "imei1": "358258287029542",
    "serialNumber": "SN26082",
    "sku": "TFD-26082-APP",
    "batteryHealth": 97,
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 74100,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 74850,
      "sellingPrice": 95000,
      "projectedProfit": 20150,
      "profitMarginPercent": 21.2
    },
    "sellingPrice": 95000,
    "purchasePrice": 74100,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Apple Bionic / A-Series",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "iOS 18"
    },
    "activityTimeline": [
      {
        "id": "ACT-26082-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26082."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26083",
    "brand": "Xiaomi",
    "model": "Xiaomi 11 i Hyper Charge (128GB) Refurbished Stealth Black",
    "storage": "128GB",
    "colour": "Stealth Black",
    "imei1": "867179050310196",
    "serialNumber": "SN26083",
    "sku": "APL-IP15-128-NT",
    "grade": "A+",
    "status": "Sold",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 11700,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 200,
      "logisticsCost": 300,
      "otherCost": 0,
      "totalLandedCost": 12450,
      "sellingPrice": 15000,
      "projectedProfit": 2550,
      "profitMarginPercent": 17
    },
    "sellingPrice": 15000,
    "purchasePrice": 11700,
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "MediaTek Dimensity 920 5G",
      "screenSize": "6.67\" AMOLED 120Hz",
      "cameraSpecs": "108MP Triple Camera System",
      "network": "5G Dual SIM",
      "osVersion": "MIUI / HyperOS"
    },
    "activityTimeline": [
      {
        "id": "ACT-26083-1",
        "timestamp": "2026-11-14 10:00",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26083."
      }
    ],
    "repairHistory": []
  }
];

export const initialPurchases: PurchaseOrder[] = [
  {
    id: "PO-LKO-2611-001",
    supplierId: "SUP-001",
    supplierName: "Esterline Bulk Refurb Solutions",
    supplierContact: "+91 98210 55432",
    supplierGst: "27AABCE1234F1Z8",
    date: "2026-11-14",
    itemsCount: 78,
    devices: [
      { model: "Certified Refurbished Handsets Lot (78 Units)", imei: "356983557725459", grade: "A+", price: 32350 },
    ],
    totalAmount: 2523300,
    paymentStatus: "Paid",
    amountPaid: 2523300,
    balanceDue: 0,
    warehouse: "Lucknow Store (LKO-01)",
    invoiceNumber: "EST-LKO-2026-7501",
    notes: "Consignment lot of 78 certified refurbished premium handsets received at Lucknow Store (LKO-01). All units barcoded.",
  },
];

export const initialSales: SalesOrder[] = [
  {
    id: "TFD-FSO-2611-26083",
    orderNo: "TFD-FSO-2611-26083",
    channelOrderNo: "#FSO-LKO-01-26083 (FSO)",
    channel: "FSO",
    channelName: "Store Outlet",
    typeOfSale: "B2C",
    invoiceNumber: "INVLKO012611-26083",
    customerName: "MANISH SINGH",
    customerPhone: "8299800996",
    customerEmail: "hkltha1235@gmail.com",
    customerAddress: "S/o Munna Singh,E-3/413, Vineet Khand , Gomti Nagar, Lucknow U.P.-226010",
    customerLocalAddress: "S/o Munna Singh,E-3/413, Vineet Khand , Gomti Nagar, Lucknow U.P.-226010",
    customerPermanentAddress: "S/o Munna Singh,E-3/413, Vineet Khand , Gomti Nagar, Lucknow U.P.-226010",
    customerAadhaar: "7385 5337 6952",
    customerGstin: "NA",
    placeOfSupply: "Uttar Pradesh (09)",
    date: "2026-11-19",
    time: "06:55 pm",
    deviceId: "Fun-26083",
    deviceModel: "Xiaomi 11 i Hyper Charge (128GB) Refurbished Stealth Black",
    imei: "867179050310196",
    serialNumber: "SN26083",
    sellingPrice: 15000,
    discount: 0,
    taxAmount: 152.54,
    finalAmount: 15000,
    purchasePrice: 14152.54,
    profitMargin: 847.46,
    paymentMethod: "Google Pay",
    paymentTxnId: "TXN26001LKO982, K811T17950...",
    paymentStatus: "Completed",
    deliveryStatus: "Delivered",
    warrantyMonths: 6,
    warrantyExpiry: "2027-05-19",
    storeName: "Lucknow Store B-124 (LKO-01)",
    storeCode: "LKO-01",
  },
  {
    id: "TFD-FSO-2611-26043",
    orderNo: "TFD-FSO-2611-0002",
    channelOrderNo: "#FSO-LKO-2611-002",
    channel: "FSO",
    channelName: "Store Outlet",
    typeOfSale: "B2C",
    invoiceNumber: "INVLKO012611-26043",
    customerName: "MANISH SINGH",
    customerPhone: "8299800996",
    customerEmail: "hkltha1235@gmail.com",
    customerAddress: "S/o Munna Singh,E-3/413, Vineet Khand , Gomti Nagar, Lucknow U.P.-226010",
    customerLocalAddress: "S/o Munna Singh,E-3/413, Vineet Khand , Gomti Nagar, Lucknow U.P.-226010",
    customerPermanentAddress: "S/o Munna Singh,E-3/413, Vineet Khand , Gomti Nagar, Lucknow U.P.-226010",
    customerAadhaar: "7385 5337 6952",
    customerGstin: "NA",
    placeOfSupply: "Uttar Pradesh (09)",
    date: "2026-11-16",
    time: "09:23 pm",
    deviceId: "Fun-26043",
    deviceModel: "Apple iPhone Oppo K13 5g (128) Refurbished Dark grey",
    imei: "867203075513251",
    serialNumber: "SN26043",
    sellingPrice: 11000,
    discount: 0,
    taxAmount: 175.42,
    finalAmount: 11000,
    purchasePrice: 8580,
    profitMargin: 2420,
    paymentMethod: "UPI",
    paymentTxnId: "K811T17948303256f49824145",
    paymentStatus: "Completed",
    deliveryStatus: "Delivered",
    warrantyMonths: 6,
    warrantyExpiry: "2027-05-16",
    storeName: "Lucknow Store B-124 (LKO-01)",
    storeCode: "LKO-01",
  },
  {
    id: "TFD-FSO-2611-0002",
    orderNo: "TFD-FSO-2611-0002",
    channelOrderNo: "#FSO-LKO-2611-002",
    channel: "FSO",
    channelName: "Store Outlet",
    typeOfSale: "B2C",
    invoiceNumber: "INVLKO012611-0002",
    customerName: "ALTAF",
    customerPhone: "74608646362",
    customerEmail: "NA",
    customerAddress: "S/o Mohd Raqeeb Ulla, Chinhat, News Colony,Gomti nagar, Lucknow, Uttar Pradesh, 226028",
    customerLocalAddress: "S/o Mohd Raqeeb Ulla, Chinhat, News Colony,Gomti nagar, Lucknow, Uttar Pradesh, 226028",
    customerPermanentAddress: "S/o Mohd Raqeeb Ulla, Chinhat, News Colony,Gomti nagar, Lucknow, Uttar Pradesh, 226028",
    customerAadhaar: "4481 3291 8192",
    customerGstin: "NA",
    placeOfSupply: "Uttar Pradesh (09)",
    date: "2026-11-15",
    time: "11:35 am",
    deviceId: "Fun-26049",
    deviceModel: "Apple iPhone 14 pro (128GB) Refurbished White",
    imei: "356983557725459",
    serialNumber: "SN26049",
    sellingPrice: 43000,
    discount: 0,
    taxAmount: 118.98,
    finalAmount: 43000,
    purchasePrice: 35100,
    profitMargin: 7900,
    paymentMethod: "Google Pay",
    paymentTxnId: "T2611141902345516542965",
    paymentStatus: "Completed",
    deliveryStatus: "Delivered",
    warrantyMonths: 6,
    warrantyExpiry: "2027-05-15",
    storeName: "Lucknow Store B-124 (LKO-01)",
    storeCode: "LKO-01",
  },
];

export const initialStockMovements: StockMovement[] = [
  {
    id: "MOV-401",
    date: "2026-11-16 21:23",
    type: "Outward",
    reason: "Sold",
    deviceId: "Fun-26043",
    deviceModel: "Apple iPhone Oppo K13 5g (128) Refurbished Dark grey",
    imei: "867203075513251",
    fromLocation: "Lucknow Store B-124 (LKO-01)",
    toLocation: "Customer (MANISH SINGH)",
    quantity: 1,
    value: 11000,
    initiatedBy: "Sales Engine",
    notes: "Tax Invoice INVLKO012611-26043 dispatch",
  },
  {
    id: "MOV-402",
    date: "2026-11-15 11:35",
    type: "Outward",
    reason: "Sold",
    deviceId: "Fun-26049",
    deviceModel: "Apple iPhone 14 pro (128GB) Refurbished White",
    imei: "356983557725459",
    fromLocation: "Lucknow Store B-124 (LKO-01)",
    toLocation: "Customer (ALTAF)",
    quantity: 1,
    value: 43000,
    initiatedBy: "Sales Engine",
    notes: "Tax Invoice INVLKO012611-0002 dispatch",
  },
  {
    id: "MOV-403",
    date: "2026-11-19 18:55",
    type: "Outward",
    reason: "Sold",
    deviceId: "Fun-26083",
    deviceModel: "Xiaomi 11 i Hyper Charge (128GB) Refurbished Stealth Black",
    imei: "867179050310196",
    fromLocation: "Lucknow Store B-124 (LKO-01)",
    toLocation: "Customer (MANISH SINGH)",
    quantity: 1,
    value: 15000,
    initiatedBy: "Sales Engine",
    notes: "Tax Invoice INVLKO012611-26083 dispatch",
  },
];

export const initialQCInspections: QCInspection[] = [];

export const initialRepairs: RepairJob[] = [];

export const initialAccessories: Accessory[] = [
  {
    id: "ACC-01",
    name: "Apple 20W USB-C Power Adapter (Original Refurb)",
    category: "Charger",
    compatibleBrand: "Apple",
    stockQty: 480,
    reorderLevel: 100,
    costPrice: 650,
    sellingPrice: 1299,
    warehouse: "Mumbai Central Hub",
    sku: "ACC-APL-20W-PWR",
  },
  {
    id: "ACC-02",
    name: "Braided USB-C to Lightning Fast Cable (1m)",
    category: "Cable",
    compatibleBrand: "Apple",
    stockQty: 620,
    reorderLevel: 150,
    costPrice: 220,
    sellingPrice: 599,
    warehouse: "Delhi NCR Depot",
    sku: "ACC-APL-C2L-1M",
  },
  {
    id: "ACC-03",
    name: "Samsung 45W Super Fast Charger 2.0 with Cable",
    category: "Charger",
    compatibleBrand: "Samsung",
    stockQty: 310,
    reorderLevel: 80,
    costPrice: 850,
    sellingPrice: 1799,
    warehouse: "Mumbai Central Hub",
    sku: "ACC-SAM-45W-SFC",
  },
  {
    id: "ACC-04",
    name: "TheFundu Eco-Craft Smartphone Unboxing Box & Kit",
    category: "Packaging Box",
    compatibleBrand: "Universal",
    stockQty: 1850,
    reorderLevel: 500,
    costPrice: 180,
    sellingPrice: 399,
    warehouse: "Mumbai Central Hub",
    sku: "ACC-TFD-BOX-GEN",
  },
  {
    id: "ACC-05",
    name: "9H Oleophobic Tempered Glass for iPhone 15 Pro Max",
    category: "Screen Protector",
    compatibleBrand: "Apple",
    stockQty: 540,
    reorderLevel: 120,
    costPrice: 90,
    sellingPrice: 399,
    warehouse: "Bengaluru Tech Park",
    sku: "ACC-TG-IP15PM",
  },
  {
    id: "ACC-06",
    name: "Spigen Liquid Air Matte TPU Case for Galaxy S24 Ultra",
    category: "Case",
    compatibleBrand: "Samsung",
    stockQty: 140,
    reorderLevel: 50,
    costPrice: 380,
    sellingPrice: 899,
    warehouse: "Hyderabad Logistics",
    sku: "ACC-SPG-S24U-BLK",
  },
];

export const initialEmployees: Employee[] = [
  {
    id: "EMP-101",
    name: "Sunil Verma",
    role: "QC Technician",
    email: "sunil.v@thefundu.com",
    phone: "+91 98201 10923",
    warehouse: "Mumbai Central Hub",
    tasksCompleted: 428,
    efficiencyScore: 98.4,
    status: "Active",
    joiningDate: "2024-03-15",
  },
  {
    id: "EMP-102",
    name: "Karan Johar",
    role: "Hardware Engineer",
    email: "karan.j@thefundu.com",
    phone: "+91 98210 99821",
    warehouse: "Mumbai Central Hub",
    tasksCompleted: 312,
    efficiencyScore: 96.8,
    status: "Active",
    joiningDate: "2024-05-01",
  },
  {
    id: "EMP-103",
    name: "Neha Sharma",
    role: "Inventory Lead",
    email: "neha.s@thefundu.com",
    phone: "+91 98110 33299",
    warehouse: "Delhi NCR Depot",
    tasksCompleted: 610,
    efficiencyScore: 99.1,
    status: "Active",
    joiningDate: "2023-11-10",
  },
  {
    id: "EMP-104",
    name: "Mohd Rizwan",
    role: "Hardware Engineer",
    email: "rizwan.m@thefundu.com",
    phone: "+91 98330 44511",
    warehouse: "Mumbai Central Hub",
    tasksCompleted: 285,
    efficiencyScore: 94.2,
    status: "Active",
    joiningDate: "2024-08-12",
  },
  {
    id: "EMP-105",
    name: "Karthik Rajan",
    role: "Operations Executive",
    email: "karthik.r@thefundu.com",
    phone: "+91 99002 81726",
    warehouse: "Bengaluru Tech Park",
    tasksCompleted: 390,
    efficiencyScore: 97.5,
    status: "Active",
    joiningDate: "2024-01-20",
  },
  {
    id: "EMP-106",
    name: "Pooja Hegde",
    role: "Sales Manager",
    email: "pooja.h@thefundu.com",
    phone: "+91 97412 88319",
    warehouse: "Mumbai Central Hub",
    tasksCompleted: 540,
    efficiencyScore: 98.9,
    status: "Active",
    joiningDate: "2023-09-01",
  },
];

export const initialNotifications: AppNotification[] = [
  {
    id: "NOTIF-1",
    title: "TheFundu OS v2.0 Ready",
    message: "System initialized with 75 certified handsets in stock at Lucknow Store (LKO-01).",
    timestamp: "Just now",
    read: false,
    type: "success",
    link: "/inventory",
  },
  {
    id: "NOTIF-2",
    title: "Tax Invoice INVLKO012611-0002 Generated",
    message: "Apple iPhone 14 Pro (128GB) billed to ALTAF (₹43,000 via Google Pay).",
    timestamp: "15 Nov 2026",
    read: true,
    type: "info",
    link: "/invoice?tab=history",
  },
];


export const initialSpareParts: SparePart[] = [
  {
    id: "PRT-APL-001",
    name: "Apple Super Retina XDR OLED Display (iPhone 13)",
    partNumber: "APL-DISP-IP13-OEM",
    category: "Display",
    compatibleModels: ["iPhone 13", "iPhone 13 mini"],
    stockQuantity: 6,
    minReorderLevel: 3,
    unitCost: 4200,
    sellingPrice: 5900,
    supplierName: "Esterline Bonaparte Corp Hardware Sourcing",
    storeLocation: "Lucknow Store (LKO-01)",
    lastRestockedDate: "2026-11-10",
  },
  {
    id: "PRT-APL-002",
    name: "Apple High-Capacity Battery 3227mAh (iPhone 13)",
    partNumber: "APL-BATT-IP13-3227",
    category: "Battery",
    compatibleModels: ["iPhone 13"],
    stockQuantity: 12,
    minReorderLevel: 4,
    unitCost: 1450,
    sellingPrice: 2400,
    supplierName: "Esterline Bonaparte Corp Hardware Sourcing",
    storeLocation: "Lucknow Store (LKO-01)",
    lastRestockedDate: "2026-11-12",
  },
  {
    id: "PRT-APL-003",
    name: "Apple Dynamic Island ProMotion OLED (iPhone 15 Pro)",
    partNumber: "APL-DISP-IP15P-120HZ",
    category: "Display",
    compatibleModels: ["iPhone 15 Pro", "iPhone 15 Pro Max"],
    stockQuantity: 2,
    minReorderLevel: 3,
    unitCost: 8500,
    sellingPrice: 11900,
    supplierName: "Esterline Bonaparte Corp Hardware Sourcing",
    storeLocation: "Lucknow Store (LKO-01)",
    lastRestockedDate: "2026-11-08",
  },
  {
    id: "PRT-APL-004",
    name: "Apple OEM Battery 3349mAh (iPhone 15)",
    partNumber: "APL-BATT-IP15-3349",
    category: "Battery",
    compatibleModels: ["iPhone 15"],
    stockQuantity: 8,
    minReorderLevel: 3,
    unitCost: 1800,
    sellingPrice: 2800,
    supplierName: "Esterline Bonaparte Corp Hardware Sourcing",
    storeLocation: "Lucknow Store (LKO-01)",
    lastRestockedDate: "2026-11-14",
  },
  {
    id: "PRT-APL-005",
    name: "Apple 48MP Main Camera Optical Stabilization Module",
    partNumber: "APL-CAM-IP14P-48MP",
    category: "Camera",
    compatibleModels: ["iPhone 14 Pro", "iPhone 14 Pro Max"],
    stockQuantity: 4,
    minReorderLevel: 2,
    unitCost: 3800,
    sellingPrice: 5200,
    supplierName: "Esterline Bonaparte Corp Hardware Sourcing",
    storeLocation: "Lucknow Store (LKO-01)",
    lastRestockedDate: "2026-11-09",
  },
  {
    id: "PRT-APL-006",
    name: "USB-C Charging Port Daughterboard Flex Assembly",
    partNumber: "APL-CHG-IP15-USBC",
    category: "Charging Port",
    compatibleModels: ["iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max"],
    stockQuantity: 7,
    minReorderLevel: 3,
    unitCost: 1100,
    sellingPrice: 1800,
    supplierName: "Esterline Bonaparte Corp Hardware Sourcing",
    storeLocation: "Lucknow Store (LKO-01)",
    lastRestockedDate: "2026-11-13",
  },
  {
    id: "PRT-APL-007",
    name: "Laser-Cut Back Glass Housing Assembly",
    partNumber: "APL-HOUS-IP12-BLUE",
    category: "Housing",
    compatibleModels: ["iPhone 12", "iPhone 12 mini"],
    stockQuantity: 1,
    minReorderLevel: 3,
    unitCost: 950,
    sellingPrice: 1700,
    supplierName: "Esterline Bonaparte Corp Hardware Sourcing",
    storeLocation: "Lucknow Store (LKO-01)",
    lastRestockedDate: "2026-11-05",
  },
  {
    id: "PRT-APL-008",
    name: "Ambient Light & TrueTone Programmer Daughterboard IC",
    partNumber: "APL-IC-TRUETONE-V2",
    category: "Motherboard IC",
    compatibleModels: ["iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15"],
    stockQuantity: 5,
    minReorderLevel: 2,
    unitCost: 750,
    sellingPrice: 1400,
    supplierName: "Esterline Bonaparte Corp Hardware Sourcing",
    storeLocation: "Lucknow Store (LKO-01)",
    lastRestockedDate: "2026-11-11",
  },
];

export const initialBuybacks: BuybackRecord[] = [];

export const initialSettlements: DayEndSettlement[] = [];

export const initialWarrantyClaims: WarrantyClaim[] = [];

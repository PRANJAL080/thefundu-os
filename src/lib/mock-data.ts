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
    email: "",
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
    name: "Manish Singh",
    phone: "+91 98390 12844",
    email: "manish.singh@gmail.com",
    city: "Lucknow",
    totalOrders: 2,
    lifetimeValue: 132500,
    activeWarrantyCount: 2,
    returnsCount: 0,
    lastPurchaseDate: "2026-11-19",
    loyaltyTier: "Platinum",
  },
  {
    id: "CUST-003",
    name: "Vikas Singh",
    phone: "+91 98104 77291",
    email: "vikas.singh@outlook.com",
    city: "Lucknow",
    totalOrders: 1,
    lifetimeValue: 51999,
    activeWarrantyCount: 1,
    returnsCount: 0,
    lastPurchaseDate: "2026-11-20",
    loyaltyTier: "Gold",
  },
];

export const initialDevices: Device[] = [
  {
    "id": "Fun-26000",
    "brand": "Apple",
    "model": "iPhone 12 mini",
    "storage": "64GB",
    "colour": "Blue",
    "imei1": "355997875777052",
    "imei2": "355997875825208",
    "serialNumber": "SN26000",
    "sku": "TFD-26000-APP",
    "batteryHealth": 82,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 14040,
      "repairCost": 1800,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 17440,
      "sellingPrice": 18000,
      "projectedProfit": 560,
      "profitMarginPercent": 3.1
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-01",
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
        "id": "ACT-0-1",
        "timestamp": "2026-11-01 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26000. IMEI verified."
      }
    ],
    "repairHistory": [
      {
        "id": "REP-8800",
        "deviceId": "Fun-26000",
        "deviceModel": "Apple IPhone 12 mini",
        "imei": "355997875777052",
        "technicianName": "Karan Johar (Senior Engineer)",
        "problemDescription": "Standard refurb touch display / battery calibration",
        "partsReplaced": [
          "OEM Calibration Cell"
        ],
        "repairCost": 1800,
        "status": "In Progress",
        "startDate": "2026-11-10",
        "beforeImages": [],
        "afterImages": []
      }
    ]
  },
  {
    "id": "Fun-26001",
    "brand": "Apple",
    "model": "iPhone 15 pro max",
    "storage": "256GB",
    "colour": "Blue",
    "imei1": "355319540975419",
    "imei2": "355319540921025",
    "serialNumber": "SN26001",
    "sku": "TFD-26001-APP",
    "batteryHealth": 85,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 54600,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 56200,
      "sellingPrice": 70000,
      "projectedProfit": 13800,
      "profitMarginPercent": 19.7
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-02",
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
        "id": "ACT-1-1",
        "timestamp": "2026-11-02 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26001. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26002",
    "brand": "Apple",
    "model": "iPhone 14 pro max",
    "storage": "256GB",
    "colour": "Blue",
    "imei1": "354064853721668",
    "imei2": "354064852239146",
    "serialNumber": "SN26002",
    "sku": "TFD-26002-APP",
    "batteryHealth": 88,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 42900,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 44500,
      "sellingPrice": 55000,
      "projectedProfit": 10500,
      "profitMarginPercent": 19.1
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-03",
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
        "id": "ACT-2-1",
        "timestamp": "2026-11-03 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26002. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26003",
    "brand": "Apple",
    "model": "iPhone 16 PINK",
    "storage": "128GB",
    "colour": "Default Edition",
    "imei1": "352958414012677",
    "imei2": "",
    "serialNumber": "SN26003",
    "sku": "TFD-26003-APP",
    "batteryHealth": 91,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 46800,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 48400,
      "sellingPrice": 60000,
      "projectedProfit": 11600,
      "profitMarginPercent": 19.3
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-04",
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
        "id": "ACT-3-1",
        "timestamp": "2026-11-04 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26003. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26004",
    "brand": "Apple",
    "model": "iPhone 15 PRO MAX",
    "storage": "256GB",
    "colour": "WHITE",
    "imei1": "356642157403535",
    "imei2": "",
    "serialNumber": "SN26004",
    "sku": "TFD-26004-APP",
    "batteryHealth": 94,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 56940,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 58540,
      "sellingPrice": 73000,
      "projectedProfit": 14460,
      "profitMarginPercent": 19.8
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-05",
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
        "id": "ACT-4-1",
        "timestamp": "2026-11-05 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26004. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26005",
    "brand": "Apple",
    "model": "iPhone 14 pro max",
    "storage": "1TB",
    "colour": "Purple",
    "imei1": "357879430485082",
    "imei2": "",
    "serialNumber": "SN26005",
    "sku": "TFD-26005-APP",
    "batteryHealth": 97,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 42900,
      "repairCost": 1800,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 46300,
      "sellingPrice": 55000,
      "projectedProfit": 8700,
      "profitMarginPercent": 15.8
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-06",
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
        "id": "ACT-5-1",
        "timestamp": "2026-11-06 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26005. IMEI verified."
      }
    ],
    "repairHistory": [
      {
        "id": "REP-8805",
        "deviceId": "Fun-26005",
        "deviceModel": "Apple IPhone 14 pro max",
        "imei": "357879430485082",
        "technicianName": "Karan Johar (Senior Engineer)",
        "problemDescription": "Standard refurb touch display / battery calibration",
        "partsReplaced": [
          "OEM Calibration Cell"
        ],
        "repairCost": 1800,
        "status": "In Progress",
        "startDate": "2026-11-10",
        "beforeImages": [],
        "afterImages": []
      }
    ]
  },
  {
    "id": "Fun-26006",
    "brand": "Apple",
    "model": "iPhone 15 Pro",
    "storage": "256GB",
    "colour": "White",
    "imei1": "357597632009589",
    "imei2": "",
    "serialNumber": "SN26006",
    "sku": "TFD-26006-APP",
    "batteryHealth": 82,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 53040,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 54640,
      "sellingPrice": 68000,
      "projectedProfit": 13360,
      "profitMarginPercent": 19.6
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-07",
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
        "id": "ACT-6-1",
        "timestamp": "2026-11-07 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26006. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26007",
    "brand": "Apple",
    "model": "iPhone 14 pro",
    "storage": "256GB",
    "colour": "Purple",
    "imei1": "353943233721616",
    "imei2": "",
    "serialNumber": "SN26007",
    "sku": "TFD-26007-APP",
    "batteryHealth": 85,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 42900,
      "repairCost": 3200,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 47700,
      "sellingPrice": 55000,
      "projectedProfit": 7300,
      "profitMarginPercent": 13.3
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-08",
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
        "id": "ACT-7-1",
        "timestamp": "2026-11-08 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26007. IMEI verified."
      }
    ],
    "repairHistory": [
      {
        "id": "REP-8807",
        "deviceId": "Fun-26007",
        "deviceModel": "Apple IPhone 14 pro",
        "imei": "353943233721616",
        "technicianName": "Karan Johar (Senior Engineer)",
        "problemDescription": "Standard refurb touch display / battery calibration",
        "partsReplaced": [
          "OEM Calibration Cell"
        ],
        "repairCost": 3200,
        "status": "In Progress",
        "startDate": "2026-11-10",
        "beforeImages": [],
        "afterImages": []
      }
    ]
  },
  {
    "id": "Fun-26008",
    "brand": "Apple",
    "model": "iPhone 15 pro",
    "storage": "128GB",
    "colour": "Grey",
    "imei1": "356444800044612",
    "imei2": "",
    "serialNumber": "SN26008",
    "sku": "TFD-26008-APP",
    "batteryHealth": 88,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 50700,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 52300,
      "sellingPrice": 65000,
      "projectedProfit": 12700,
      "profitMarginPercent": 19.5
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-09",
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
        "id": "ACT-8-1",
        "timestamp": "2026-11-09 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26008. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26009",
    "brand": "Apple",
    "model": "iPhone 13",
    "storage": "128GB",
    "colour": "Blue",
    "imei1": "354928109820194",
    "imei2": "",
    "serialNumber": "SN26009",
    "sku": "TFD-26009-APP",
    "batteryHealth": 91,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 22620,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 24220,
      "sellingPrice": 29000,
      "projectedProfit": 4780,
      "profitMarginPercent": 16.5
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-10",
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
        "id": "ACT-9-1",
        "timestamp": "2026-11-10 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26009. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26010",
    "brand": "Apple",
    "model": "iPhone 16 pro",
    "storage": "256GB",
    "colour": "Grey",
    "imei1": "354935415832459",
    "imei2": "",
    "serialNumber": "SN26010",
    "sku": "TFD-26010-APP",
    "batteryHealth": 94,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 60840,
      "repairCost": 1800,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 64240,
      "sellingPrice": 78000,
      "projectedProfit": 13760,
      "profitMarginPercent": 17.6
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-11",
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
        "id": "ACT-10-1",
        "timestamp": "2026-11-11 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26010. IMEI verified."
      }
    ],
    "repairHistory": [
      {
        "id": "REP-8810",
        "deviceId": "Fun-26010",
        "deviceModel": "Apple IPhone 16 pro",
        "imei": "354935415832459",
        "technicianName": "Karan Johar (Senior Engineer)",
        "problemDescription": "Standard refurb touch display / battery calibration",
        "partsReplaced": [
          "OEM Calibration Cell"
        ],
        "repairCost": 1800,
        "status": "In Progress",
        "startDate": "2026-11-10",
        "beforeImages": [],
        "afterImages": []
      }
    ]
  },
  {
    "id": "Fun-26011",
    "brand": "Apple",
    "model": "iPhone 12 pro",
    "storage": "128GB",
    "colour": "Baby pink",
    "imei1": "356696727120920",
    "imei2": "",
    "serialNumber": "SN26011",
    "sku": "TFD-26011-APP",
    "batteryHealth": 97,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 23400,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 25000,
      "sellingPrice": 30000,
      "projectedProfit": 5000,
      "profitMarginPercent": 16.7
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-12",
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
        "id": "ACT-11-1",
        "timestamp": "2026-11-12 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26011. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26012",
    "brand": "Apple",
    "model": "iPhone 16",
    "storage": "128GB",
    "colour": "Green",
    "imei1": "357043230995515",
    "imei2": "",
    "serialNumber": "SN26012",
    "sku": "TFD-26012-APP",
    "batteryHealth": 82,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 46800,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 48400,
      "sellingPrice": 60000,
      "projectedProfit": 11600,
      "profitMarginPercent": 19.3
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-13",
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
        "id": "ACT-12-1",
        "timestamp": "2026-11-13 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26012. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26013",
    "brand": "Apple",
    "model": "iPhone 16 Pro Max",
    "storage": "128GB",
    "colour": "Off white",
    "imei1": "350717767996825",
    "imei2": "",
    "serialNumber": "SN26013",
    "sku": "TFD-26013-APP",
    "batteryHealth": 85,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 58500,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 60100,
      "sellingPrice": 75000,
      "projectedProfit": 14900,
      "profitMarginPercent": 19.9
    },
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
        "id": "ACT-13-1",
        "timestamp": "2026-11-14 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26013. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26014",
    "brand": "Apple",
    "model": "iPhone 13 pro max",
    "storage": "128GB",
    "colour": "White",
    "imei1": "350879909438510",
    "imei2": "",
    "serialNumber": "SN26014",
    "sku": "TFD-26014-APP",
    "batteryHealth": 88,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 31200,
      "repairCost": 3200,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 36000,
      "sellingPrice": 40000,
      "projectedProfit": 4000,
      "profitMarginPercent": 10
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-01",
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
        "id": "ACT-14-1",
        "timestamp": "2026-11-01 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26014. IMEI verified."
      }
    ],
    "repairHistory": [
      {
        "id": "REP-8814",
        "deviceId": "Fun-26014",
        "deviceModel": "Apple IPhone 13 pro max",
        "imei": "350879909438510",
        "technicianName": "Karan Johar (Senior Engineer)",
        "problemDescription": "Standard refurb touch display / battery calibration",
        "partsReplaced": [
          "OEM Calibration Cell"
        ],
        "repairCost": 3200,
        "status": "In Progress",
        "startDate": "2026-11-10",
        "beforeImages": [],
        "afterImages": []
      }
    ]
  },
  {
    "id": "Fun-26015",
    "brand": "Apple",
    "model": "iPhone 15",
    "storage": "128GB",
    "colour": "Black",
    "imei1": "355820716179553",
    "imei2": "",
    "serialNumber": "SN26015",
    "sku": "TFD-26015-APP",
    "batteryHealth": 91,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 39000,
      "repairCost": 1800,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 42400,
      "sellingPrice": 50000,
      "projectedProfit": 7600,
      "profitMarginPercent": 15.2
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-02",
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
        "id": "ACT-15-1",
        "timestamp": "2026-11-02 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26015. IMEI verified."
      }
    ],
    "repairHistory": [
      {
        "id": "REP-8815",
        "deviceId": "Fun-26015",
        "deviceModel": "Apple IPhone 15",
        "imei": "355820716179553",
        "technicianName": "Karan Johar (Senior Engineer)",
        "problemDescription": "Standard refurb touch display / battery calibration",
        "partsReplaced": [
          "OEM Calibration Cell"
        ],
        "repairCost": 1800,
        "status": "In Progress",
        "startDate": "2026-11-10",
        "beforeImages": [],
        "afterImages": []
      }
    ]
  },
  {
    "id": "Fun-26016",
    "brand": "Apple",
    "model": "iPhone 17 pro",
    "storage": "256GB",
    "colour": "Orange",
    "imei1": "356661402930183",
    "imei2": "",
    "serialNumber": "SN26016",
    "sku": "TFD-26016-APP",
    "batteryHealth": 94,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 85800,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 87400,
      "sellingPrice": 110000,
      "projectedProfit": 22600,
      "profitMarginPercent": 20.5
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-03",
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
        "id": "ACT-16-1",
        "timestamp": "2026-11-03 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26016. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26017",
    "brand": "Apple",
    "model": "iPhone 15 pro",
    "storage": "256GB",
    "colour": "Grey",
    "imei1": "353459391469559",
    "imei2": "",
    "serialNumber": "SN26017",
    "sku": "TFD-26017-APP",
    "batteryHealth": 97,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 50700,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 52300,
      "sellingPrice": 65000,
      "projectedProfit": 12700,
      "profitMarginPercent": 19.5
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-04",
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
        "id": "ACT-17-1",
        "timestamp": "2026-11-04 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26017. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26018",
    "brand": "Apple",
    "model": "iPhone 14+",
    "storage": "128GB",
    "colour": "Dark blue",
    "imei1": "353377521202302",
    "imei2": "",
    "serialNumber": "SN26018",
    "sku": "TFD-26018-APP",
    "batteryHealth": 82,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 29640,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 31240,
      "sellingPrice": 38000,
      "projectedProfit": 6760,
      "profitMarginPercent": 17.8
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-05",
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
        "id": "ACT-18-1",
        "timestamp": "2026-11-05 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26018. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26019",
    "brand": "Samsung",
    "model": "Galaxy S24 Ultra",
    "storage": "256/12",
    "colour": "Grey",
    "imei1": "352722661210255",
    "imei2": "",
    "serialNumber": "SN26019",
    "sku": "TFD-26019-SAM",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 51480,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 53080,
      "sellingPrice": 66000,
      "projectedProfit": 12920,
      "profitMarginPercent": 19.6
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-06",
    "images": [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-19-1",
        "timestamp": "2026-11-06 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26019. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26020",
    "brand": "Samsung",
    "model": "Galaxy s23 fe",
    "storage": "128/8",
    "colour": "Green",
    "imei1": "351005194138941",
    "imei2": "",
    "serialNumber": "SN26020",
    "sku": "TFD-26020-SAM",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 23400,
      "repairCost": 1800,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 26800,
      "sellingPrice": 30000,
      "projectedProfit": 3200,
      "profitMarginPercent": 10.7
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-07",
    "images": [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-20-1",
        "timestamp": "2026-11-07 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26020. IMEI verified."
      }
    ],
    "repairHistory": [
      {
        "id": "REP-8820",
        "deviceId": "Fun-26020",
        "deviceModel": "Samsung Samsung galaxy s23 fe",
        "imei": "351005194138941",
        "technicianName": "Karan Johar (Senior Engineer)",
        "problemDescription": "Standard refurb touch display / battery calibration",
        "partsReplaced": [
          "OEM Calibration Cell"
        ],
        "repairCost": 1800,
        "status": "In Progress",
        "startDate": "2026-11-10",
        "beforeImages": [],
        "afterImages": []
      }
    ]
  },
  {
    "id": "Fun-26021",
    "brand": "Samsung",
    "model": "Galaxy s10e",
    "storage": "128GB",
    "colour": "Grey",
    "imei1": "352808100961234",
    "imei2": "",
    "serialNumber": "SN26021",
    "sku": "TFD-26021-SAM",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 9360,
      "repairCost": 3200,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 14160,
      "sellingPrice": 12000,
      "projectedProfit": -2160,
      "profitMarginPercent": -18
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-08",
    "images": [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-21-1",
        "timestamp": "2026-11-08 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26021. IMEI verified."
      }
    ],
    "repairHistory": [
      {
        "id": "REP-8821",
        "deviceId": "Fun-26021",
        "deviceModel": "Samsung Samsung galaxy s10e",
        "imei": "352808100961234",
        "technicianName": "Karan Johar (Senior Engineer)",
        "problemDescription": "Standard refurb touch display / battery calibration",
        "partsReplaced": [
          "OEM Calibration Cell"
        ],
        "repairCost": 3200,
        "status": "In Progress",
        "startDate": "2026-11-10",
        "beforeImages": [],
        "afterImages": []
      }
    ]
  },
  {
    "id": "Fun-26022",
    "brand": "Samsung",
    "model": "Galaxy s24 ultra",
    "storage": "512GB/12",
    "colour": "Golden",
    "imei1": "353578850761279",
    "imei2": "",
    "serialNumber": "SN26022",
    "sku": "TFD-26022-SAM",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 54600,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 56200,
      "sellingPrice": 70000,
      "projectedProfit": 13800,
      "profitMarginPercent": 19.7
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-09",
    "images": [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-22-1",
        "timestamp": "2026-11-09 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26022. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26023",
    "brand": "Samsung",
    "model": "Galaxy s23 ultra",
    "storage": "512/12",
    "colour": "Black",
    "imei1": "353992851703133",
    "imei2": "",
    "serialNumber": "SN26023",
    "sku": "TFD-26023-SAM",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 40560,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 42160,
      "sellingPrice": 52000,
      "projectedProfit": 9840,
      "profitMarginPercent": 18.9
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-10",
    "images": [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-23-1",
        "timestamp": "2026-11-10 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26023. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26024",
    "brand": "Samsung",
    "model": "Galaxy a56 5g",
    "storage": "256/12",
    "colour": "Light green/sea green",
    "imei1": "356300332281603",
    "imei2": "",
    "serialNumber": "SN26024",
    "sku": "TFD-26024-SAM",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 27300,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 28900,
      "sellingPrice": 35000,
      "projectedProfit": 6100,
      "profitMarginPercent": 17.4
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-11",
    "images": [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-24-1",
        "timestamp": "2026-11-11 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26024. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26025",
    "brand": "Samsung",
    "model": "Galaxy s23 ultra",
    "storage": "256/12",
    "colour": "Black",
    "imei1": "353835882416094",
    "imei2": "",
    "serialNumber": "SN26025",
    "sku": "TFD-26025-SAM",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 37440,
      "repairCost": 1800,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 40840,
      "sellingPrice": 48000,
      "projectedProfit": 7160,
      "profitMarginPercent": 14.9
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-12",
    "images": [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-25-1",
        "timestamp": "2026-11-12 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26025. IMEI verified."
      }
    ],
    "repairHistory": [
      {
        "id": "REP-8825",
        "deviceId": "Fun-26025",
        "deviceModel": "Samsung Samsung galaxy s23 ultra",
        "imei": "353835882416094",
        "technicianName": "Karan Johar (Senior Engineer)",
        "problemDescription": "Standard refurb touch display / battery calibration",
        "partsReplaced": [
          "OEM Calibration Cell"
        ],
        "repairCost": 1800,
        "status": "In Progress",
        "startDate": "2026-11-10",
        "beforeImages": [],
        "afterImages": []
      }
    ]
  },
  {
    "id": "Fun-26026",
    "brand": "Samsung",
    "model": "Galaxy S26 5G",
    "storage": "128GB",
    "colour": "Amber Yellow",
    "imei1": "353835882416095",
    "imei2": "",
    "serialNumber": "SN26026",
    "sku": "TFD-26026-SAM",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 7020,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 8620,
      "sellingPrice": 9000,
      "projectedProfit": 380,
      "profitMarginPercent": 4.2
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-13",
    "images": [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-26-1",
        "timestamp": "2026-11-13 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26026. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26027",
    "brand": "Samsung",
    "model": "Galaxy z fold 5",
    "storage": "512/12",
    "colour": "Off white",
    "imei1": "352271450924668",
    "imei2": "",
    "serialNumber": "SN26027",
    "sku": "TFD-26027-SAM",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 45240,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 46840,
      "sellingPrice": 58000,
      "projectedProfit": 11160,
      "profitMarginPercent": 19.2
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-27-1",
        "timestamp": "2026-11-14 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26027. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26028",
    "brand": "Samsung",
    "model": "Galaxy z fold 6",
    "storage": "256/12",
    "colour": "Pink",
    "imei1": "351379490556548",
    "imei2": "",
    "serialNumber": "SN26028",
    "sku": "TFD-26028-SAM",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 54600,
      "repairCost": 3200,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 59400,
      "sellingPrice": 70000,
      "projectedProfit": 10600,
      "profitMarginPercent": 15.1
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-01",
    "images": [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-28-1",
        "timestamp": "2026-11-01 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26028. IMEI verified."
      }
    ],
    "repairHistory": [
      {
        "id": "REP-8828",
        "deviceId": "Fun-26028",
        "deviceModel": "Samsung Samsung galaxy z fold 6",
        "imei": "351379490556548",
        "technicianName": "Karan Johar (Senior Engineer)",
        "problemDescription": "Standard refurb touch display / battery calibration",
        "partsReplaced": [
          "OEM Calibration Cell"
        ],
        "repairCost": 3200,
        "status": "In Progress",
        "startDate": "2026-11-10",
        "beforeImages": [],
        "afterImages": []
      }
    ]
  },
  {
    "id": "Fun-26029",
    "brand": "Samsung",
    "model": "Galaxy 23 fe",
    "storage": "128/8",
    "colour": "Orange",
    "imei1": "351005191215247",
    "imei2": "",
    "serialNumber": "SN26029",
    "sku": "TFD-26029-SAM",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 24180,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 25780,
      "sellingPrice": 31000,
      "projectedProfit": 5220,
      "profitMarginPercent": 16.8
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-02",
    "images": [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-29-1",
        "timestamp": "2026-11-02 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26029. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26030",
    "brand": "OnePlus",
    "model": "Oneplus nord 5",
    "storage": "256/8",
    "colour": "Blue",
    "imei1": "863995079682917",
    "imei2": "",
    "serialNumber": "SN26030",
    "sku": "TFD-26030-ONE",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 28860,
      "repairCost": 1800,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 32260,
      "sellingPrice": 37000,
      "projectedProfit": 4740,
      "profitMarginPercent": 12.8
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-03",
    "images": [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-30-1",
        "timestamp": "2026-11-03 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26030. IMEI verified."
      }
    ],
    "repairHistory": [
      {
        "id": "REP-8830",
        "deviceId": "Fun-26030",
        "deviceModel": "OnePlus Oneplus nord 5",
        "imei": "863995079682917",
        "technicianName": "Karan Johar (Senior Engineer)",
        "problemDescription": "Standard refurb touch display / battery calibration",
        "partsReplaced": [
          "OEM Calibration Cell"
        ],
        "repairCost": 1800,
        "status": "In Progress",
        "startDate": "2026-11-10",
        "beforeImages": [],
        "afterImages": []
      }
    ]
  },
  {
    "id": "Fun-26031",
    "brand": "OnePlus",
    "model": "Oneplus 8",
    "storage": "128",
    "colour": "Blue",
    "imei1": "869796042087034",
    "imei2": "",
    "serialNumber": "SN26031",
    "sku": "TFD-26031-ONE",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 14040,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 15640,
      "sellingPrice": 18000,
      "projectedProfit": 2360,
      "profitMarginPercent": 13.1
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-04",
    "images": [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-31-1",
        "timestamp": "2026-11-04 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26031. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26032",
    "brand": "OnePlus",
    "model": "Oneplus 10 pro 5g",
    "storage": "256",
    "colour": "Black",
    "imei1": "868368053231199",
    "imei2": "",
    "serialNumber": "SN26032",
    "sku": "TFD-26032-ONE",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 21840,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 23440,
      "sellingPrice": 28000,
      "projectedProfit": 4560,
      "profitMarginPercent": 16.3
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-05",
    "images": [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-32-1",
        "timestamp": "2026-11-05 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26032. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26033",
    "brand": "Motorola",
    "model": "Motorola g8 5g",
    "storage": "128/8",
    "colour": "Green",
    "imei1": "352532337308015",
    "imei2": "",
    "serialNumber": "SN26033",
    "sku": "TFD-26033-MOT",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 13260,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 14860,
      "sellingPrice": 17000,
      "projectedProfit": 2140,
      "profitMarginPercent": 12.6
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-06",
    "images": [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-33-1",
        "timestamp": "2026-11-06 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26033. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26034",
    "brand": "Motorola",
    "model": "Motorola g62 5g",
    "storage": "128GB",
    "colour": "Blue",
    "imei1": "357807166012077",
    "imei2": "",
    "serialNumber": "SN26034",
    "sku": "TFD-26034-MOT",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 8580,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 10180,
      "sellingPrice": 11000,
      "projectedProfit": 820,
      "profitMarginPercent": 7.5
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-07",
    "images": [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-34-1",
        "timestamp": "2026-11-07 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26034. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26035",
    "brand": "Realme",
    "model": "Realme C83 5G",
    "storage": "128/6",
    "colour": "Black",
    "imei1": "866276083086859",
    "imei2": "",
    "serialNumber": "SN26035",
    "sku": "TFD-26035-REA",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 12480,
      "repairCost": 1800,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 15880,
      "sellingPrice": 16000,
      "projectedProfit": 120,
      "profitMarginPercent": 0.8
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-08",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-35-1",
        "timestamp": "2026-11-08 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26035. IMEI verified."
      }
    ],
    "repairHistory": [
      {
        "id": "REP-8835",
        "deviceId": "Fun-26035",
        "deviceModel": "Realme Realme C83 5G",
        "imei": "866276083086859",
        "technicianName": "Karan Johar (Senior Engineer)",
        "problemDescription": "Standard refurb touch display / battery calibration",
        "partsReplaced": [
          "OEM Calibration Cell"
        ],
        "repairCost": 1800,
        "status": "In Progress",
        "startDate": "2026-11-10",
        "beforeImages": [],
        "afterImages": []
      }
    ]
  },
  {
    "id": "Fun-26036",
    "brand": "Realme",
    "model": "Realme 12 Pro 5G",
    "storage": "256/8",
    "colour": "Dark blue",
    "imei1": "861888066729878",
    "imei2": "",
    "serialNumber": "SN26036",
    "sku": "TFD-26036-APP",
    "batteryHealth": 82,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 13260,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 14860,
      "sellingPrice": 17000,
      "projectedProfit": 2140,
      "profitMarginPercent": 12.6
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-09",
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
        "id": "ACT-36-1",
        "timestamp": "2026-11-09 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26036. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26037",
    "brand": "Motorola",
    "model": "Motorola Edge 40",
    "storage": "256",
    "colour": "Black",
    "imei1": "357611735734470",
    "imei2": "",
    "serialNumber": "SN26037",
    "sku": "TFD-26037-MOT",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 13260,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 14860,
      "sellingPrice": 17000,
      "projectedProfit": 2140,
      "profitMarginPercent": 12.6
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-10",
    "images": [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-37-1",
        "timestamp": "2026-11-10 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26037. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26038",
    "brand": "Poco",
    "model": "Poco x4 pro 5g",
    "storage": "128GB",
    "colour": "Blue",
    "imei1": "862531055496351",
    "imei2": "",
    "serialNumber": "SN26038",
    "sku": "TFD-26038-POC",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 11700,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 13300,
      "sellingPrice": 15000,
      "projectedProfit": 1700,
      "profitMarginPercent": 11.3
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-11",
    "images": [
      "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-38-1",
        "timestamp": "2026-11-11 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26038. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26039",
    "brand": "Google",
    "model": "Google Pixel 9A",
    "storage": "256GB",
    "colour": "Purple",
    "imei1": "359892181623429",
    "imei2": "",
    "serialNumber": "SN26039",
    "sku": "TFD-26039-GOO",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 28860,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 30460,
      "sellingPrice": 37000,
      "projectedProfit": 6540,
      "profitMarginPercent": 17.7
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-12",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-39-1",
        "timestamp": "2026-11-12 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26039. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26040",
    "brand": "Google",
    "model": "Google Pixel 8",
    "storage": "128GB",
    "colour": "Default Edition",
    "imei1": "357481895108463",
    "imei2": "",
    "serialNumber": "SN26040",
    "sku": "TFD-26040-GOO",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 19500,
      "repairCost": 1800,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 22900,
      "sellingPrice": 25000,
      "projectedProfit": 2100,
      "profitMarginPercent": 8.4
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-13",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-40-1",
        "timestamp": "2026-11-13 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26040. IMEI verified."
      }
    ],
    "repairHistory": [
      {
        "id": "REP-8840",
        "deviceId": "Fun-26040",
        "deviceModel": "Google Google Pixel 8",
        "imei": "357481895108463",
        "technicianName": "Karan Johar (Senior Engineer)",
        "problemDescription": "Standard refurb touch display / battery calibration",
        "partsReplaced": [
          "OEM Calibration Cell"
        ],
        "repairCost": 1800,
        "status": "In Progress",
        "startDate": "2026-11-10",
        "beforeImages": [],
        "afterImages": []
      }
    ]
  },
  {
    "id": "Fun-26041",
    "brand": "Xiaomi",
    "model": "Redmi 11 prime 5g",
    "storage": "128GB",
    "colour": "Black",
    "imei1": "860825059738715",
    "imei2": "",
    "serialNumber": "SN26041",
    "sku": "TFD-26041-XIA",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 8580,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 10180,
      "sellingPrice": 11000,
      "projectedProfit": 820,
      "profitMarginPercent": 7.5
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-41-1",
        "timestamp": "2026-11-14 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26041. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26042",
    "brand": "Vivo",
    "model": "Vivo v70 fe",
    "storage": "256",
    "colour": "Blue",
    "imei1": "861130083750250",
    "imei2": "",
    "serialNumber": "SN26042",
    "sku": "TFD-26042-VIV",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 36660,
      "repairCost": 3200,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 41460,
      "sellingPrice": 47000,
      "projectedProfit": 5540,
      "profitMarginPercent": 11.8
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-01",
    "images": [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-42-1",
        "timestamp": "2026-11-01 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26042. IMEI verified."
      }
    ],
    "repairHistory": [
      {
        "id": "REP-8842",
        "deviceId": "Fun-26042",
        "deviceModel": "Vivo Vivo v70 fe",
        "imei": "861130083750250",
        "technicianName": "Karan Johar (Senior Engineer)",
        "problemDescription": "Standard refurb touch display / battery calibration",
        "partsReplaced": [
          "OEM Calibration Cell"
        ],
        "repairCost": 3200,
        "status": "In Progress",
        "startDate": "2026-11-10",
        "beforeImages": [],
        "afterImages": []
      }
    ]
  },
  {
    "id": "Fun-26043",
    "brand": "Oppo",
    "model": "Oppo K13 5g",
    "storage": "128",
    "colour": "Dark grey",
    "imei1": "867203075513251",
    "imei2": "",
    "serialNumber": "SN26043",
    "sku": "TFD-26043-APP",
    "batteryHealth": 85,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 8580,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 10180,
      "sellingPrice": 11000,
      "projectedProfit": 820,
      "profitMarginPercent": 7.5
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-02",
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
        "id": "ACT-43-1",
        "timestamp": "2026-11-02 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26043. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26044",
    "brand": "Apple",
    "model": "iPhone 15",
    "storage": "256GB",
    "colour": "White",
    "imei1": "352691622226447",
    "imei2": "",
    "serialNumber": "SN26044",
    "sku": "TFD-26044-APP",
    "batteryHealth": 88,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 39000,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 40600,
      "sellingPrice": 50000,
      "projectedProfit": 9400,
      "profitMarginPercent": 18.8
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-03",
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
        "id": "ACT-44-1",
        "timestamp": "2026-11-03 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26044. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26045",
    "brand": "Apple",
    "model": "iPhone 15",
    "storage": "128GB",
    "colour": "White",
    "imei1": "359757422350951",
    "imei2": "",
    "serialNumber": "SN26045",
    "sku": "TFD-26045-APP",
    "batteryHealth": 91,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 35100,
      "repairCost": 1800,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 38500,
      "sellingPrice": 45000,
      "projectedProfit": 6500,
      "profitMarginPercent": 14.4
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-04",
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
        "id": "ACT-45-1",
        "timestamp": "2026-11-04 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26045. IMEI verified."
      }
    ],
    "repairHistory": [
      {
        "id": "REP-8845",
        "deviceId": "Fun-26045",
        "deviceModel": "Apple Iphone 15",
        "imei": "359757422350951",
        "technicianName": "Karan Johar (Senior Engineer)",
        "problemDescription": "Standard refurb touch display / battery calibration",
        "partsReplaced": [
          "OEM Calibration Cell"
        ],
        "repairCost": 1800,
        "status": "In Progress",
        "startDate": "2026-11-10",
        "beforeImages": [],
        "afterImages": []
      }
    ]
  },
  {
    "id": "Fun-26046",
    "brand": "Apple",
    "model": "iPhone15 pro",
    "storage": "128GB",
    "colour": "Grey",
    "imei1": "355002400218829",
    "imei2": "",
    "serialNumber": "SN26046",
    "sku": "TFD-26046-APP",
    "batteryHealth": 94,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 49140,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 50740,
      "sellingPrice": 63000,
      "projectedProfit": 12260,
      "profitMarginPercent": 19.5
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-05",
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
        "id": "ACT-46-1",
        "timestamp": "2026-11-05 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26046. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26047",
    "brand": "Vivo",
    "model": "Vivo V50e",
    "storage": "256/8",
    "colour": "Purple",
    "imei1": "865186079119377",
    "imei2": "",
    "serialNumber": "SN26047",
    "sku": "TFD-26047-VIV",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 20280,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 21880,
      "sellingPrice": 26000,
      "projectedProfit": 4120,
      "profitMarginPercent": 15.8
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-06",
    "images": [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-47-1",
        "timestamp": "2026-11-06 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26047. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26048",
    "brand": "Motorola",
    "model": "Moto G54 5g",
    "storage": "128/8",
    "colour": "Black",
    "imei1": "350835850946471",
    "imei2": "",
    "serialNumber": "SN26048",
    "sku": "TFD-26048-MOT",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 8580,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 10180,
      "sellingPrice": 11000,
      "projectedProfit": 820,
      "profitMarginPercent": 7.5
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-07",
    "images": [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-48-1",
        "timestamp": "2026-11-07 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26048. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26049",
    "brand": "Apple",
    "model": "iPhone 14 pro",
    "storage": "128GB",
    "colour": "White",
    "imei1": "356903557725459",
    "imei2": "",
    "serialNumber": "SN26049",
    "sku": "TFD-26049-APP",
    "batteryHealth": 85,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 35100,
      "repairCost": 3200,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 39900,
      "sellingPrice": 45000,
      "projectedProfit": 5100,
      "profitMarginPercent": 11.3
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-08",
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
        "id": "ACT-49-1",
        "timestamp": "2026-11-08 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26049. IMEI verified."
      }
    ],
    "repairHistory": [
      {
        "id": "REP-8849",
        "deviceId": "Fun-26049",
        "deviceModel": "Apple Iphone 14 pro",
        "imei": "356903557725459",
        "technicianName": "Karan Johar (Senior Engineer)",
        "problemDescription": "Standard refurb touch display / battery calibration",
        "partsReplaced": [
          "OEM Calibration Cell"
        ],
        "repairCost": 3200,
        "status": "In Progress",
        "startDate": "2026-11-10",
        "beforeImages": [],
        "afterImages": []
      }
    ]
  },
  {
    "id": "Fun-26050",
    "brand": "Samsung",
    "model": "Samsung S23 Ultra",
    "storage": "256GB",
    "colour": "Olive green",
    "imei1": "353835883434245",
    "imei2": "",
    "serialNumber": "SN26050",
    "sku": "TFD-26050-SAM",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 41340,
      "repairCost": 1800,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 44740,
      "sellingPrice": 53000,
      "projectedProfit": 8260,
      "profitMarginPercent": 15.6
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-09",
    "images": [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-50-1",
        "timestamp": "2026-11-09 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26050. IMEI verified."
      }
    ],
    "repairHistory": [
      {
        "id": "REP-8850",
        "deviceId": "Fun-26050",
        "deviceModel": "Samsung Samsung S23 Ultra",
        "imei": "353835883434245",
        "technicianName": "Karan Johar (Senior Engineer)",
        "problemDescription": "Standard refurb touch display / battery calibration",
        "partsReplaced": [
          "OEM Calibration Cell"
        ],
        "repairCost": 1800,
        "status": "In Progress",
        "startDate": "2026-11-10",
        "beforeImages": [],
        "afterImages": []
      }
    ]
  },
  {
    "id": "Fun-26051",
    "brand": "Apple",
    "model": "iPhone 15 plus",
    "storage": "128GB",
    "colour": "White",
    "imei1": "350110763563296",
    "imei2": "",
    "serialNumber": "SN26051",
    "sku": "TFD-26051-APP",
    "batteryHealth": 91,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 42900,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 44500,
      "sellingPrice": 55000,
      "projectedProfit": 10500,
      "profitMarginPercent": 19.1
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-10",
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
        "id": "ACT-51-1",
        "timestamp": "2026-11-10 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26051. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26052",
    "brand": "Oppo",
    "model": "Oppo A5X 5g",
    "storage": "128GB",
    "colour": "Dark grey",
    "imei1": "867276071326696",
    "imei2": "",
    "serialNumber": "SN26052",
    "sku": "TFD-26052-OPP",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 10530,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 12130,
      "sellingPrice": 13500,
      "projectedProfit": 1370,
      "profitMarginPercent": 10.1
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-11",
    "images": [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-52-1",
        "timestamp": "2026-11-11 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26052. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26053",
    "brand": "Vivo",
    "model": "Vivo t5 pro 5g",
    "storage": "256GB/8+8",
    "colour": "Light blue",
    "imei1": "860235087243219",
    "imei2": "",
    "serialNumber": "SN26053",
    "sku": "TFD-26053-VIV",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 28860,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 30460,
      "sellingPrice": 37000,
      "projectedProfit": 6540,
      "profitMarginPercent": 17.7
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-12",
    "images": [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-53-1",
        "timestamp": "2026-11-12 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26053. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26054",
    "brand": "Realme",
    "model": "Realme Narzo 50 pro 5g",
    "storage": "128/6",
    "colour": "Blue",
    "imei1": "861084050921719",
    "imei2": "",
    "serialNumber": "SN26054",
    "sku": "TFD-26054-REA",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 11700,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 13300,
      "sellingPrice": 15000,
      "projectedProfit": 1700,
      "profitMarginPercent": 11.3
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-13",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-54-1",
        "timestamp": "2026-11-13 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26054. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26055",
    "brand": "Poco",
    "model": "Poco M4 5g",
    "storage": "64",
    "colour": "Black",
    "imei1": "869198055527792",
    "imei2": "",
    "serialNumber": "SN26055",
    "sku": "TFD-26055-POC",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 8580,
      "repairCost": 1800,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 11980,
      "sellingPrice": 11000,
      "projectedProfit": -980,
      "profitMarginPercent": -8.9
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-55-1",
        "timestamp": "2026-11-14 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26055. IMEI verified."
      }
    ],
    "repairHistory": [
      {
        "id": "REP-8855",
        "deviceId": "Fun-26055",
        "deviceModel": "Poco Poco M4 5g",
        "imei": "869198055527792",
        "technicianName": "Karan Johar (Senior Engineer)",
        "problemDescription": "Standard refurb touch display / battery calibration",
        "partsReplaced": [
          "OEM Calibration Cell"
        ],
        "repairCost": 1800,
        "status": "In Progress",
        "startDate": "2026-11-10",
        "beforeImages": [],
        "afterImages": []
      }
    ]
  },
  {
    "id": "Fun-26056",
    "brand": "Realme",
    "model": "Realme P3x 5g",
    "storage": "128/8",
    "colour": "Peach color",
    "imei1": "865758073065754",
    "imei2": "",
    "serialNumber": "SN26056",
    "sku": "TFD-26056-REA",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 10530,
      "repairCost": 3200,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 15330,
      "sellingPrice": 13500,
      "projectedProfit": -1830,
      "profitMarginPercent": -13.6
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-01",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-56-1",
        "timestamp": "2026-11-01 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26056. IMEI verified."
      }
    ],
    "repairHistory": [
      {
        "id": "REP-8856",
        "deviceId": "Fun-26056",
        "deviceModel": "Realme Realme P3x 5g",
        "imei": "865758073065754",
        "technicianName": "Karan Johar (Senior Engineer)",
        "problemDescription": "Standard refurb touch display / battery calibration",
        "partsReplaced": [
          "OEM Calibration Cell"
        ],
        "repairCost": 3200,
        "status": "In Progress",
        "startDate": "2026-11-10",
        "beforeImages": [],
        "afterImages": []
      }
    ]
  },
  {
    "id": "Fun-26057",
    "brand": "Samsung",
    "model": "Galaxy F14 5g",
    "storage": "128GB",
    "colour": "Purple",
    "imei1": "350145990929795",
    "imei2": "",
    "serialNumber": "SN26057",
    "sku": "TFD-26057-SAM",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 9360,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 10960,
      "sellingPrice": 12000,
      "projectedProfit": 1040,
      "profitMarginPercent": 8.7
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-02",
    "images": [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-57-1",
        "timestamp": "2026-11-02 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26057. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26058",
    "brand": "Samsung",
    "model": "Samsung S24 FE",
    "storage": "128/8",
    "colour": "Dark grey",
    "imei1": "350487770140585",
    "imei2": "",
    "serialNumber": "SN26058",
    "sku": "TFD-26058-SAM",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 24960,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 26560,
      "sellingPrice": 32000,
      "projectedProfit": 5440,
      "profitMarginPercent": 17
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-03",
    "images": [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-58-1",
        "timestamp": "2026-11-03 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26058. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26059",
    "brand": "Samsung",
    "model": "Galaxy S26+ 5G",
    "storage": "256GB",
    "colour": "Onyx Black",
    "imei1": "359695533663039",
    "imei2": "",
    "serialNumber": "SN26059",
    "sku": "TFD-26059-SAM",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 10530,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 12130,
      "sellingPrice": 13500,
      "projectedProfit": 1370,
      "profitMarginPercent": 10.1
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-04",
    "images": [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-59-1",
        "timestamp": "2026-11-04 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26059. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26060",
    "brand": "Vivo",
    "model": "Vivo 14 funtouch OS",
    "storage": "128/8",
    "colour": "Blue",
    "imei1": "868526067064191",
    "imei2": "",
    "serialNumber": "SN26060",
    "sku": "TFD-26060-VIV",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 11700,
      "repairCost": 1800,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 15100,
      "sellingPrice": 15000,
      "projectedProfit": -100,
      "profitMarginPercent": -0.7
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-05",
    "images": [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-60-1",
        "timestamp": "2026-11-05 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26060. IMEI verified."
      }
    ],
    "repairHistory": [
      {
        "id": "REP-8860",
        "deviceId": "Fun-26060",
        "deviceModel": "Vivo Vivo 14 funtouch OS",
        "imei": "868526067064191",
        "technicianName": "Karan Johar (Senior Engineer)",
        "problemDescription": "Standard refurb touch display / battery calibration",
        "partsReplaced": [
          "OEM Calibration Cell"
        ],
        "repairCost": 1800,
        "status": "In Progress",
        "startDate": "2026-11-10",
        "beforeImages": [],
        "afterImages": []
      }
    ]
  },
  {
    "id": "Fun-26061",
    "brand": "Xiaomi",
    "model": "Xiaomi Redmi note 14 5g",
    "storage": "128/6",
    "colour": "White",
    "imei1": "869958077174083",
    "imei2": "",
    "serialNumber": "SN26061",
    "sku": "TFD-26061-XIA",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 13650,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 15250,
      "sellingPrice": 17500,
      "projectedProfit": 2250,
      "profitMarginPercent": 12.9
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-06",
    "images": [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-61-1",
        "timestamp": "2026-11-06 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26061. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26062",
    "brand": "Samsung",
    "model": "Galaxy S26 Ultra",
    "storage": "512GB",
    "colour": "Titanium Silver",
    "imei1": "358780490491292",
    "imei2": "",
    "serialNumber": "SN26062",
    "sku": "TFD-26062-SAM",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 81900,
      "repairCost": 0,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 83500,
      "sellingPrice": 105000,
      "projectedProfit": 21500,
      "profitMarginPercent": 20.5
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-07",
    "images": [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Qualcomm Snapdragon / MediaTek 5G",
      "screenSize": "6.1\" - 6.8\" High Refresh Display",
      "cameraSpecs": "Certified Dual / Triple Camera system",
      "network": "5G VoLTE Dual SIM / eSIM",
      "osVersion": "Android 14/15"
    },
    "activityTimeline": [
      {
        "id": "ACT-62-1",
        "timestamp": "2026-11-07 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26062. IMEI verified."
      }
    ],
    "repairHistory": []
  },
  {
    "id": "Fun-26063",
    "brand": "Apple",
    "model": "iPhone 11ProMax",
    "storage": "64",
    "colour": "Default Edition",
    "imei1": "353920104147170",
    "imei2": "",
    "serialNumber": "SN26063",
    "sku": "TFD-26063-APP",
    "batteryHealth": 91,
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 17940,
      "repairCost": 3200,
      "testingCost": 500,
      "packagingCost": 400,
      "logisticsCost": 500,
      "otherCost": 200,
      "totalLandedCost": 22740,
      "sellingPrice": 23000,
      "projectedProfit": 260,
      "profitMarginPercent": 1.1
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-08",
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
        "id": "ACT-63-1",
        "timestamp": "2026-11-08 11:30",
        "user": "Intake Lead (Vikram Singhania)",
        "action": "Inward Intake Verified",
        "details": "Logged from consignor batch. Assigned Order ID Fun-26063. IMEI verified."
      }
    ],
    "repairHistory": [
      {
        "id": "REP-8863",
        "deviceId": "Fun-26063",
        "deviceModel": "Apple IPhone 11ProMax",
        "imei": "353920104147170",
        "technicianName": "Karan Johar (Senior Engineer)",
        "problemDescription": "Standard refurb touch display / battery calibration",
        "partsReplaced": [
          "OEM Calibration Cell"
        ],
        "repairCost": 3200,
        "status": "In Progress",
        "startDate": "2026-11-10",
        "beforeImages": [],
        "afterImages": []
      }
    ]
  },
  {
    "id": "Fun-26064",
    "brand": "Apple",
    "model": "iPhone 15 Pro Max",
    "storage": "256GB",
    "colour": "Natural Titanium",
    "imei1": "359078245961126",
    "serialNumber": "SN26064",
    "sku": "TFD-26064-APP",
    "batteryHealth": 90,
    "grade": "A",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 68000,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 0,
      "logisticsCost": 350,
      "otherCost": 0,
      "totalLandedCost": 68600,
      "sellingPrice": 79999,
      "projectedProfit": 11399,
      "profitMarginPercent": 14
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80"
    ],
    "activityTimeline": [],
    "repairHistory": [],
    "specifications": {
      "chipset": "Flagship High-Performance Octa-Core Processor",
      "screenSize": "6.7 inch High Refresh Rate OLED HDR Display",
      "cameraSpecs": "50MP Triple Studio Grade Matrix Camera",
      "network": "5G Dual SIM VoLTE Supported",
      "osVersion": "Certified Production Clean OS"
    }
  },
  {
    "id": "Fun-26065",
    "brand": "Samsung",
    "model": "Galaxy S23 FE",
    "storage": "128GB",
    "colour": "Mint",
    "imei1": "354928190284918",
    "serialNumber": "SN26065",
    "sku": "TFD-26065-SAM",
    "batteryHealth": 90,
    "grade": "A",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 28000,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 0,
      "logisticsCost": 350,
      "otherCost": 0,
      "totalLandedCost": 28600,
      "sellingPrice": 34999,
      "projectedProfit": 6399,
      "profitMarginPercent": 18
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80"
    ],
    "activityTimeline": [],
    "repairHistory": [],
    "specifications": {
      "chipset": "Flagship High-Performance Octa-Core Processor",
      "screenSize": "6.7 inch High Refresh Rate OLED HDR Display",
      "cameraSpecs": "50MP Triple Studio Grade Matrix Camera",
      "network": "5G Dual SIM VoLTE Supported",
      "osVersion": "Certified Production Clean OS"
    }
  },
  {
    "id": "Fun-26066",
    "brand": "Apple",
    "model": "iPhone 13",
    "storage": "128GB",
    "colour": "Midnight",
    "imei1": "353920194820188",
    "serialNumber": "SN26066",
    "sku": "TFD-26066-APP",
    "batteryHealth": 90,
    "grade": "A",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 31000,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 0,
      "logisticsCost": 350,
      "otherCost": 0,
      "totalLandedCost": 31600,
      "sellingPrice": 38999,
      "projectedProfit": 7399,
      "profitMarginPercent": 19
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80"
    ],
    "activityTimeline": [],
    "repairHistory": [],
    "specifications": {
      "chipset": "Flagship High-Performance Octa-Core Processor",
      "screenSize": "6.7 inch High Refresh Rate OLED HDR Display",
      "cameraSpecs": "50MP Triple Studio Grade Matrix Camera",
      "network": "5G Dual SIM VoLTE Supported",
      "osVersion": "Certified Production Clean OS"
    }
  },
  {
    "id": "Fun-26067",
    "brand": "OnePlus",
    "model": "OnePlus 11R",
    "storage": "128GB",
    "colour": "Galactic Silver",
    "imei1": "352910492819288",
    "serialNumber": "SN26067",
    "sku": "TFD-26067-OP",
    "batteryHealth": 90,
    "grade": "A",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 24000,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 0,
      "logisticsCost": 350,
      "otherCost": 0,
      "totalLandedCost": 24600,
      "sellingPrice": 29999,
      "projectedProfit": 5399,
      "profitMarginPercent": 18
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80"
    ],
    "activityTimeline": [],
    "repairHistory": [],
    "specifications": {
      "chipset": "Flagship High-Performance Octa-Core Processor",
      "screenSize": "6.7 inch High Refresh Rate OLED HDR Display",
      "cameraSpecs": "50MP Triple Studio Grade Matrix Camera",
      "network": "5G Dual SIM VoLTE Supported",
      "osVersion": "Certified Production Clean OS"
    }
  },
  {
    "id": "Fun-26068",
    "brand": "Vivo",
    "model": "Vivo V30 Pro",
    "storage": "256GB",
    "colour": "Classic Black",
    "imei1": "351920492810288",
    "serialNumber": "SN26068",
    "sku": "TFD-26068-VIV",
    "batteryHealth": 90,
    "grade": "A",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 26000,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 0,
      "logisticsCost": 350,
      "otherCost": 0,
      "totalLandedCost": 26600,
      "sellingPrice": 32999,
      "projectedProfit": 6399,
      "profitMarginPercent": 19
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80"
    ],
    "activityTimeline": [],
    "repairHistory": [],
    "specifications": {
      "chipset": "Flagship High-Performance Octa-Core Processor",
      "screenSize": "6.7 inch High Refresh Rate OLED HDR Display",
      "cameraSpecs": "50MP Triple Studio Grade Matrix Camera",
      "network": "5G Dual SIM VoLTE Supported",
      "osVersion": "Certified Production Clean OS"
    }
  },
  {
    "id": "Fun-26069",
    "brand": "Realme",
    "model": "Realme 12 Pro+",
    "storage": "256GB",
    "colour": "Submarine Blue",
    "imei1": "357281902849188",
    "serialNumber": "SN26069",
    "sku": "TFD-26069-REA",
    "batteryHealth": 90,
    "grade": "A",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 21000,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 0,
      "logisticsCost": 350,
      "otherCost": 0,
      "totalLandedCost": 21600,
      "sellingPrice": 26999,
      "projectedProfit": 5399,
      "profitMarginPercent": 20
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80"
    ],
    "activityTimeline": [],
    "repairHistory": [],
    "specifications": {
      "chipset": "Flagship High-Performance Octa-Core Processor",
      "screenSize": "6.7 inch High Refresh Rate OLED HDR Display",
      "cameraSpecs": "50MP Triple Studio Grade Matrix Camera",
      "network": "5G Dual SIM VoLTE Supported",
      "osVersion": "Certified Production Clean OS"
    }
  },
  {
    "id": "Fun-26070",
    "brand": "Xiaomi",
    "model": "Redmi Note 13 Pro+",
    "storage": "256GB",
    "colour": "Fusion Purple",
    "imei1": "356920194820188",
    "serialNumber": "SN26070",
    "sku": "TFD-26070-RED",
    "batteryHealth": 90,
    "grade": "A",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 22000,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 0,
      "logisticsCost": 350,
      "otherCost": 0,
      "totalLandedCost": 22600,
      "sellingPrice": 27999,
      "projectedProfit": 5399,
      "profitMarginPercent": 19
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80"
    ],
    "activityTimeline": [],
    "repairHistory": [],
    "specifications": {
      "chipset": "Flagship High-Performance Octa-Core Processor",
      "screenSize": "6.7 inch High Refresh Rate OLED HDR Display",
      "cameraSpecs": "50MP Triple Studio Grade Matrix Camera",
      "network": "5G Dual SIM VoLTE Supported",
      "osVersion": "Certified Production Clean OS"
    }
  },
  {
    "id": "Fun-26071",
    "brand": "Motorola",
    "model": "Moto Edge 50 Pro",
    "storage": "256GB",
    "colour": "Black Beauty",
    "imei1": "355920194820188",
    "serialNumber": "SN26071",
    "sku": "TFD-26071-MOT",
    "batteryHealth": 90,
    "grade": "A",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 25000,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 0,
      "logisticsCost": 350,
      "otherCost": 0,
      "totalLandedCost": 25600,
      "sellingPrice": 31999,
      "projectedProfit": 6399,
      "profitMarginPercent": 20
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80"
    ],
    "activityTimeline": [],
    "repairHistory": [],
    "specifications": {
      "chipset": "Flagship High-Performance Octa-Core Processor",
      "screenSize": "6.7 inch High Refresh Rate OLED HDR Display",
      "cameraSpecs": "50MP Triple Studio Grade Matrix Camera",
      "network": "5G Dual SIM VoLTE Supported",
      "osVersion": "Certified Production Clean OS"
    }
  },
  {
    "id": "Fun-26072",
    "brand": "OnePlus",
    "model": "OnePlus 12",
    "storage": "256GB",
    "colour": "Flowy Emerald",
    "imei1": "357281902849102",
    "serialNumber": "SN26072",
    "sku": "TFD-26072-OP",
    "batteryHealth": 90,
    "grade": "A",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 42000,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 0,
      "logisticsCost": 350,
      "otherCost": 0,
      "totalLandedCost": 42600,
      "sellingPrice": 52000,
      "projectedProfit": 9400,
      "profitMarginPercent": 18
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bonaparte Corporation Private Limited",
    "purchaseDate": "2026-11-14",
    "images": [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80"
    ],
    "activityTimeline": [],
    "repairHistory": [],
    "specifications": {
      "chipset": "Flagship High-Performance Octa-Core Processor",
      "screenSize": "6.7 inch High Refresh Rate OLED HDR Display",
      "cameraSpecs": "50MP Triple Studio Grade Matrix Camera",
      "network": "5G Dual SIM VoLTE Supported",
      "osVersion": "Certified Production Clean OS"
    }
  },
  {
    "id": "Fun-26081",
    "brand": "Samsung",
    "model": "Samsung S25 Edge",
    "storage": "256GB",
    "ram": "12GB",
    "colour": "Black",
    "imei1": "354922133130580",
    "imei2": "",
    "serialNumber": "SN26081",
    "sku": "TFD-26081-SAM",
    "batteryHealth": 90,
    "grade": "A",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 54000,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 0,
      "logisticsCost": 350,
      "otherCost": 0,
      "totalLandedCost": 54600,
      "sellingPrice": 60000,
      "projectedProfit": 5400,
      "profitMarginPercent": 9
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bulk Refurb Solutions",
    "purchaseDate": "2026-11-19",
    "images": [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Snapdragon 8 Gen 4",
      "screenSize": "6.8 inch Dynamic AMOLED",
      "cameraSpecs": "200MP + 50MP + 12MP",
      "network": "5G Dual SIM",
      "osVersion": "One UI 7"
    },
    "activityTimeline": [],
    "repairHistory": []
  },
  {
    "id": "Fun-26082",
    "brand": "Apple",
    "model": "iPhone Air",
    "storage": "256GB",
    "ram": "8GB",
    "colour": "Sky Blue",
    "imei1": "358258287029542",
    "imei2": "",
    "serialNumber": "SN26082",
    "sku": "TFD-26082-APP",
    "batteryHealth": 96,
    "grade": "A+",
    "status": "In Stock",
    "warehouse": "Lucknow Store (LKO-01)",
    "costs": {
      "purchasePrice": 48000,
      "repairCost": 0,
      "testingCost": 250,
      "packagingCost": 0,
      "logisticsCost": 350,
      "otherCost": 0,
      "totalLandedCost": 48600,
      "sellingPrice": 59999,
      "projectedProfit": 11399,
      "profitMarginPercent": 19
    },
    "supplierId": "SUP-001",
    "supplierName": "Esterline Bulk Refurb Solutions",
    "purchaseDate": "2026-11-19",
    "images": [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80"
    ],
    "specifications": {
      "chipset": "Apple A19 Bionic",
      "screenSize": "6.6 inch Super Retina XDR",
      "cameraSpecs": "48MP Dual Fusion",
      "network": "5G eSIM",
      "osVersion": "iOS 19"
    },
    "activityTimeline": [],
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
    itemsCount: 75,
    devices: [
      { model: "Certified Refurbished Handsets Lot (75 Units)", imei: "356983557725459", grade: "A+", price: 35100 },
    ],
    totalAmount: 2632500,
    paymentStatus: "Paid",
    amountPaid: 2632500,
    balanceDue: 0,
    warehouse: "Lucknow Store (LKO-01)",
    invoiceNumber: "EST-LKO-2026-7501",
    notes: "Consignment lot of 75 certified refurbished premium handsets received at Lucknow Store (LKO-01). All units barcoded.",
  },
];

export const initialSales: SalesOrder[] = [
  {
    id: "TFD-FSO-2611-0001",
    orderNo: "TFD-FSO-2611-0001",
    channelOrderNo: "#FSO-LKO-2611-001",
    channel: "FSO",
    channelName: "Store Outlet",
    typeOfSale: "B2C",
    invoiceNumber: "INVLKO012611-0001",
    customerName: "Manish Singh",
    customerPhone: "+91 98390 12844",
    customerEmail: "manish.singh@gmail.com",
    customerAddress: "Vikas Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010",
    customerLocalAddress: "Vikas Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010",
    customerPermanentAddress: "Vikas Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010",
    customerAadhaar: "4829 1048 2910",
    customerGstin: "URP (Unregistered)",
    placeOfSupply: "Uttar Pradesh (09)",
    date: "2026-11-14",
    time: "10:30 am",
    deviceId: "Fun-26001",
    deviceModel: "Apple iPhone 15 Pro Max (256GB) Refurbished Natural Titanium",
    imei: "359078245961126",
    serialNumber: "SN26001",
    sellingPrice: 68000,
    discount: 0,
    taxAmount: 1830.51,
    finalAmount: 68000,
    purchasePrice: 56000,
    profitMargin: 12000,
    paymentMethod: "Google Pay",
    paymentTxnId: "T2611141030918291048291",
    paymentStatus: "Completed",
    deliveryStatus: "Delivered",
    warrantyMonths: 6,
    warrantyExpiry: "2027-05-14",
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
    customerEmail: "",
    customerAddress: "S/o Mohd Raqeeb Ulla, Chinhat, News Colony, Gomti nagar, Lucknow, Uttar Pradesh, 226028",
    customerLocalAddress: "S/o Mohd Raqeeb Ulla, Chinhat, News Colony, Gomti nagar, Lucknow, Uttar Pradesh, 226028",
    customerPermanentAddress: "S/o Mohd Raqeeb Ulla, Chinhat, News Colony, Gomti nagar, Lucknow, Uttar Pradesh, 226028",
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
  {
    id: "TFD-FSO-2611-0003",
    orderNo: "TFD-FSO-2611-0003",
    channelOrderNo: "#FSO-LKO-2611-003",
    channel: "FSO",
    channelName: "Store Outlet",
    typeOfSale: "B2C",
    invoiceNumber: "INVLKO012611-0003",
    customerName: "Manish Singh",
    customerPhone: "+91 98390 12844",
    customerEmail: "manish.singh@gmail.com",
    customerAddress: "Vikas Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010",
    customerLocalAddress: "Vikas Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010",
    customerPermanentAddress: "Vikas Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010",
    customerAadhaar: "4829 1048 2910",
    customerGstin: "URP (Unregistered)",
    placeOfSupply: "Uttar Pradesh (09)",
    date: "2026-11-19",
    time: "04:30 pm",
    deviceId: "Fun-26019",
    deviceModel: "Samsung Galaxy S24 Ultra (256GB) Refurbished Titanium Gray",
    imei: "352722661218255",
    serialNumber: "SN26019",
    sellingPrice: 66000,
    discount: 1500,
    taxAmount: 1906.78,
    finalAmount: 64500,
    purchasePrice: 52000,
    profitMargin: 12500,
    paymentMethod: "Split Payment",
    paymentTxnId: "POSLKO2611-0003 / GPAYLKO2611-0003",
    splitPayment: {
      mode1: "Card",
      method1: "Credit Card Swipe",
      amount1: 35000,
      txnId1: "POSLKO2611-0003",
      mode2: "UPI",
      method2: "Google Pay",
      amount2: 29500,
      txnId2: "GPAYLKO2611-0003",
    },
    paymentStatus: "Completed",
    deliveryStatus: "Delivered",
    warrantyMonths: 6,
    warrantyExpiry: "2027-05-19",
    storeName: "Lucknow Store B-124 (LKO-01)",
    storeCode: "LKO-01",
  },
  {
    id: "TFD-FSO-2611-0004",
    orderNo: "TFD-FSO-2611-0004",
    channelOrderNo: "#FSO-LKO-2611-004",
    channel: "FSO",
    channelName: "Store Outlet",
    typeOfSale: "B2C",
    invoiceNumber: "INVLKO012611-0004",
    customerName: "Vikas Singh",
    customerPhone: "+91 98104 77291",
    customerEmail: "vikas.singh@outlook.com",
    customerAddress: "Indira Nagar, Lucknow, Uttar Pradesh 226016",
    customerLocalAddress: "Indira Nagar, Lucknow, Uttar Pradesh 226016",
    customerPermanentAddress: "Indira Nagar, Lucknow, Uttar Pradesh 226016",
    customerAadhaar: "7391 0284 9182",
    customerGstin: "URP (Unregistered)",
    placeOfSupply: "Uttar Pradesh (09)",
    date: "2026-11-20",
    time: "10:15 am",
    deviceId: "Fun-26027",
    deviceModel: "OnePlus 12 (256GB) Refurbished Silky Black",
    imei: "861928401928401",
    serialNumber: "SN26027",
    sellingPrice: 52999,
    discount: 1000,
    taxAmount: 1220.19,
    finalAmount: 51999,
    purchasePrice: 44000,
    profitMargin: 7999,
    paymentMethod: "UPI",
    paymentTxnId: "UPI261120101598104772",
    paymentStatus: "Completed",
    deliveryStatus: "Delivered",
    warrantyMonths: 6,
    warrantyExpiry: "2027-05-20",
    storeName: "Lucknow Store B-124 (LKO-01)",
    storeCode: "LKO-01",
  },
];

export const initialStockMovements: StockMovement[] = [
  {
    id: "MOV-401",
    date: "2026-11-14 10:30",
    type: "Outward",
    reason: "Sold",
    deviceId: "Fun-26001",
    deviceModel: "Apple iPhone 15 Pro Max (256GB) Refurbished Natural Titanium",
    imei: "359078245961126",
    fromLocation: "Lucknow Store B-124 (LKO-01)",
    toLocation: "Customer (Manish Singh)",
    quantity: 1,
    value: 68000,
    initiatedBy: "Sales Engine",
    notes: "Tax Invoice INVLKO012611-0001 dispatch",
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
    date: "2026-11-19 16:30",
    type: "Outward",
    reason: "Sold",
    deviceId: "Fun-26019",
    deviceModel: "Samsung Galaxy S24 Ultra (256GB) Refurbished Titanium Gray",
    imei: "352722661218255",
    fromLocation: "Lucknow Store B-124 (LKO-01)",
    toLocation: "Customer (Manish Singh)",
    quantity: 1,
    value: 64500,
    initiatedBy: "Sales Engine",
    notes: "Tax Invoice INVLKO012611-0003 dispatch",
  },
  {
    id: "MOV-404",
    date: "2026-11-20 10:15",
    type: "Outward",
    reason: "Sold",
    deviceId: "Fun-26027",
    deviceModel: "OnePlus 12 (256GB) Refurbished Silky Black",
    imei: "861928401928401",
    fromLocation: "Lucknow Store B-124 (LKO-01)",
    toLocation: "Customer (Vikas Singh)",
    quantity: 1,
    value: 51999,
    initiatedBy: "Sales Engine",
    notes: "Tax Invoice INVLKO012611-0004 dispatch",
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

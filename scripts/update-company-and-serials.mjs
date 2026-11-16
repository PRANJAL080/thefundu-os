import fs from 'fs';
import path from 'path';

const projectDir = 'C:/Users/asus/.gemini/antigravity/scratch/thefundu-inventory-os';
const parsedPath = path.join(projectDir, 'parsed_inventory.json');
const mockDataPath = path.join(projectDir, 'src/lib/mock-data.ts');

const parsedDevices = JSON.parse(fs.readFileSync(parsedPath, 'utf8'));

// Format device serials cleanly in sequence: SN26000, SN26001, etc.
const updatedDevices = parsedDevices.map((d, idx) => {
  const isApple = d.brand === 'Apple';
  const serialNo = `SN${26000 + idx}`;
  
  // Clean model name
  let modelName = d.model;
  if (modelName.toLowerCase().startsWith('iphone')) {
    modelName = modelName.replace(/^[iI][pP]hone/i, 'iPhone');
  } else if (modelName.toLowerCase().startsWith('samsung galaxy')) {
    modelName = modelName.replace(/samsung galaxy\s*/i, 'Galaxy ');
  }

  return {
    id: `Fun-${26000 + idx}`,
    brand: d.brand,
    model: modelName,
    storage: d.storage,
    colour: d.colour,
    imei1: d.imei1,
    imei2: d.imei2 || '',
    serialNumber: serialNo,
    sku: `TFD-${26000 + idx}-${(d.brand || 'PHN').substring(0, 3).toUpperCase()}`,
    ...(isApple ? { batteryHealth: d.batteryHealth || 90 } : {}),
    status: d.status || 'In Stock',
    warehouse: 'Lucknow Store (LKO-01)',
    costs: d.costs,
    supplierId: d.supplierId || 'SUP-001',
    supplierName: 'Esterline Bonaparte Corporation Private Limited',
    purchaseDate: d.purchaseDate || '2026-11-01',
    images: d.images || [],
    specifications: d.specifications || {
      chipset: isApple ? 'Apple Bionic / A-Series' : 'Qualcomm Snapdragon / MediaTek 5G',
      screenSize: '6.1" - 6.8" High Refresh Display',
      cameraSpecs: 'Certified Dual / Triple Camera system',
      network: '5G VoLTE Dual SIM / eSIM',
      osVersion: isApple ? 'iOS 18.2' : 'Android 14/15'
    },
    activityTimeline: d.activityTimeline || [],
    repairHistory: d.repairHistory || []
  };
});

fs.writeFileSync(parsedPath, JSON.stringify(updatedDevices, null, 2), 'utf8');
console.log(`Updated parsed_inventory.json with sequential serials (SN26000 to SN26063).`);

// Systematic Sales Orders with Channel Codes & Types of Sale
const systematicSales = [
  {
    id: "TFD-FSO-2611-0001",
    orderNo: "TFD-FSO-2611-0001",
    channelOrderNo: "#FSO-LKO-2611-001",
    channel: "FSO",
    channelName: "Store Outlet (FSO)",
    typeOfSale: "B2C",
    customerName: "Aakash Varma",
    customerPhone: "+91 98920 11928",
    customerEmail: "aakash.varma@gmail.com",
    customerAddress: "Riverside Plaza, Gomti Nagar, Lucknow, Uttar Pradesh 226010",
    customerGstin: "URP (Unregistered)",
    placeOfSupply: "Uttar Pradesh (09)",
    date: "2026-11-04",
    deviceId: "Fun-26019",
    deviceModel: "Samsung Galaxy S24 Ultra (256GB) - Grey",
    imei: "352722661210255",
    serialNumber: "SN26019",
    sellingPrice: 66000,
    discount: 1500,
    taxAmount: 9838,
    finalAmount: 64500,
    paymentMethod: "UPI",
    paymentStatus: "Completed",
    deliveryStatus: "Delivered",
    trackingNumber: "TFD-FSO-8991823",
    warrantyMonths: 6,
    warrantyExpiry: "2027-05-04",
    invoiceNumber: "INVLKO2611-0001"
  },
  {
    id: "TFD-ONS-2611-0002",
    orderNo: "TFD-ONS-2611-0002",
    channelOrderNo: "#ONS-LKO-2611-002",
    channel: "ONS",
    channelName: "Online Store (ONS)",
    typeOfSale: "B2C",
    customerName: "Gaurav Malhotra",
    customerPhone: "+91 99011 34509",
    customerEmail: "gaurav.m@techcorp.io",
    customerAddress: "Sector 14, Indira Nagar, Lucknow, Uttar Pradesh 226016",
    customerGstin: "URP (Unregistered)",
    placeOfSupply: "Uttar Pradesh (09)",
    date: "2026-11-10",
    deviceId: "Fun-26004",
    deviceModel: "Apple iPhone 15 Pro Max (256GB) - White",
    imei: "356642157403535",
    serialNumber: "SN26004",
    sellingPrice: 73000,
    discount: 2000,
    taxAmount: 10830,
    finalAmount: 71000,
    paymentMethod: "EMI",
    emiPlan: {
      months: 6,
      monthlyEmi: 11833,
      financier: "HDFC EasyEMI No-Cost",
      status: "Active",
    },
    paymentStatus: "Completed",
    deliveryStatus: "Shipped",
    trackingNumber: "TFD-ONS-99210",
    warrantyMonths: 6,
    warrantyExpiry: "2027-05-10",
    invoiceNumber: "INVLKO2611-0002"
  },
  {
    id: "TFD-FOR-2611-0003",
    orderNo: "TFD-FOR-2611-0003",
    channelOrderNo: "#FOR-LKO-2611-003",
    channel: "FOR",
    channelName: "Repair Service (FOR)",
    typeOfSale: "B2C",
    customerName: "Sneha Kulkarni",
    customerPhone: "+91 97650 88219",
    customerEmail: "sneha.k@rediffmail.com",
    customerAddress: "ED-476, Sector-Q, Aliganj, Lucknow, Uttar Pradesh 226024",
    customerGstin: "URP (Unregistered)",
    placeOfSupply: "Uttar Pradesh (09)",
    date: "2026-11-08",
    deviceId: "Fun-26000",
    deviceModel: "Apple iPhone 12 mini (64GB) - Blue",
    imei: "355997875777052",
    serialNumber: "SN26000",
    sellingPrice: 18000,
    discount: 500,
    taxAmount: 2670,
    finalAmount: 17500,
    paymentMethod: "Card",
    paymentStatus: "Completed",
    deliveryStatus: "Delivered",
    trackingNumber: "TFD-FOR-11204",
    warrantyMonths: 6,
    warrantyExpiry: "2027-05-08",
    invoiceNumber: "INVLKO2611-0003"
  },
  {
    id: "TFD-DS-2611-0004",
    orderNo: "TFD-DS-2611-0004",
    channelOrderNo: "#DS-LKO-2611-004",
    channel: "DS",
    channelName: "Doorstep Direct (DS)",
    typeOfSale: "B2C",
    customerName: "Roshni Sen",
    customerPhone: "+91 98104 77291",
    customerEmail: "roshni.sen@outlook.com",
    customerAddress: "Mahanagar Extension, Lucknow, Uttar Pradesh 226006",
    customerGstin: "URP (Unregistered)",
    placeOfSupply: "Uttar Pradesh (09)",
    date: "2026-11-13",
    deviceId: "Fun-26027",
    deviceModel: "OnePlus 12 (256GB) - Silky Black",
    imei: "861928401928401",
    serialNumber: "SN26027",
    sellingPrice: 52999,
    discount: 1000,
    taxAmount: 7937,
    finalAmount: 51999,
    paymentMethod: "UPI",
    paymentStatus: "Completed",
    deliveryStatus: "Packed",
    trackingNumber: "TFD-DS-3391",
    warrantyMonths: 6,
    warrantyExpiry: "2027-05-13",
    invoiceNumber: "INVLKO2611-0004"
  }
];

// Now update mock-data.ts with updatedDevices and systematicSales
let content = fs.readFileSync(mockDataPath, 'utf8');

// Replace initialDevices
const exportDevHeader = 'export const initialDevices: Device[] = ';
const devStart = content.indexOf(exportDevHeader);
const devEnd = content.indexOf('export const initialPurchases', devStart);
if (devStart !== -1 && devEnd !== -1) {
  content = content.slice(0, devStart + exportDevHeader.length) + 
    JSON.stringify(updatedDevices, null, 2) + ';\n\n' + 
    content.slice(devEnd);
  console.log(`Replaced initialDevices in mock-data.ts.`);
}

// Replace initialSales
const exportSalesHeader = 'export const initialSales: SalesOrder[] = ';
const salesStart = content.indexOf(exportSalesHeader);
const salesEnd = content.indexOf('export const initialStockMovements', salesStart);
if (salesStart !== -1 && salesEnd !== -1) {
  content = content.slice(0, salesStart + exportSalesHeader.length) + 
    JSON.stringify(systematicSales, null, 2) + ';\n\n' + 
    content.slice(salesEnd);
  console.log(`Replaced initialSales in mock-data.ts.`);
}

fs.writeFileSync(mockDataPath, content, 'utf8');
console.log('Successfully updated mock-data.ts with systematic sales and serial numbers!');

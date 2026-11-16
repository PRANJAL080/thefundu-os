import fs from 'fs';
import path from 'path';

const projectDir = 'C:/Users/asus/.gemini/antigravity/scratch/thefundu-inventory-os';
const parsedPath = path.join(projectDir, 'parsed_inventory.json');
const mockDataPath = path.join(projectDir, 'src/lib/mock-data.ts');

const parsedDevices = JSON.parse(fs.readFileSync(parsedPath, 'utf8'));

// Format device cleanly
const cleanDevices = parsedDevices.map(d => {
  const isApple = d.brand === 'Apple';
  
  // Model name polish
  let modelName = d.model;
  if (modelName.toLowerCase().startsWith('iphone')) {
    modelName = modelName.replace(/^[iI][pP]hone/i, 'iPhone');
  } else if (modelName.toLowerCase().startsWith('samsung galaxy')) {
    modelName = modelName.replace(/samsung galaxy\s*/i, 'Galaxy ');
  }

  const device = {
    id: d.id,
    brand: d.brand,
    model: modelName,
    storage: d.storage,
    colour: d.colour,
    imei1: d.imei1,
    imei2: d.imei2 || '',
    serialNumber: d.serialNumber,
    sku: d.sku,
    ...(isApple ? { batteryHealth: d.batteryHealth || 90 } : {}),
    grade: d.grade || 'A',
    status: d.status,
    warehouse: 'Lucknow Store (LKO-01)',
    costs: d.costs,
    supplierId: d.supplierId || 'SUP-001',
    supplierName: d.supplierName || 'Esterline Bulk Refurb Solutions',
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

  return device;
});

console.log(`Prepared ${cleanDevices.length} clean devices.`);
const appleCount = cleanDevices.filter(d => d.brand === 'Apple').length;
const nonAppleCount = cleanDevices.length - appleCount;
console.log(`Apple: ${appleCount}, Non-Apple: ${nonAppleCount}`);

// Now read mock-data.ts and replace initialDevices
let mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

const exportHeader = 'export const initialDevices: Device[] = ';
const startIndex = mockDataContent.indexOf(exportHeader);
if (startIndex === -1) {
  console.error('Could not find initialDevices in mock-data.ts');
  process.exit(1);
}

const afterIndex = mockDataContent.indexOf('export const initialPurchases', startIndex);
if (afterIndex === -1) {
  console.error('Could not find initialPurchases after initialDevices');
  process.exit(1);
}

const newDevicesString = JSON.stringify(cleanDevices, null, 2) + ';\n\n';
const updatedMockData = mockDataContent.slice(0, startIndex + exportHeader.length) + newDevicesString + mockDataContent.slice(afterIndex);

fs.writeFileSync(mockDataPath, updatedMockData, 'utf8');
console.log('Successfully updated initialDevices in src/lib/mock-data.ts!');

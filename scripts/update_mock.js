const fs = require('fs');

const parsedDevices = JSON.parse(fs.readFileSync('C:/Users/asus/.gemini/antigravity/scratch/thefundu-inventory-os/parsed_inventory.json', 'utf8'));

const existingMockData = fs.readFileSync('C:/Users/asus/.gemini/antigravity/scratch/thefundu-inventory-os/src/lib/mock-data.ts', 'utf8');

// Find everything before "export const initialDevices: Device[] = ["
const beforeDevices = existingMockData.substring(0, existingMockData.indexOf('export const initialDevices: Device[] = ['));

// Find everything from "export const initialPurchases: PurchaseOrder[] = [" onwards
const afterDevices = existingMockData.substring(existingMockData.indexOf('export const initialPurchases: PurchaseOrder[] = ['));

const newContent = `${beforeDevices}export const initialDevices: Device[] = ${JSON.stringify(parsedDevices, null, 2)};\n\n${afterDevices}`;

fs.writeFileSync('C:/Users/asus/.gemini/antigravity/scratch/thefundu-inventory-os/src/lib/mock-data.ts', newContent);
console.log('Updated mock-data.ts with all 64 real inventory items!');

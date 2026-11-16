/**
 * Transform mock-data.ts:
 * 1. Convert all inventory devices strictly to Apple iPhones.
 * 2. Set all handset warehouses to "Lucknow Store (LKO-01)".
 * 3. Update initialWarehouses to Lucknow Store (Code: LKO-01).
 */

import fs from "fs";
import path from "path";

const filePath = path.resolve("./src/lib/mock-data.ts");
let content = fs.readFileSync(filePath, "utf-8");

// 1. Replace initialWarehouses
const newWarehousesStr = `export const initialWarehouses: Warehouse[] = [
  {
    id: "STR-LKO-01",
    name: "Lucknow Store (LKO-01)",
    code: "LKO-01",
    city: "Lucknow",
    location: "Gomti Nagar, Lucknow",
    address: "Riverside Plaza, Gomti Nagar, Lucknow, Uttar Pradesh 226010",
    managerName: "Abhay Verma",
    managerPhone: "+91 79919 90508",
    totalCapacity: 2000,
    currentStockUnits: 64,
    totalStockValue: 3450000,
    underRepairUnits: 2,
    qcPendingUnits: 5,
    status: "Active",
  },
];`;

content = content.replace(/export const initialWarehouses: Warehouse\[] = \[[\s\S]*?\n\];/, newWarehousesStr);

// 2. Extract initialDevices
const match = content.match(/export const initialDevices: Device\[] = (\[[\s\S]*?\n\];)/);
if (!match) {
  console.error("Could not find initialDevices");
  process.exit(1);
}

const rawDevices = eval(match[1].replace(/;$/, ""));

// Replacement Apple models pool for any non-Apple phones
const appleReplacements = [
  { model: "iPhone 16 Pro Max", storage: "256GB", colour: "Desert Titanium", img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80" },
  { model: "iPhone 16 Pro", storage: "128GB", colour: "Natural Titanium", img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80" },
  { model: "iPhone 16", storage: "128GB", colour: "Ultramarine Blue", img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80" },
  { model: "iPhone 15 Pro Max", storage: "256GB", colour: "Black Titanium", img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80" },
  { model: "iPhone 15 Pro", storage: "128GB", colour: "Blue Titanium", img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80" },
  { model: "iPhone 15 Plus", storage: "128GB", colour: "Pink", img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80" },
  { model: "iPhone 15", storage: "128GB", colour: "Green", img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80" },
  { model: "iPhone 14 Pro Max", storage: "256GB", colour: "Deep Purple", img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80" },
  { model: "iPhone 14 Pro", storage: "128GB", colour: "Space Black", img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80" },
  { model: "iPhone 14 Plus", storage: "128GB", colour: "Starlight", img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80" },
  { model: "iPhone 14", storage: "128GB", colour: "Midnight", img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80" },
  { model: "iPhone 13 Pro Max", storage: "256GB", colour: "Sierra Blue", img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80" },
  { model: "iPhone 13 Pro", storage: "128GB", colour: "Graphite", img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80" },
  { model: "iPhone 13", storage: "128GB", colour: "Starlight", img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80" },
  { model: "iPhone 13 mini", storage: "128GB", colour: "Midnight", img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80" },
  { model: "iPhone 12 Pro Max", storage: "128GB", colour: "Pacific Blue", img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80" },
  { model: "iPhone 12 Pro", storage: "128GB", colour: "Gold", img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80" },
  { model: "iPhone 12", storage: "64GB", colour: "Black", img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80" },
  { model: "iPhone 12 mini", storage: "64GB", colour: "White", img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80" },
  { model: "iPhone 11 Pro", storage: "64GB", colour: "Midnight Green", img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80" },
  { model: "iPhone 11", storage: "64GB", colour: "Purple", img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80" },
];

let repIdx = 0;
const updatedDevices = rawDevices.map((dev) => {
  let isApple = dev.brand === "Apple";
  let brand = "Apple";
  let model = dev.model;
  let storage = dev.storage;
  let colour = dev.colour;
  let images = dev.images;

  if (!isApple) {
    const repl = appleReplacements[repIdx % appleReplacements.length];
    repIdx++;
    model = repl.model;
    storage = repl.storage;
    colour = repl.colour;
    images = [repl.img];
  } else {
    // Clean up casing (e.g. "IPhone 15 pro max" -> "iPhone 15 Pro Max")
    model = model.replace(/^IPhone/i, "iPhone").replace(/\bpro\b/g, "Pro").replace(/\bmax\b/g, "Max");
  }

  return {
    ...dev,
    brand: "Apple",
    model,
    storage,
    colour,
    warehouse: "Lucknow Store (LKO-01)",
    images,
    specifications: {
      chipset: "Apple Bionic A-Series / Neural Engine",
      screenSize: '6.1" - 6.7" Super Retina XDR OLED',
      cameraSpecs: "Pro / Dual Camera System with Photonic Engine",
      network: "5G Sub-6GHz Dual SIM (nano-SIM + eSIM)",
      osVersion: "iOS 18.2",
    },
  };
});

const updatedDevicesStr = `export const initialDevices: Device[] = ${JSON.stringify(updatedDevices, null, 2)};`;
content = content.replace(/export const initialDevices: Device\[] = \[[\s\S]*?\n\];/, updatedDevicesStr);

fs.writeFileSync(filePath, content, "utf-8");
console.log(`Successfully updated mock-data.ts! Total devices: ${updatedDevices.length}, all Apple iPhones assigned to Lucknow Store (LKO-01).`);

const fs = require('fs');

const rawRows = [
  { id: "Fun-26000", imei: "355997875777052 , 355997875825208", model: "iPhone 12 mini (blue)", storage: "64 gb", price: 18000 },
  { id: "Fun-26001", imei: "355319540975419 ., 355319540921025", model: "iPhone 15 pro max (blue)", storage: "256 gb", price: 70000 },
  { id: "Fun-26002", imei: "354064853721668 , 354064852239146", model: "14 pro max (blue)", storage: "256 gb", price: 55000 },
  { id: "Fun-26003", imei: "352958414012677", model: "iPhone 16 PINK", storage: "128 gb", price: 60000 },
  { id: "Fun-26004", imei: "356642157403535", model: "iPHONE 15 PRO MAX (WHITE)", storage: "256 GB", price: 73000 },
  { id: "Fun-26005", imei: "357879430485082", model: "14 pro max (purple)", storage: "1tb", price: 55000 },
  { id: "Fun-26006", imei: "357597632009589", model: "15 Pro (white)", storage: "256 gb", price: 68000 },
  { id: "Fun-26007", imei: "353943233721616", model: "14 pro (purple)", storage: "256 gb", price: 55000 },
  { id: "Fun-26008", imei: "356444800044612", model: "15 pro (grey)", storage: "128 gb", price: 65000 },
  { id: "Fun-26009", imei: "354928109820194", model: "13 (blue)", storage: "128 gb", price: 29000 },
  { id: "Fun-26010", imei: "354935415832459", model: "16 pro ( grey)", storage: "256 gb", price: 78000 },
  { id: "Fun-26011", imei: "356696727120920", model: "12 pro (baby pink)", storage: "128 gb", price: 30000 },
  { id: "Fun-26012", imei: "357043230995515", model: "16 (green)", storage: "128 gb", price: 60000 },
  { id: "Fun-26013", imei: "350717767996825", model: "16 pro (off white)", storage: "128 gb", price: 75000 },
  { id: "Fun-26014", imei: "350879909438510", model: "13 pro max (white)", storage: "128 gb", price: 40000 },
  { id: "Fun-26015", imei: "355820716179553", model: "15 (black)", storage: "128 gb", price: 50000 },
  { id: "Fun-26016", imei: "356661402930183", model: "17 pro (orange)", storage: "256 gb", price: 110000 },
  { id: "Fun-26017", imei: "353459391469559", model: "15 pro ( grey)", storage: "256 gb", price: 65000 },
  { id: "Fun-26018", imei: "353377521202302", model: "14+ (dark blue)", storage: "128 gb", price: 38000 },
  { id: "Fun-26019", imei: "352722661210255", model: "samsung galaxy 24 ultra (grey)", storage: "256 /12", price: 66000 },
  { id: "Fun-26020", imei: "351005194138941", model: "samsung galaxy s23 fe ( green)", storage: "128/8", price: 30000 },
  { id: "Fun-26021", imei: "352808100961234", model: "samsung galaxy s10e (grey)", storage: "128 gb", price: 12000 },
  { id: "Fun-26022", imei: "353578850761279", model: "samsung galaxy s24 ultra (golden)", storage: "512 gb /12", price: 70000 },
  { id: "Fun-26023", imei: "353992851703133", model: "samsung galaxy s23 ultra (black)", storage: "512/12", price: 52000 },
  { id: "Fun-26024", imei: "356300332281603", model: "samsung galaxy a56 5g (light green/sea green)", storage: "256/12", price: 35000 },
  { id: "Fun-26025", imei: "353835882416094", model: "samsung galaxy s23 ultra (black)", storage: "256/12", price: 48000 },
  { id: "Fun-26026", imei: "353835882416095", model: "samsung galaxy a07 (silver purple)", storage: "64/4", price: 9000 },
  { id: "Fun-26027", imei: "352271450924668", model: "samsung galaxy z fold 5 (off white)", storage: "512/12", price: 58000 },
  { id: "Fun-26028", imei: "351379490556548", model: "samsung galaxy z fold 6 (pink)", storage: "256/12", price: 70000 },
  { id: "Fun-26029", imei: "351005191215247", model: "Samsung Galaxy 23 fe (orange)", storage: "128/8", price: 31000 },
  { id: "Fun-26030", imei: "863995079682917", model: "Oneplus nord 5 (blue) 10 days old", storage: "256/8", price: 37000 },
  { id: "Fun-26031", imei: "869796042087034", model: "Oneplus 8 (blue)", storage: "128", price: 18000 },
  { id: "Fun-26032", imei: "868368053231199", model: "Oneplus 10 pro 5g (black)", storage: "256", price: 28000 },
  { id: "Fun-26033", imei: "352532337308015", model: "Motorola g8 5g (green)", storage: "128/8", price: 17000 },
  { id: "Fun-26034", imei: "357807166012077", model: "Motorola g62 5g (blue)", storage: "128 gb", price: 11000 },
  { id: "Fun-26035", imei: "866276083086859", model: "Realme C83 5G (black)", storage: "128/6", price: 16000 },
  { id: "Fun-26036", imei: "861888066729878", model: "Realme 12 pro 5G (dark blue)", storage: "256/8", price: 17000 },
  { id: "Fun-26037", imei: "357611735734470", model: "Motorola Edge 40 (black)", storage: "256", price: 17000 },
  { id: "Fun-26038", imei: "862531055496351", model: "poco x4 pro 5g (blue)", storage: "128 gb", price: 15000 },
  { id: "Fun-26039", imei: "359892181623429", model: "Google Pixel 9A (purple)", storage: "256 gb", price: 37000 },
  { id: "Fun-26040", imei: "357481895108463", model: "Google Pixel 8", storage: "128 gb", price: 25000 },
  { id: "Fun-26041", imei: "860825059738715", model: "Redmi 11 prime 5g (black)", storage: "128 gb", price: 11000 },
  { id: "Fun-26042", imei: "861130083750250", model: "Vivo v70 fe (blue)", storage: "256", price: 47000 },
  { id: "Fun-26043", imei: "867203075513251", model: "Oppo K13 5g (dark grey)", storage: "128", price: 11000 },
  { id: "Fun-26044", imei: "352691622226447", model: "iphone 15 (white)", storage: "256gb", price: 50000 },
  { id: "Fun-26045", imei: "359757422350951", model: "iphone 15 (white)", storage: "128gb", price: 45000 },
  { id: "Fun-26046", imei: "355002400218829", model: "iphone15 pro (grey)", storage: "128 gb", price: 63000 },
  { id: "Fun-26047", imei: "865186079119377", model: "vivo V50e (purple)", storage: "256 /8", price: 26000 },
  { id: "Fun-26048", imei: "350835850946471", model: "Moto G54 5g(black)", storage: "128/8", price: 11000 },
  { id: "Fun-26049", imei: "356903557725459", model: "iphone 14 pro (white)", storage: "128gb", price: 45000 },
  { id: "Fun-26050", imei: "353835883434245", model: "Samsung S23 Ultra ( olive green )", storage: "256 gb", price: 53000 },
  { id: "Fun-26051", imei: "350110763563296", model: "iphone 15 plus (white)", storage: "128 gb", price: 55000 },
  { id: "Fun-26052", imei: "867276071326696", model: "Oppo A5X 5g (Dark grey)", storage: "128gb", price: 13500 },
  { id: "Fun-26053", imei: "860235087243219", model: "Vivo t5 pro 5g (light blue)", storage: "256gb/8+8", price: 37000 },
  { id: "Fun-26054", imei: "861084050921719", model: "Realme Narzo 50 pro 5g (blue)", storage: "128/6", price: 15000 },
  { id: "Fun-26055", imei: "869198055527792", model: "Poco M4 5g (black)", storage: "64", price: 11000 },
  { id: "Fun-26056", imei: "865758073065754", model: "Realme P3x 5g (Peach color)", storage: "128/8", price: 13500 },
  { id: "Fun-26057", imei: "350145990929795", model: "Samsung galaxy F14 5g (purple)", storage: "128gb", price: 12000 },
  { id: "Fun-26058", imei: "350487770140585", model: "Samsung S24 FE (dark grey)", storage: "128/8", price: 32000 },
  { id: "Fun-26059", imei: "359695533663039", model: "Samsung galaxy a07 5g (purple)", storage: "128/4", price: 13500 },
  { id: "Fun-26060", imei: "868526067064191", model: "vivo 14 funtouch OS (blue)", storage: "128/8", price: 15000 },
  { id: "Fun-26061", imei: "869958077174083", model: "Xiaomi Redmi note 14 5g (white)", storage: "128/6", price: 17500 },
  { id: "Fun-26062", imei: "358780490491292", model: "Samsung Ultra 26 Waranty April 2027", storage: "258", price: 105000 },
  { id: "Fun-26063", imei: "353920104147170", model: "IPhone 11ProMax", storage: "64", price: 23000 }
];

const warehouses = [
  "Mumbai Central Hub",
  "Delhi NCR Depot",
  "Bengaluru Tech Park",
  "Hyderabad Logistics"
];

function extractBrand(modelStr) {
  const m = modelStr.toLowerCase();
  if (m.includes("iphone") || m.includes("14 pro") || m.includes("15 pro") || m.includes("16 pro") || m.includes("17 pro") || m.includes("14+") || m.includes("13") || m.includes("12") || m.includes("16 (") || m.includes("15 (")) return "Apple";
  if (m.includes("samsung")) return "Samsung";
  if (m.includes("oneplus")) return "OnePlus";
  if (m.includes("motorola") || m.includes("moto")) return "Motorola";
  if (m.includes("realme")) return "Realme";
  if (m.includes("google") || m.includes("pixel")) return "Google";
  if (m.includes("vivo")) return "Vivo";
  if (m.includes("oppo")) return "Oppo";
  if (m.includes("poco")) return "Poco";
  if (m.includes("redmi") || m.includes("xiaomi")) return "Xiaomi";
  return "Apple";
}

function cleanModel(modelStr, brand) {
  let res = modelStr.replace(/\(.*?\)/g, "").trim();
  res = res.replace(/10 days old/gi, "").trim();
  res = res.replace(/Waranty April 2027/gi, "").trim();
  if (brand === "Apple" && !res.toLowerCase().includes("iphone")) {
    res = "iPhone " + res;
  }
  return res.charAt(0).toUpperCase() + res.slice(1);
}

function extractColour(modelStr) {
  const match = modelStr.match(/\((.*?)\)/);
  if (match) {
    return match[1].replace(/10 days old/gi, "").trim();
  }
  return "Default Edition";
}

const parsedDevices = rawRows.map((r, idx) => {
  const brand = extractBrand(r.model);
  const cleanM = cleanModel(r.model, brand);
  const colour = extractColour(r.model);

  // IMEI split
  const imeiParts = r.imei.split(/[,.]+/).map(s => s.trim().replace(/[^0-9]/g, '')).filter(Boolean);
  const imei1 = imeiParts[0] || ("35" + Math.floor(1000000000000 + Math.random() * 9000000000000));
  const imei2 = imeiParts[1] || "";

  const sellingPrice = r.price;
  const purchasePrice = Math.round(sellingPrice * 0.78);
  const repairCost = idx % 5 === 0 ? 1800 : idx % 7 === 0 ? 3200 : 0;
  const testingCost = 500;
  const packagingCost = 400;
  const logisticsCost = 500;
  const otherCost = 200;
  const totalLandedCost = purchasePrice + repairCost + testingCost + packagingCost + logisticsCost + otherCost;
  const projectedProfit = sellingPrice - totalLandedCost;
  const profitMarginPercent = Number(((projectedProfit / sellingPrice) * 100).toFixed(1));

  const grades = ["A+", "A", "A", "A+", "B", "A", "B", "C"];
  const grade = idx === 17 ? "A+" : grades[idx % grades.length];

  const statuses = ["In Stock", "Ready for Sale", "In Stock", "Ready for Sale", "QC Pending", "Under Repair", "Reserved"];
  const status = repairCost > 0 ? "Under Repair" : statuses[idx % statuses.length];

  const warehouse = warehouses[idx % warehouses.length];

  const batteryHealth = 82 + ((idx * 3) % 18);

  const imagesByBrand = {
    Apple: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
    Samsung: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80",
    OnePlus: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=600&q=80",
    Google: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
    Motorola: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80",
    Vivo: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
    Oppo: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80",
    Realme: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
    Poco: "https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?auto=format&fit=crop&w=600&q=80",
    Xiaomi: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
  };

  const image = imagesByBrand[brand] || imagesByBrand.Apple;

  return {
    id: r.id,
    brand,
    model: cleanM,
    storage: r.storage.toUpperCase().replace(/\s+/g, ""),
    colour: colour.charAt(0).toUpperCase() + colour.slice(1),
    imei1,
    imei2,
    serialNumber: "SN" + imei1.slice(-7),
    sku: `${brand.slice(0, 3).toUpperCase()}-${r.id}-${r.storage.replace(/[^0-9]/g, '')}`,
    batteryHealth,
    grade,
    status,
    warehouse,
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
      profitMarginPercent
    },
    supplierId: "SUP-001",
    supplierName: "Esterline Bulk Refurb Solutions",
    purchaseDate: "2026-11-" + String((idx % 14) + 1).padStart(2, '0'),
    images: [image],
    specifications: {
      chipset: brand === "Apple" ? "Apple Bionic / A-Series" : "Qualcomm Snapdragon / MediaTek 5G",
      screenSize: '6.1" - 6.8" High Refresh Display',
      cameraSpecs: "Certified Dual / Triple Camera system",
      network: "5G VoLTE Dual SIM / eSIM",
      osVersion: brand === "Apple" ? "iOS 18" : "Android 14/15"
    },
    activityTimeline: [
      {
        id: `ACT-${idx}-1`,
        timestamp: `2026-11-${String((idx % 14) + 1).padStart(2, '0')} 11:30`,
        user: "Intake Lead (Vikram Singhania)",
        action: "Inward Intake Verified",
        details: `Logged from consignor batch. Assigned Order ID ${r.id}. IMEI verified.`
      }
    ],
    repairHistory: repairCost > 0 ? [
      {
        id: `REP-${8800 + idx}`,
        deviceId: r.id,
        deviceModel: `${brand} ${cleanM}`,
        imei: imei1,
        technicianName: "Karan Johar (Senior Engineer)",
        problemDescription: "Standard refurb touch display / battery calibration",
        partsReplaced: ["OEM Calibration Cell"],
        repairCost,
        status: "In Progress",
        startDate: "2026-11-10",
        beforeImages: [],
        afterImages: []
      }
    ] : []
  };
});

fs.writeFileSync('C:/Users/asus/.gemini/antigravity/scratch/thefundu-inventory-os/parsed_inventory.json', JSON.stringify(parsedDevices, null, 2));
console.log('Successfully parsed ' + parsedDevices.length + ' real inventory records!');

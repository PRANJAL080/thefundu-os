import { Device, SalesOrder, PurchaseOrder, BuybackRecord, Warehouse } from "./types";
import { formatINR, matchesDeviceSearch } from "./utils";

export interface AiCopilotResponse {
  query: string;
  answerHindi: string;
  spokenHindi: string;
  devices: Device[];
  stats?: { label: string; value: string; color?: string }[];
  navigation?: { label: string; href: string };
  actionSuggestion?: string;
}

interface StoreContext {
  devices: Device[];
  sales: SalesOrder[];
  purchases: PurchaseOrder[];
  buybacks: BuybackRecord[];
  warehouses: Warehouse[];
}

/**
 * Intelligent Hindi & Hinglish AI Natural Language Processor for TheFundu OS
 * Understands Hindi, English, and Hinglish queries about stock, valuation, sales, and navigation.
 */
export function processAiStoreQuery(rawQuery: string, ctx: StoreContext): AiCopilotResponse {
  const q = rawQuery.trim();
  const lower = q.toLowerCase();

  const { devices, sales, purchases, buybacks } = ctx;

  // 1. Navigation / Action Intents
  if (
    lower.includes("add phone") ||
    lower.includes("naya phone") ||
    lower.includes("phone add") ||
    lower.includes("phone intake") ||
    lower.includes("stock inward") ||
    lower.includes("phone enter")
  ) {
    return {
      query: q,
      answerHindi: "Naya smartphone inventory me enter karne ke liye maine Add Phone desk tayyar kiya hai. Neeche button par click karke aap naya phone IMEI aur landed cost ke sath add kar sakte hain.",
      spokenHindi: "Naya smartphone add karne ke liye Add Phone desk tayyar hai.",
      devices: [],
      navigation: { label: "Go to Add Smartphone Desk", href: "/inventory/add" },
      actionSuggestion: "Aap customer buyback ya direct supplier se naya phone add kar sakte hain.",
    };
  }

  if (
    lower.includes("buyback") ||
    lower.includes("purana phone") ||
    lower.includes("customer purchase") ||
    lower.includes("phone khareedna") ||
    lower.includes("trade in")
  ) {
    return {
      query: q,
      answerHindi: "Walk-in customer se used phone khareedne ke liye Customer Buyback Desk open kar sakte hain. Isme Aadhaar KYC, valuation aur landed cost calculation direct hoti hai.",
      spokenHindi: "Customer buyback desk open kar sakte hain.",
      devices: [],
      navigation: { label: "Open Customer Buyback Desk", href: "/buyback" },
      actionSuggestion: "Aadhaar number aur phone diagnostics bharte hi device auto-inventory me aa jata hai.",
    };
  }

  if (
    lower.includes("invoice") ||
    lower.includes("bill") ||
    lower.includes("tax invoice") ||
    lower.includes("bill banao") ||
    lower.includes("gst bill")
  ) {
    return {
      query: q,
      answerHindi: "B2C Retail aur B2B Wholesale GST invoices generate karne ke liye Tax Invoice Desk ready hai. Yahan se 18% GST tax invoice aur thermal receipts print kar sakte hain.",
      spokenHindi: "Tax Invoice Desk se aap GST bill generate kar sakte hain.",
      devices: [],
      navigation: { label: "Open Tax Invoice Desk", href: "/invoice" },
    };
  }

  if (
    lower.includes("day end") ||
    lower.includes("closing") ||
    lower.includes("z-slip") ||
    lower.includes("dukan band") ||
    lower.includes("hisab") ||
    lower.includes("closing report")
  ) {
    return {
      query: q,
      answerHindi: "Day-End Closing Desk par aap aaj ka poora hisab-kitab, total cash in drawer, UPI settlements, aur Z-Slip summary report dekh aur print kar sakte hain.",
      spokenHindi: "Day End Closing report open kar sakte hain.",
      devices: [],
      navigation: { label: "Open Day-End Closing & Z-Slip", href: "/day-end-closing" },
    };
  }

  // 2. High-Level Inventory Metrics / Valuation / Store Overview
  if (
    lower.includes("total stock") ||
    lower.includes("total inventory") ||
    lower.includes("kul kitne phone") ||
    lower.includes("kitna maal") ||
    lower.includes("stock value") ||
    lower.includes("inventory value") ||
    lower.includes("total value")
  ) {
    const inStockDevices = devices.filter((d) => d.status === "In Stock");
    const totalPurchaseCost = inStockDevices.reduce(
      (sum, d) => sum + (d.costs.totalLandedCost || d.costs.purchasePrice || 0),
      0
    );
    const totalSellingValue = inStockDevices.reduce((sum, d) => sum + d.costs.sellingPrice, 0);
    const projectedProfit = totalSellingValue - totalPurchaseCost;

    return {
      query: q,
      answerHindi: `Hamare paas is samay kul **${inStockDevices.length} handsets** In Stock hain. Inki total landed inventory purchase cost **${formatINR(totalPurchaseCost)}** hai, aur expected total selling price **${formatINR(totalSellingValue)}** hai (Expected Gross Profit: **${formatINR(projectedProfit)}**).`,
      spokenHindi: `Store me kul ${inStockDevices.length} phone in stock hain. Total stock selling value ${formatINR(totalSellingValue)} hai.`,
      devices: inStockDevices.slice(0, 4),
      stats: [
        { label: "Active Handsets In Stock", value: `${inStockDevices.length} Phones`, color: "emerald" },
        { label: "Landed Inventory Cost", value: formatINR(totalPurchaseCost) },
        { label: "Expected Resale Value", value: formatINR(totalSellingValue), color: "blue" },
        { label: "Projected Gross Margin", value: formatINR(projectedProfit), color: "violet" },
      ],
      navigation: { label: "View Complete Inventory Table", href: "/inventory" },
    };
  }

  // 3. Sales & Buyback Performance Analytics
  if (
    lower.includes("sales") ||
    lower.includes("aaj kitna bika") ||
    lower.includes("revenue") ||
    lower.includes("profit") ||
    lower.includes("kamai")
  ) {
    const totalSalesAmount = sales.reduce((sum, s) => sum + (s.finalAmount || s.sellingPrice || 0), 0);
    const totalSalesCount = sales.length;

    return {
      query: q,
      answerHindi: `Store ledger ke mutabiq total **${totalSalesCount} sales orders** record huye hain, jinka kul revenue **${formatINR(totalSalesAmount)}** raha hai. Sath hi **${buybacks.length} customer buybacks** successfully complete huye hain.`,
      spokenHindi: `Kul ${totalSalesCount} sales orders complete huye hain jinka total revenue ${formatINR(totalSalesAmount)} hai.`,
      devices: [],
      stats: [
        { label: "Total Completed Sales", value: `${totalSalesCount} Orders`, color: "emerald" },
        { label: "Total Sales Revenue", value: formatINR(totalSalesAmount), color: "blue" },
        { label: "Customer Buybacks Done", value: `${buybacks.length} Handsets`, color: "violet" },
      ],
      navigation: { label: "Check Sales Ledger", href: "/sales" },
    };
  }

  // 4. Dead-stock / Old inventory inquiry
  if (
    lower.includes("dead stock") ||
    lower.includes("purana stock") ||
    lower.includes("slow moving") ||
    lower.includes("nahi bika") ||
    lower.includes("purana maal")
  ) {
    const sortedByDate = [...devices]
      .filter((d) => d.status === "In Stock")
      .sort((a, b) => new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime());

    const oldest = sortedByDate.slice(0, 5);

    return {
      query: q,
      answerHindi: `Ye **${oldest.length} handsets** sabse pehle inward kiye gaye the aur abhi tak In Stock hain. AI recommendation: Inka price 3% se 5% discount karke ya combo offer ke sath jaldi liquidate karein taaki cash flow block na ho.`,
      spokenHindi: `Ye phone stock me sabse purane hain. Inhe discount dekar nikaalne ki salah di jati hai.`,
      devices: oldest,
      actionSuggestion: "Purane handsets par seasonal discount lagakar fast-cash generate karein.",
      navigation: { label: "Go to Inventory", href: "/inventory" },
    };
  }

  // 5. Repair / QC Status
  if (
    lower.includes("repair") ||
    lower.includes("kharab") ||
    lower.includes("parts") ||
    lower.includes("theek hone") ||
    lower.includes("under qc") ||
    lower.includes("qc pending") ||
    lower.includes("damaged")
  ) {
    const underRepair = devices.filter((d) => d.status === "QC Pending" || d.status === "Damaged");
    return {
      query: q,
      answerHindi: `Is waqt **${underRepair.length} devices** Quality Check (QC Pending) ya Damaged status me hain.`,
      spokenHindi: `Is samay ${underRepair.length} devices inspection me hain.`,
      devices: underRepair,
      navigation: { label: "Open Quality Check Desk", href: "/quality-check" },
    };
  }

  // 6. Battery Health Filter (e.g. "battery 85 se zyada", "achhi battery", "battery health")
  const batteryMatch = lower.match(/(\d{2})\s*%/i) || lower.match(/battery.*?(\d{2})/i);
  if (lower.includes("battery") && batteryMatch) {
    const threshold = parseInt(batteryMatch[1], 10);
    const matches = devices.filter((d) => (d.batteryHealth || 0) >= threshold);
    return {
      query: q,
      answerHindi: `Hamare stock me **${matches.length} smartphones** hain jinki Battery Health **${threshold}% ya usse zyada** hai.`,
      spokenHindi: `${threshold} percent se zyada battery health wale ${matches.length} phones stock me hain.`,
      devices: matches,
    };
  }

  // 7. Highest / Lowest Price (Sabse mehenga, sabse sasta)
  if (
    lower.includes("sabse mehenga") ||
    lower.includes("highest price") ||
    lower.includes("most expensive") ||
    lower.includes("top price")
  ) {
    const sorted = [...devices].sort((a, b) => b.costs.sellingPrice - a.costs.sellingPrice);
    const top = sorted.slice(0, 4);
    const highest = top[0];
    return {
      query: q,
      answerHindi: `Store me sabse premium/mehenga smartphone **${highest?.brand} ${highest?.model} (${highest?.storage})** hai, jiska selling price **${formatINR(highest?.costs.sellingPrice)}** hai. Top premium devices neeche dekhein:`,
      spokenHindi: `Sabse mehenga phone ${highest?.brand} ${highest?.model} hai, price ${formatINR(highest?.costs.sellingPrice)}.`,
      devices: top,
    };
  }

  if (
    lower.includes("sabse sasta") ||
    lower.includes("cheapest") ||
    lower.includes("lowest price") ||
    lower.includes("kam budget") ||
    lower.includes("budget phone")
  ) {
    const inStock = devices.filter((d) => d.status === "In Stock");
    const sorted = [...inStock].sort((a, b) => a.costs.sellingPrice - b.costs.sellingPrice);
    const cheapest = sorted.slice(0, 4);
    const lowest = cheapest[0];
    return {
      query: q,
      answerHindi: `In Stock devices me sabse affordable smartphone **${lowest?.brand} ${lowest?.model} (${lowest?.storage})** hai, jiska selling price sirf **${formatINR(lowest?.costs.sellingPrice)}** hai.`,
      spokenHindi: `Sabse sasta phone ${lowest?.brand} ${lowest?.model} hai, price ${formatINR(lowest?.costs.sellingPrice)}.`,
      devices: cheapest,
    };
  }

  // 8. Specific Price Constraints ("under 30000", "40k se sasta", "50000 ke under")
  const priceUnderMatch = lower.match(/(?:under|below|se kam|tak)\s*(\d+)(?:k|000)?/i) || lower.match(/(\d+)(?:k|000)?\s*(?:se sasta|ke andar|ke under)/i);
  if (priceUnderMatch) {
    let limit = parseInt(priceUnderMatch[1], 10);
    if (limit < 200) limit = limit * 1000; // e.g. 30 -> 30,000

    const matched = devices.filter((d) => d.costs.sellingPrice <= limit && d.status === "In Stock");
    return {
      query: q,
      answerHindi: `**${formatINR(limit)}** ke budget me **${matched.length} smartphones** In Stock available hain:`,
      spokenHindi: `${formatINR(limit)} ke andar ${matched.length} phone available hain.`,
      devices: matched,
    };
  }

  // 9. Location-specific (e.g. Lucknow Store, Delhi Hub)
  if (lower.includes("lucknow") || lower.includes("delhi")) {
    const locKeyword = lower.includes("delhi") ? "Delhi" : "Lucknow";
    const locDevices = devices.filter((d) => d.warehouse.toLowerCase().includes(locKeyword.toLowerCase()));
    return {
      query: q,
      answerHindi: `**${locKeyword} Store/Hub** me is samay kul **${locDevices.length} handsets** active hain.`,
      spokenHindi: `${locKeyword} store me kul ${locDevices.length} phone hain.`,
      devices: locDevices,
    };
  }

  // 10. Grade-specific (Grade A+, Grade A, Grade B)
  if (lower.includes("grade a+") || lower.includes("grade a plus")) {
    const gradeDevices = devices.filter((d) => d.grade === "A+");
    return {
      query: q,
      answerHindi: `Store me **Grade A+ (Mint Flawless Condition)** ke kul **${gradeDevices.length} handsets** hain:`,
      spokenHindi: `Grade A plus condition ke ${gradeDevices.length} phone hain.`,
      devices: gradeDevices,
    };
  }

  // 11. Search by Brand / Model / Storage / Discrete tokens
  // Strip common conversational filler words in Hindi & English
  const cleanTokens = lower
    .replace(/[?,.!]/g, "")
    .split(/\s+/)
    .filter(
      (w) =>
        ![
          "ke", "ki", "ka", "me", "mai", "hain", "hai", "kya", "kitne", "kitna",
          "kaun", "se", "wale", "wala", "dikhao", "batao", "show", "phones", "phone",
          "smartphone", "smartphones", "devices", "device", "stock", "in", "the", "for", "please"
        ].includes(w)
    );

  const matched = devices.filter((d) => {
    // If user asked about a specific brand e.g. "Apple", "Samsung", "OnePlus"
    const brandMatch = cleanTokens.some((t) => d.brand.toLowerCase().includes(t));
    const searchMatch = matchesDeviceSearch(d, q);
    return brandMatch || searchMatch;
  });

  if (matched.length > 0) {
    const inStockCount = matched.filter((d) => d.status === "In Stock").length;
    return {
      query: q,
      answerHindi: `Aapke search ke anusaar kul **${matched.length} handsets** mile hain (jinme se **${inStockCount} In Stock** hain).`,
      spokenHindi: `Aapke search ke mutabiq ${matched.length} phone mile hain, jinme se ${inStockCount} in stock hain.`,
      devices: matched,
    };
  }

  // 12. Fallback Generic Help
  return {
    query: q,
    answerHindi: `Mujhe aapki query *"**${q}**"* ke liye direct handset nahi mila. Aap mujhse bolkar ya type karke pooch sakte hain:\n- *"Apple ke 128GB wale kitne phone hain?"*\n- *"Sabse sasta phone dikhao"*\n- *"85% se zyada battery health wale phone"*\n- *"Total inventory value kitni hai?"*\n- *"Naya phone add karne ka form kholo"*`,
    spokenHindi: "Kripya phone ka brand, model ya price bata kar dobara poochiye.",
    devices: devices.slice(0, 3),
  };
}

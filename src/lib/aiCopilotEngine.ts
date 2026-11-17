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
 * Intelligent Devanagari Hindi & Hinglish Transliteration and Normalization
 * Converts Hindi speech/text into standard smartphone search tokens.
 * Handles speech-to-text variations like "सैमसंग इज़ 24 अल्ट्रा" -> "samsung s24 ultra".
 */
export function transliterateAndNormalizeHindi(input: string): string {
  if (!input) return "";
  let s = input.trim();

  // 1. Devanagari numerals to standard digits: ०-९ -> 0-9
  const devanagariDigits: Record<string, string> = {
    "०": "0", "१": "1", "२": "2", "३": "3", "४": "4",
    "५": "5", "६": "6", "७": "7", "८": "8", "९": "9",
  };
  s = s.replace(/[०-९]/g, (d) => devanagariDigits[d] || d);

  // 2. Hindi Spoken Numbers to Digits
  s = s.replace(/(?:^|\s+)सोलह(?:\s+|$)/gi, " 16 ");
  s = s.replace(/(?:^|\s+)पंद्रह(?:\s+|$)/gi, " 15 ");
  s = s.replace(/(?:^|\s+)चौदह(?:\s+|$)/gi, " 14 ");
  s = s.replace(/(?:^|\s+)तेरह(?:\s+|$)/gi, " 13 ");
  s = s.replace(/(?:^|\s+)बारह(?:\s+|$)/gi, " 12 ");
  s = s.replace(/(?:^|\s+)ग्यारह(?:\s+|$)/gi, " 11 ");
  s = s.replace(/(?:^|\s+)दस(?:\s+|$)/gi, " 10 ");
  s = s.replace(/(?:^|\s+)(?:चौबीस|चौबिस)(?:\s+|$)/gi, " 24 ");
  s = s.replace(/(?:^|\s+)(?:तेईस|तेइस)(?:\s+|$)/gi, " 23 ");
  s = s.replace(/(?:^|\s+)(?:छब्बीस|छब्बिस)(?:\s+|$)/gi, " 26 ");
  s = s.replace(/(?:^|\s+)(?:बाईस|बाइस)(?:\s+|$)/gi, " 22 ");
  s = s.replace(/(?:^|\s+)(?:इक्कीस|इकीस)(?:\s+|$)/gi, " 21 ");
  s = s.replace(/(?:^|\s+)बीस(?:\s+|$)/gi, " 20 ");
  s = s.replace(/(?:^|\s+)तीस(?:\s+|$)/gi, " 30 ");
  s = s.replace(/(?:^|\s+)चालीस(?:\s+|$)/gi, " 40 ");
  s = s.replace(/(?:^|\s+)पचास(?:\s+|$)/gi, " 50 ");
  s = s.replace(/(?:^|\s+)साठ(?:\s+|$)/gi, " 60 ");
  s = s.replace(/(?:^|\s+)सत्तर(?:\s+|$)/gi, " 70 ");
  s = s.replace(/(?:^|\s+)अस्सी(?:\s+|$)/gi, " 80 ");
  s = s.replace(/(?:^|\s+)नब्बे(?:\s+|$)/gi, " 90 ");
  s = s.replace(/(?:^|\s+)सौ(?:\s+|$)/gi, " 100 ");
  s = s.replace(/(?:^|\s+)(?:हजार|हज़ार)(?:\s+|$)/gi, "000 ");
  s = s.replace(/(?:^|\s+)लाख(?:\s+|$)/gi, "00000 ");

  // 3. Brand Names transliteration
  s = s.replace(/सैमसंग|सामसंग/gi, "samsung");
  s = s.replace(/ऐप्पल|एप्पल|एपिल/gi, "apple");
  s = s.replace(/आईफोन|आइफोन/gi, "iphone");
  s = s.replace(/वनप्लस|वन\s*प्लस/gi, "oneplus");
  s = s.replace(/गूगल|गुगल/gi, "google");
  s = s.replace(/पिक्सेल|पिक्सल/gi, "pixel");
  s = s.replace(/शाओमी|श्योमी/gi, "xiaomi");
  s = s.replace(/रेडमी/gi, "redmi");
  s = s.replace(/पोको/gi, "poco");
  s = s.replace(/वीवो|विवो/gi, "vivo");
  s = s.replace(/ओप्पो|ओपो/gi, "oppo");
  s = s.replace(/रियलमी|रियल\s*मी/gi, "realme");
  s = s.replace(/मोटोरोला|मोटो/gi, "motorola");
  s = s.replace(/नथिंग/gi, "nothing");
  s = s.replace(/आईकू|इकू/gi, "iqoo");
  s = s.replace(/इनफिनिक्स/gi, "infinix");
  s = s.replace(/टेक्नो/gi, "tecno");
  s = s.replace(/लावा/gi, "lava");
  s = s.replace(/नोकिया/gi, "nokia");
  s = s.replace(/सोनी/gi, "sony");
  s = s.replace(/हॉनर|ऑनर/gi, "honor");
  s = s.replace(/आसुस/gi, "asus");

  // 4. Model Terms and Letter-Series (Handle Speech-to-Text variants of "S" like "एस", "इज़", "इस", "इज")
  s = s.replace(/(?:^|\s+)(?:एस|इज़|इस|इज|स)(?:\s+|$)/gi, " s ");
  s = s.replace(/अल्ट्रा|अलट्रा/gi, "ultra");
  s = s.replace(/प्रो/gi, "pro");
  s = s.replace(/मैक्स|मेक्स/gi, "max");
  s = s.replace(/प्लस/gi, "plus");
  s = s.replace(/मिनी/gi, "mini");
  s = s.replace(/गैलेक्सी|गेलेक्सी/gi, "galaxy");
  s = s.replace(/फोल्ड/gi, "fold");
  s = s.replace(/फ्लिप/gi, "flip");
  s = s.replace(/नोट/gi, "note");
  s = s.replace(/जीबी|जी\s*बी/gi, "gb");
  s = s.replace(/टीबी|टी\s*बी/gi, "tb");
  s = s.replace(/रैम/gi, "ram");

  // 5. Intent and Business keywords
  s = s.replace(/स्टॉक|स्टाक/gi, "stock");
  s = s.replace(/सस्ता|सस्ते/gi, "sasta cheapest");
  s = s.replace(/महंगा|महंगे|मेहंगा/gi, "mehenga expensive");
  s = s.replace(/बैटरी/gi, "battery");
  s = s.replace(/कीमत|दाम|रेट|प्राइस|मूल्य/gi, "price");
  s = s.replace(/लखनऊ/gi, "lucknow");
  s = s.replace(/दिल्ली/gi, "delhi");
  s = s.replace(/नया\s*फोन|फोन\s*ऐड/gi, "add phone");
  s = s.replace(/बायबैक|खरीदना|खरीद/gi, "buyback");
  s = s.replace(/इनवॉइस|बिल|रसीद/gi, "invoice");
  s = s.replace(/क्लोजिंग|हिसाब/gi, "closing");

  // 6. Join letter-series with numbers: e.g. "s 24" -> "s24", "s 26" -> "s26", "a 54" -> "a54"
  s = s.replace(/\b([a-z])\s+(\d+)\b/gi, (m, p1, p2) => p1 + p2);

  // Normalize extra spaces
  return s.replace(/\s+/g, " ").trim();
}

/**
 * Intelligent Hindi & Hinglish AI Natural Language Processor for TheFundu OS
 * Understands Hindi, English, and Hinglish queries about stock, valuation, sales, and navigation.
 */
export function processAiStoreQuery(rawQuery: string, ctx: StoreContext): AiCopilotResponse {
  const q = rawQuery.trim();
  const normalized = transliterateAndNormalizeHindi(q);
  const lower = normalized.toLowerCase();
  const originalLower = q.toLowerCase();

  const { devices, sales, purchases, buybacks } = ctx;

  // 1. Navigation / Action Intents
  if (
    lower.includes("add phone") ||
    lower.includes("naya phone") ||
    lower.includes("phone intake") ||
    lower.includes("stock inward") ||
    originalLower.includes("नया फोन") ||
    originalLower.includes("ऐड")
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
    lower.includes("trade in") ||
    originalLower.includes("बायबैक") ||
    originalLower.includes("खरीद")
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
    lower.includes("gst bill") ||
    originalLower.includes("बिल") ||
    originalLower.includes("इनवॉइस")
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
    lower.includes("closing") ||
    lower.includes("day end") ||
    lower.includes("z-slip") ||
    lower.includes("dukan band") ||
    lower.includes("hisab") ||
    originalLower.includes("क्लोजिंग") ||
    originalLower.includes("दुकान बंद")
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
    lower.includes("total value") ||
    originalLower.includes("कुल कितने") ||
    originalLower.includes("टोटल स्टॉक")
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
    lower.includes("kamai") ||
    originalLower.includes("बिक्री") ||
    originalLower.includes("कमाई")
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
    lower.includes("damaged") ||
    originalLower.includes("रिपेयर") ||
    originalLower.includes("खराब")
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

  // 6. Battery Health Filter (e.g. "battery 85 se zyada", "achhi battery", "बैटरी 80 से ऊपर")
  const batteryMatch = lower.match(/(\d{2})\s*%/i) || lower.match(/battery.*?(\d{2})/i) || lower.match(/(\d{2})\s*(?:se|ke).*?battery/i);
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
    lower.includes("top price") ||
    originalLower.includes("सबसे महंगा")
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
    lower.includes("budget phone") ||
    originalLower.includes("सबसे सस्ता")
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
  const fillerWords = [
    "ke", "ki", "ka", "ko", "me", "mai", "hain", "hai", "kya", "kitne", "kitna",
    "kaun", "se", "wale", "wala", "wali", "dikhao", "batao", "show", "phones", "phone",
    "smartphone", "smartphones", "devices", "device", "stock", "in", "the", "for", "please",
    "chahiye", "dekhein", "karein", "kaise", "hoga"
  ];

  const cleanTokens = lower
    .replace(/[?,.!]/g, "")
    .split(/\s+/)
    .filter((w) => w && !fillerWords.includes(w));

  // A) Match using normalized multi-token search
  let matched = devices.filter((d) => matchesDeviceSearch(d, normalized));

  // B) If no exact multi-token match, try matching clean non-filler tokens
  if (matched.length === 0 && cleanTokens.length > 0) {
    matched = devices.filter((d) => {
      const brand = d.brand.toLowerCase();
      const model = d.model.toLowerCase();
      const storage = d.storage.toLowerCase();

      // Check if all significant tokens match
      return cleanTokens.every((token) => {
        if (/^\d+$/.test(token)) {
          const modelNumRegex = new RegExp(`(?:^|[^0-9])${token}(?:[^0-9]|$)`, "i");
          return modelNumRegex.test(model) || storage.includes(token);
        }
        return brand.includes(token) || model.includes(token) || storage.includes(token);
      });
    });
  }

  // C) If still no match, but a known brand was recognized (e.g. Samsung, Apple, OnePlus),
  // match phones of that brand!
  const recognizedBrand = [
    "samsung", "apple", "oneplus", "google", "xiaomi", "redmi", "poco",
    "vivo", "oppo", "realme", "motorola", "nothing", "iqoo", "infinix"
  ].find((b) => lower.includes(b));

  if (matched.length > 0) {
    const inStockCount = matched.filter((d) => d.status === "In Stock").length;

    // Compose a detailed, personalized answer mentioning exact handset names
    let detailsText = "";
    if (matched.length === 1) {
      const single = matched[0];
      detailsText = `\n\n📌 **${single.brand} ${single.model} (${single.storage})**\n- Colour: **${single.colour}**\n- Status: **${single.status}**\n- Selling Price: **${formatINR(single.costs.sellingPrice)}**`;
    } else if (matched.length <= 4) {
      detailsText = "\n\n" + matched.map((m, idx) => `${idx + 1}. **${m.brand} ${m.model}** (${m.storage}, ${m.colour}) - **${formatINR(m.costs.sellingPrice)}**`).join("\n");
    }

    return {
      query: q,
      answerHindi: `Hamare stock me aapki query ke mutabiq **${matched.length} handsets** mile hain (jinme se **${inStockCount} In Stock** hain):${detailsText}`,
      spokenHindi: `Aapke search ke mutabiq ${matched.length} phone mile hain, jinme se ${inStockCount} in stock hain.`,
      devices: matched,
    };
  }

  // D) If requested specific model was not found, but brand was recognized:
  if (recognizedBrand) {
    const brandCapitalized = recognizedBrand.charAt(0).toUpperCase() + recognizedBrand.slice(1);
    const brandPhones = devices.filter((d) => d.brand.toLowerCase() === recognizedBrand && d.status === "In Stock");

    return {
      query: q,
      answerHindi: `Is samay store me *"**${q}**"* exact variant In Stock nahi hai, lekin **${brandCapitalized}** ke ye popular models currently available hain:`,
      spokenHindi: `${brandCapitalized} ka ye specific model abhi nahi hai, par baki ${brandCapitalized} phones available hain.`,
      devices: brandPhones.slice(0, 4),
    };
  }

  // 12. Fallback Generic Help (devices: [] so no wrong/random phones are shown!)
  return {
    query: q,
    answerHindi: `Mujhe aapki query *"**${q}**"* ke liye direct handset nahi mila.\n\nAap mujhse bolkar ya type karke pooch sakte hain:\n- *"Samsung S24 Ultra dikhao"*\n- *"Apple ke 128GB wale phone kitne hain?"*\n- *"Sabse sasta phone kaun sa hai?"*\n- *"Total inventory value kitni hai?"*\n- *"Naya phone add karne ka form kholo"*`,
    spokenHindi: "Kripya phone ka brand, model ya price bata kar dobara poochiye.",
    devices: [],
  };
}

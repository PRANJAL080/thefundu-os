import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Device, DeviceGrade, DeviceStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return "-";
  try {
    const d = new Date(dateString);
    return `${d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })} ${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
  } catch {
    return dateString;
  }
}

export function getGradeBadgeColor(grade?: DeviceGrade): { bg: string; text: string; border: string } {
  switch (grade) {
    case 'A+':
      return { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' };
    case 'A':
      return { bg: 'bg-teal-50 dark:bg-teal-950/40', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800' };
    case 'B':
      return { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' };
    case 'C':
      return { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' };
    case 'D':
      return { bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' };
    case 'Scrap':
    default:
      return { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800' };
  }
}

export function getStatusBadgeColor(status: DeviceStatus): { bg: string; text: string; border: string; dot: string } {
  switch (status) {
    case 'In Stock':
      return { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-500' };
    case 'Ready for Sale':
      return { bg: 'bg-teal-50 dark:bg-teal-950/40', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800', dot: 'bg-teal-500' };
    case 'QC Pending':
      return { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', dot: 'bg-amber-500' };
    case 'Under Repair':
      return { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800', dot: 'bg-purple-500' };
    case 'Reserved':
      return { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800', dot: 'bg-indigo-500' };
    case 'Sold':
      return { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', dot: 'bg-blue-500' };
    case 'Damaged':
      return { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800', dot: 'bg-rose-500' };
    case 'Returned':
      return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-300 dark:border-slate-700', dot: 'bg-slate-500' };
    default:
      return { bg: 'bg-slate-50 dark:bg-slate-900', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-800', dot: 'bg-slate-400' };
  }
}

export function compressImage(file: File, maxDimension = 800, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => {
        resolve(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Intelligent smartphone search matching algorithm.
 * Handles:
 * - "apple 16" -> all Apple iPhone 16 phones
 * - "apple 12 pro" -> strictly Apple iPhone 12 Pro (NOT other 128GB iPhone generations)
 * - "samsung s 26" / "samsung s26" / "s 26" / "s26" -> all Samsung Galaxy S26 phones
 * - IMEI 1 & 2, SKU, Inventory ID, colours, storage
 */
export function matchesDeviceSearch(dev: Device, query: string): boolean {
  if (!query || !query.trim()) return true;

  const rawQ = query.trim().toLowerCase();

  // 1. Direct IMEI exact/partial match, SKU, or Inventory ID
  if (
    (dev.imei1 && dev.imei1.includes(rawQ)) ||
    (dev.imei2 && dev.imei2.includes(rawQ)) ||
    (dev.sku && dev.sku.toLowerCase().includes(rawQ)) ||
    (dev.id && dev.id.toLowerCase() === rawQ) ||
    (dev.id && dev.id.toLowerCase().replace(/[^0-9]/g, "").endsWith(rawQ))
  ) {
    return true;
  }

  const brand = (dev.brand || "").toLowerCase();
  const model = (dev.model || "").toLowerCase();
  const storage = (dev.storage || "").toLowerCase();
  const colour = (dev.colour || "").toLowerCase();

  // 2. Normalize letter-number spacing: e.g. "s 26" -> "s26", "s 24" -> "s24", "a 54" -> "a54"
  const normalizedQ = rawQ
    .replace(/\b([a-z])\s+(\d+)\b/gi, "$1$2")
    .trim();

  // 3. Multi-token smart matching:
  const tokens = normalizedQ.split(/\s+/).filter(Boolean);

  const allTokensMatch = tokens.every((token) => {
    // A) Purely numeric token (e.g. "12", "16", "13", "14", "15", "26"):
    // Must match as a discrete number in the MODEL name (e.g. \b12\b in "iPhone 12 Pro")
    // or as exact storage capacity (e.g. "128", "256", "512", "64")
    if (/^\d+$/.test(token)) {
      const modelNumRegex = new RegExp(`(?:^|[^0-9])${token}(?:[^0-9]|$)`, "i");
      if (modelNumRegex.test(model)) {
        return true;
      }
      if (["32", "64", "128", "256", "512", "1024"].includes(token)) {
        const storageNumRegex = new RegExp(`(?:^|[^0-9])${token}(?:gb|tb|[^0-9]|$)`, "i");
        if (storageNumRegex.test(storage)) {
          return true;
        }
      }
      return false;
    }

    // B) Letter + digit series token (e.g. "s26", "s24", "a54", "z6"):
    const letterDigit = token.match(/^([a-z]+)(\d+)$/i);
    if (letterDigit) {
      const [, prefix, num] = letterDigit;
      const cleanModel = model.replace(/[^a-z0-9]/g, "");
      if (cleanModel.includes(token)) return true;

      const numRegex = new RegExp(`(?:^|[^0-9])${num}(?:[^0-9]|$)`, "i");
      if (numRegex.test(model)) {
        if (prefix === "s" && (brand.includes("samsung") || model.includes("s"))) return true;
        if (prefix === "a" && (brand.includes("samsung") || model.includes("a"))) return true;
        if (prefix === "z" && (brand.includes("samsung") || model.includes("z") || model.includes("fold") || model.includes("flip"))) return true;
      }
      return false;
    }

    // C) Word token (e.g. "apple", "iphone", "pro", "max", "samsung", "galaxy", "ultra", "pink"):
    if (brand.includes(token)) return true;
    if (model.includes(token)) return true;
    if (storage.includes(token)) return true;
    if (colour.includes(token)) return true;

    return false;
  });

  return allTokensMatch;
}


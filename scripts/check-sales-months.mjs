import { initialSales } from '../src/lib/mock-data.js';

console.log("Total initialSales count:", initialSales?.length);
const months = {};
for (const s of (initialSales || [])) {
  const m = (s.date || "").slice(0, 7) || "unknown";
  months[m] = (months[m] || 0) + 1;
}
console.log("Months found in initialSales:", months);

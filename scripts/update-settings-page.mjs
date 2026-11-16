import fs from "fs";
import path from "path";

const filePath = path.resolve("src/app/settings/page.tsx");
let txt = fs.readFileSync(filePath, "utf8");

// 1. Update state defaults
txt = txt.replace(
  'const [website, setWebsite] = useState("https://thefundu.com");\n  const [gstin, setGstin] = useState("27AAACE4419E1ZP");\n  const [stateCode, setStateCode] = useState("27 - Maharashtra");\n  const [registeredAddress, setRegisteredAddress] = useState(\n    "1201, Maker Chambers V, Nariman Point, Mumbai, Maharashtra, 400021"\n  );',
  'const [website, setWebsite] = useState("https://thefundu.com");\n  const [cin, setCin] = useState("U95111UP2026PTC252407");\n  const [gstin, setGstin] = useState("09AAJCE9800C1ZP");\n  const [stateCode, setStateCode] = useState("09 - Uttar Pradesh");\n  const [registeredAddress, setRegisteredAddress] = useState(\n    "ED-476, Sector-Q, Aliganj, Aliganj (Lucknow), Uttar Pradesh, India, 226024."\n  );'
);

// 2. Add CIN input field
const oldGrid = `<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Corporate GSTIN Number *</label>
                  <Input value={gstin} onChange={(e) => setGstin(e.target.value)} />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Home State & Code *</label>
                  <Input value={stateCode} onChange={(e) => setStateCode(e.target.value)} />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Official Website</label>
                  <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>
              </div>`;

const newGrid = `<div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="font-semibold block mb-1">Corporate CIN *</label>
                  <Input value={cin} onChange={(e) => setCin(e.target.value)} />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Corporate GSTIN Number *</label>
                  <Input value={gstin} onChange={(e) => setGstin(e.target.value)} />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Home State & Code *</label>
                  <Input value={stateCode} onChange={(e) => setStateCode(e.target.value)} />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Official Website</label>
                  <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>
              </div>`;

txt = txt.replace(oldGrid, newGrid);

fs.writeFileSync(filePath, txt, "utf8");
console.log("Successfully updated settings/page.tsx");

import fs from "fs";
import path from "path";

const filePath = path.resolve("src/app/invoice/page.tsx");
let txt = fs.readFileSync(filePath, "utf8");

// 1. Add import for SalesChannelCode, SaleTypeCode
if (!txt.includes("SalesChannelCode")) {
  txt = txt.replace(
    'import { Device, SalesOrder } from "@/lib/types";',
    'import { Device, SalesOrder, SalesChannelCode, SaleTypeCode } from "@/lib/types";\nimport { COMPANY_CONFIG } from "@/lib/company-config";'
  );
}

// 2. Add channel and typeOfSale state
if (!txt.includes("const [channel, setChannel] = useState")) {
  txt = txt.replace(
    'const [warrantyDays, setWarrantyDays] = useState(180);',
    'const [warrantyDays, setWarrantyDays] = useState(180);\n  const [channel, setChannel] = useState<SalesChannelCode>("FSO");\n  const [typeOfSale, setTypeOfSale] = useState<SaleTypeCode>("B2C");'
  );
}

// 3. Fix invoiceNumber from INVMUM to INVLKO2611-
txt = txt.replace(
  /const invoiceNumber = `INVMUM\$\{selectedDevice\?\.id \? selectedDevice\.id\.replace\("Fun-", ""\)\.replace\("TFD-", ""\) : "26001"\}`;/,
  'const invoiceNumber = `INVLKO2611-${selectedDevice?.id ? selectedDevice.id.replace("Fun-", "").replace("TFD-", "") : "26001"}`;'
);

// 4. Update handleSaveAndIssue to include channel and typeOfSale
txt = txt.replace(
  'deviceId: selectedDevice.id,',
  'channel,\n      typeOfSale,\n      invoiceNumber,\n      deviceId: selectedDevice.id,'
);

// 5. Remove Condition Grade from line 230
txt = txt.replace(
  '<strong>Battery Health:</strong> {selectedDevice.batteryHealth}% • Condition Grade {selectedDevice.grade}',
  '<strong>Battery Health:</strong> {selectedDevice.batteryHealth}% (Apple Maximum Capacity)'
);

// 6. In device select option, remove Grade
txt = txt.replace(
  '{d.brand} {d.model} ({d.storage}, Grade {d.grade})',
  '{d.brand} {d.model} ({d.storage})'
);

// 7. Pass channel and typeOfSale to CompanyInvoiceSheet
txt = txt.replace(
  'invoiceNumber={invoiceNumber}\n                warrantyDays={warrantyDays}\n              />',
  'invoiceNumber={invoiceNumber}\n                warrantyDays={warrantyDays}\n                channel={channel}\n                typeOfSale={typeOfSale}\n              />'
);

// 8. Add Channel and Type of Sale select UI before customer card
const channelUiSnippet = `          {/* Sales Channel & Type of Sale */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Sales Channel &amp; Commercial Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Sales Channel *</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as SalesChannelCode)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="FSO">FSO — Fundu Store Outlet (Retail)</option>
                    <option value="ONS">ONS — Online Store (Web/Marketplace)</option>
                    <option value="FOR">FOR — Repair &amp; Service Desk</option>
                    <option value="DS">DS — Doorstep Direct Sales</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Type of Sale *</label>
                  <select
                    value={typeOfSale}
                    onChange={(e) => setTypeOfSale(e.target.value as SaleTypeCode)}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="B2C">B2C — Retail Individual Customer</option>
                    <option value="B2B">B2B — Wholesale / Dealer / Reseller</option>
                    <option value="Corporate">Corporate — Enterprise / Fleet</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
`;

if (!txt.includes("Sales Channel &amp; Commercial Category")) {
  txt = txt.replace(
    '{/* Card 3: Customer Details */}',
    `${channelUiSnippet}\n          {/* Card 3: Customer Details */}`
  );
}

fs.writeFileSync(filePath, txt, "utf8");
console.log("Successfully updated invoice/page.tsx");

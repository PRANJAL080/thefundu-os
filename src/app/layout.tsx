import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { Shell } from "@/components/layout/Shell";

export const metadata: Metadata = {
  title: "TheFundu Inventory OS | Enterprise Refurbished Smartphone Management",
  description:
    "Enterprise-grade second-hand and refurbished smartphone operating system by Esterline Bonaparte Corporation Private Limited. Features IMEI-level tracking, 13-point QC, repair workflows, multi-warehouse stock mesh, and profit intelligence.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <AppProvider>
          <Shell>{children}</Shell>
        </AppProvider>
      </body>
    </html>
  );
}

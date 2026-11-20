"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Directly downloads an invoice DOM element as a crisp A4 PDF file into the laptop/PC Downloads folder.
 * Does NOT open the browser print dialog.
 */
export async function downloadInvoicePDF(
  elementOrId: HTMLElement | string,
  fileName: string = "Tax-Invoice.pdf"
): Promise<boolean> {
  try {
    let element: HTMLElement | null = null;
    if (typeof elementOrId === "string") {
      element = document.getElementById(elementOrId) || document.querySelector(elementOrId);
    } else {
      element = elementOrId;
    }

    if (!element) {
      console.error("PDF Downloader: Target invoice element not found");
      return false;
    }

    // Capture the invoice element at high resolution
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution (300+ DPI equivalent for A4 print quality)
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      onclone: (clonedDoc) => {
        const el = clonedDoc.querySelector<HTMLElement>("[data-invoice-sheet]");
        if (el) {
          el.style.width = "794px"; // Standard A4 96 DPI pixel width
          el.style.maxWidth = "794px";
          el.style.margin = "0 auto";
        }
      },
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);

    // Standard A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pdfPageWidth = 210;
    const pdfPageHeight = 297;
    const imgHeight = (canvas.height * pdfPageWidth) / canvas.width;

    // Single-page fit: scale cleanly to 1 standard A4 page so it's a perfect single-page bill
    if (imgHeight <= 325) {
      const renderHeight = Math.min(imgHeight, pdfPageHeight);
      pdf.addImage(imgData, "JPEG", 0, 0, pdfPageWidth, renderHeight, undefined, "FAST");
    } else {
      // Multi-page handling if exceptionally long
      let remainingHeight = imgHeight;
      let currentPosition = 0;

      pdf.addImage(imgData, "JPEG", 0, currentPosition, pdfPageWidth, imgHeight, undefined, "FAST");
      remainingHeight -= pdfPageHeight;

      while (remainingHeight > 0) {
        currentPosition = remainingHeight - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, currentPosition, pdfPageWidth, imgHeight, undefined, "FAST");
        remainingHeight -= pdfPageHeight;
      }
    }

    // Direct download into laptop/device
    const sanitizedFileName = fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`;
    pdf.save(sanitizedFileName);
    return true;
  } catch (error) {
    console.error("Failed to generate PDF for direct download:", error);
    return false;
  }
}

/**
 * Directly downloads an invoice DOM element as a high-resolution PNG image into the laptop/PC Downloads folder.
 */
export async function downloadInvoiceImage(
  elementOrId: HTMLElement | string,
  fileName: string = "Tax-Invoice.png"
): Promise<boolean> {
  try {
    let element: HTMLElement | null = null;
    if (typeof elementOrId === "string") {
      element = document.getElementById(elementOrId) || document.querySelector(elementOrId);
    } else {
      element = elementOrId;
    }

    if (!element) return false;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const sanitizedFileName = fileName.endsWith(".png") ? fileName : `${fileName}.png`;
    const link = document.createElement("a");
    link.download = sanitizedFileName;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error("Failed to download image:", err);
    return false;
  }
}

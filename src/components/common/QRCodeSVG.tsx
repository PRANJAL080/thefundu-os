"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
  darkColor?: string;
  lightColor?: string;
  includeMargin?: boolean;
}

export function QRCodeSVG({
  value,
  size = 120,
  className = "",
  darkColor = "#000000",
  lightColor = "#ffffff",
  includeMargin = true,
}: QRCodeProps) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(value, {
      width: size * 2,
      margin: includeMargin ? 1 : 0,
      color: {
        dark: darkColor,
        light: lightColor,
      },
    })
      .then((url) => {
        if (isMounted) setDataUrl(url);
      })
      .catch((err) => {
        console.error("QR Code generation error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [value, size, darkColor, lightColor, includeMargin]);

  if (!dataUrl) {
    return (
      <div
        className={`bg-slate-100 dark:bg-slate-800 animate-pulse rounded flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-[9px] text-slate-400 font-mono">QR</span>
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt={`QR Code: ${value}`}
      width={size}
      height={size}
      className={`select-none ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
}

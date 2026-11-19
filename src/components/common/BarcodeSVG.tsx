"use client";

import React, { useMemo } from "react";
import { generateCode128 } from "@/lib/barcode";

interface BarcodeSVGProps {
  value: string;
  width?: number | string;
  height?: number;
  showText?: boolean;
  text?: string;
  className?: string;
  barColor?: string;
  bgColor?: string;
}

/**
 * Authentic, scannable Code 128 (Subset B) SVG Barcode Component.
 * Produces crisp, laser-readable vector lines with proper quiet zones.
 */
export function BarcodeSVG({
  value,
  width = "100%",
  height = 36,
  showText = true,
  text,
  className = "",
  barColor = "#000000",
  bgColor = "#FFFFFF",
}: BarcodeSVGProps) {
  const codeResult = useMemo(() => {
    return generateCode128(value || "000000");
  }, [value]);

  const displayText = text !== undefined ? text : codeResult.text;

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <svg
        className="w-full block"
        style={{
          maxWidth: typeof width === "number" ? `${width}px` : width,
          height: `${height}px`,
        }}
        viewBox={`0 0 ${codeResult.totalModules} ${height}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        {/* White background / quiet zone base for optical scanner contrast */}
        <rect
          x="0"
          y="0"
          width={codeResult.totalModules}
          height={height}
          fill={bgColor}
        />
        {/* Scannable Code 128 black bars */}
        {codeResult.bars.map((bar, idx) => (
          <rect
            key={idx}
            x={bar.x}
            y="0"
            width={bar.width}
            height={height}
            fill={barColor}
          />
        ))}
      </svg>

      {showText && (
        <span className="font-mono text-[9px] font-bold tracking-widest text-black dark:text-black leading-tight mt-0.5">
          {displayText}
        </span>
      )}
    </div>
  );
}

export default BarcodeSVG;

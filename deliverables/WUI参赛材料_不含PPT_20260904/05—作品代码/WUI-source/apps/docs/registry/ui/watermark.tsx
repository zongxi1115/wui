"use client"

import * as React from "react"

import { cn } from "@/registry/lib/utils"

interface WatermarkFont {
  /** Watermark text color. Inherits the current foreground color by default. */
  color?: string
  /** CSS font family used by the watermark text. */
  fontFamily?: string
  /** Font size in pixels. @default 16 */
  fontSize?: number
  /** CSS font style. @default "normal" */
  fontStyle?: React.CSSProperties["fontStyle"]
  /** CSS font weight. @default 500 */
  fontWeight?: React.CSSProperties["fontWeight"]
}

interface WatermarkProps extends Omit<React.ComponentProps<"div">, "content"> {
  /** One line or multiple lines of repeated watermark text. @default "WUI" */
  content?: string | string[]
  /** Image URL used as the repeated watermark. Takes precedence over content. */
  image?: string
  /** Clockwise rotation angle in degrees. @default -22 */
  rotate?: number
  /** Horizontal and vertical space between watermark cells. @default [80, 80] */
  gap?: [number, number]
  /** Horizontal and vertical offset of the repeating pattern. @default [0, 0] */
  offset?: [number, number]
  /** Width of one watermark mark in pixels. @default 160 */
  width?: number
  /** Height of one watermark mark in pixels. @default 64 */
  height?: number
  /** Text typography options. */
  font?: WatermarkFont
  /** Opacity of the watermark layer. @default 0.15 */
  opacity?: number
  /** Stacking order of the watermark layer. @default 10 */
  zIndex?: number
}

function Watermark({
  children,
  className,
  content,
  image,
  rotate = -22,
  gap = [80, 80],
  offset = [0, 0],
  width = 160,
  height = 64,
  font,
  opacity = 0.15,
  zIndex = 10,
  ...props
}: WatermarkProps) {
  const patternId = `watermark-${React.useId().replace(/:/g, "")}`
  const resolvedContent = content ?? "WUI"
  const lines = Array.isArray(resolvedContent)
    ? resolvedContent
    : [resolvedContent]
  const fontSize = font?.fontSize ?? 16
  const lineHeight = fontSize * 1.4
  const patternWidth = width + gap[0]
  const patternHeight = height + gap[1]
  const centerX = patternWidth / 2
  const centerY = patternHeight / 2
  const firstLineY = centerY - ((lines.length - 1) * lineHeight) / 2

  return (
    <div
      data-slot="watermark"
      className={cn("relative isolate", className)}
      {...props}
    >
      {children}
      <svg
        data-slot="watermark-layer"
        aria-hidden="true"
        className="text-foreground pointer-events-none absolute inset-0 size-full select-none"
        style={{ color: font?.color, opacity, zIndex }}
      >
        <defs>
          <pattern
            id={patternId}
            width={patternWidth}
            height={patternHeight}
            x={offset[0]}
            y={offset[1]}
            patternUnits="userSpaceOnUse"
          >
            <g transform={`rotate(${rotate} ${centerX} ${centerY})`}>
              {image ? (
                <image
                  data-slot="watermark-image"
                  href={image}
                  x={centerX - width / 2}
                  y={centerY - height / 2}
                  width={width}
                  height={height}
                  preserveAspectRatio="xMidYMid meet"
                />
              ) : (
                lines.map((line, index) => (
                  <text
                    key={`${line}-${index}`}
                    data-slot="watermark-text"
                    x={centerX}
                    y={firstLineY + index * lineHeight}
                    fill="currentColor"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontFamily: font?.fontFamily,
                      fontSize,
                      fontStyle: font?.fontStyle ?? "normal",
                      fontWeight: font?.fontWeight ?? 500,
                    }}
                  >
                    {line}
                  </text>
                ))
              )}
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  )
}

export { Watermark, type WatermarkFont, type WatermarkProps }

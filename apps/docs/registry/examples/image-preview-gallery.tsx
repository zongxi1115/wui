"use client"

import * as React from "react"
import { ImagePreview } from "@/registry/ui/image-preview"

const galleryItems = [
  {
    id: "1",
    src: "/images/image-preview-landscape.svg",
    alt: "北卡斯卡特国家公园晚霞",
    caption: "拍摄于 2026 年初秋 · 曝光参数 1/250s f/4.0 ISO 100",
    downloadName: "north-cascades-sunset.svg",
    title: "国家公园晚霞",
    size: "4.2 MB",
  },
  {
    id: "2",
    src: "/images/image-preview-landscape.svg",
    alt: "现代极简建筑立面光影",
    caption: "结构几何与晨曦反射 · 建筑设计案例",
    downloadName: "architecture-study.svg",
    title: "现代建筑光影",
    size: "3.8 MB",
  },
  {
    id: "3",
    src: "/images/image-preview-landscape.svg",
    alt: "高山冷杉晨雾微光",
    caption: "清晨山谷逆光场景 · 4K 原始底片",
    downloadName: "alpine-morning.svg",
    title: "高山晨雾微光",
    size: "5.1 MB",
  },
]

export default function ImagePreviewGallery() {
  return (
    <div className="w-full max-w-2xl space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground">高清摄影作品集 (Gallery)</span>
        <span className="text-xs text-muted-foreground">点击任意图片进入大图交互模式</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {galleryItems.map((item) => (
          <div key={item.id} className="group overflow-hidden rounded-lg border bg-card p-2 shadow-xs">
            <ImagePreview
              src={item.src}
              alt={item.alt}
              caption={item.caption}
              downloadName={item.downloadName}
              className="aspect-[4/3] w-full"
              thumbnailClassName="rounded-md"
            />
            <div className="mt-2 flex items-center justify-between px-1">
              <span className="text-xs font-medium text-foreground truncate">{item.title}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{item.size}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

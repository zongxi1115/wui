import { PlayIcon } from "lucide-react"

import { AspectRatio } from "@/registry/ui/aspect-ratio"

export default function AspectRatioCard() {
  return (
    <a
      href="#aspect-ratio-card"
      className="group bg-card text-card-foreground focus-visible:ring-ring/35 block w-full max-w-sm overflow-hidden rounded-lg border outline-none focus-visible:ring-[3px]"
    >
      <AspectRatio ratio={16 / 9} className="bg-muted">
        <img
          src="/wui/demo/field-notes/coastal-hill.jpg"
          alt="海岸山丘航拍画面"
          className="size-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
        />
        <span className="absolute right-2 bottom-2 rounded-sm bg-black/70 px-1.5 py-0.5 font-mono text-[11px] text-white tabular-nums">
          18:24
        </span>
        <span className="bg-background text-foreground absolute inset-0 m-auto flex size-10 scale-90 items-center justify-center rounded-full opacity-0 shadow-sm transition-[opacity,scale] duration-200 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
          <PlayIcon className="ml-0.5 size-4 fill-current" />
        </span>
      </AspectRatio>

      <div className="space-y-1.5 p-4">
        <h3 className="line-clamp-1 text-sm font-medium">
          无人机航拍入门：构图与运镜
        </h3>
        <p className="text-muted-foreground line-clamp-2 text-xs leading-5">
          从起飞检查到三种常用运镜手法，带你拍出稳定、有叙事感的风光镜头。
        </p>
        <p className="text-muted-foreground pt-1 text-xs">
          林晓雯 · 2.4 万次播放
        </p>
      </div>
    </a>
  )
}

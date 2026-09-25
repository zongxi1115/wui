import { ArrowUpRightIcon, PlayIcon } from "lucide-react"

import { Cursor } from "@/registry/ui/cursor"

const items = [
  {
    image: "/wui/demo/field-notes/aerial-coast.jpg",
    tag: "影片 · 02:14",
    title: "海岸线航拍计划",
    cursor: (
      <span className="bg-background text-foreground flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium shadow-sm">
        <PlayIcon className="size-3 fill-current" />
        播放
      </span>
    ),
  },
  {
    image: "/wui/demo/field-notes/concrete-stairs.jpg",
    tag: "案例 · 建筑",
    title: "混凝土与光的秩序",
    cursor: (
      <span className="bg-background text-foreground flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium shadow-sm">
        查看案例
        <ArrowUpRightIcon className="size-3.5" />
      </span>
    ),
  },
]

export default function CursorCard() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <article
          key={item.title}
          className="group relative overflow-hidden rounded-lg"
        >
          <Cursor
            attachToParent
            springConfig={{ stiffness: 420, damping: 32, mass: 0.3 }}
          >
            {item.cursor}
          </Cursor>
          <img
            src={item.image}
            alt=""
            className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          <div className="pt-3">
            <p className="text-muted-foreground text-xs">{item.tag}</p>
            <p className="mt-1 text-sm font-medium">{item.title}</p>
          </div>
        </article>
      ))}
    </div>
  )
}

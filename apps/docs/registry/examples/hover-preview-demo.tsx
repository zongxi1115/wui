import { ArrowUpRightIcon } from "lucide-react"

import { HoverPreview } from "@/registry/ui/hover-preview"

const projects = [
  {
    name: "北岸美术馆",
    type: "品牌与导视",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=640&q=80",
  },
  {
    name: "云栖办公园区",
    type: "空间设计",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=640&q=80",
  },
  {
    name: "木白咖啡",
    type: "包装设计",
    year: "2025",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=640&q=80",
  },
  {
    name: "极光出行 App",
    type: "产品设计",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=640&q=80",
  },
]

export default function HoverPreviewDemo() {
  return (
    <div className="w-full max-w-2xl">
      <div className="text-muted-foreground mb-2 flex justify-between px-3 text-xs">
        <span>项目</span>
        <span>年份</span>
      </div>
      <ul className="border-t">
        {projects.map((project) => (
          <li key={project.name} className="border-b">
            <HoverPreview
              previewClassName="w-64 rounded-md shadow-xl"
              preview={
                <img
                  src={project.image}
                  alt=""
                  className="bg-muted aspect-[4/3] w-full object-cover"
                />
              }
            >
              <a
                href="#"
                className="group hover:bg-muted/60 focus-visible:bg-muted/60 flex items-center justify-between gap-4 px-3 py-4 outline-none transition-colors"
              >
                <span className="flex items-baseline gap-3">
                  <span className="text-lg font-medium tracking-tight">
                    {project.name}
                  </span>
                  <span className="text-muted-foreground hidden text-sm sm:inline">
                    {project.type}
                  </span>
                </span>
                <span className="text-muted-foreground flex items-center gap-3 text-sm tabular-nums">
                  {project.year}
                  <ArrowUpRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            </HoverPreview>
          </li>
        ))}
      </ul>
    </div>
  )
}

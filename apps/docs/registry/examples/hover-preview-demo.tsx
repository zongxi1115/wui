import { ArrowUpRightIcon } from "lucide-react"

import { HoverPreview } from "@/registry/ui/hover-preview"

const projects = [
  {
    number: "01",
    name: "The grass route",
    place: "Dunes",
    image: "/wui/demo/field-notes/silver-grass.jpg",
  },
  {
    number: "02",
    name: "Edge conditions",
    place: "Headland",
    image: "/wui/demo/field-notes/coastal-hill.jpg",
  },
  {
    number: "03",
    name: "Ways of shelter",
    place: "Forest",
    image: "/wui/demo/field-notes/concrete-forest.jpg",
  },
]

export default function HoverPreviewDemo() {
  return (
    <div className="w-full max-w-3xl bg-[#e1ded4] px-6 py-8 text-[#20211d] sm:px-9">
      <div className="mb-10 flex items-end justify-between">
        <h3 className="font-serif text-4xl italic">Field index</h3>
        <p className="text-[10px] uppercase tracking-[0.25em]">
          Hover to visit
        </p>
      </div>
      <div className="border-t border-[#20211d]">
        {projects.map((project) => (
          <HoverPreview
            key={project.number}
            previewClassName="h-40 w-56 overflow-hidden rounded-t-[7rem] shadow-xl shadow-black/20"
            preview={
              <img
                src={project.image}
                alt={`${project.place} preview`}
                className="size-full object-cover"
              />
            }
          >
            <a
              href="#"
              className="grid grid-cols-[2.5rem_1fr_auto_auto] items-baseline gap-4 border-b border-[#20211d]/35 py-5 outline-none transition-[padding] hover:pl-2 focus-visible:pl-2"
            >
              <span className="text-xs opacity-50">{project.number}</span>
              <span className="font-serif text-xl sm:text-2xl">
                {project.name}
              </span>
              <span className="hidden text-[10px] uppercase tracking-[0.2em] opacity-50 sm:block">
                {project.place}
              </span>
              <ArrowUpRightIcon className="size-4" />
            </a>
          </HoverPreview>
        ))}
      </div>
    </div>
  )
}

import { ExternalLinkIcon } from "lucide-react"

import { HoverPreview } from "@/registry/ui/hover-preview"

export default function HoverPreviewLink() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="max-w-md text-base leading-relaxed text-foreground">
        Explore our comprehensive guide on{" "}
        <HoverPreview
          className="inline-block"
          previewClassName="w-72 overflow-hidden rounded-xl border bg-popover shadow-xl"
          preview={
            <div className="p-3 text-left">
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
                  alt="Micro-interactions illustration"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-2.5">
                <div className="text-xs font-semibold text-foreground">
                  Micro-interactions in Modern Design
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  How physics-based springs enhance tactile feedback and user engagement.
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>5 min read</span>
                  <span className="text-primary">design-system.io</span>
                </div>
              </div>
            </div>
          }
        >
          <a
            href="#article"
            className="inline-flex items-center gap-0.5 font-semibold text-primary underline underline-offset-4"
          >
            physics-based micro-interactions
            <ExternalLinkIcon className="size-3.5" />
          </a>
        </HoverPreview>{" "}
        to elevate your application feel.
      </p>
    </div>
  )
}

import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar"
import { InfiniteSlider } from "@/registry/ui/infinite-slider"

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Staff Engineer @ Stripe",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    quote: "WUI components cut our internal dashboard development time in half with zero accessibility trade-offs.",
  },
  {
    name: "Elena Rostova",
    role: "Design Lead @ Linear",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    quote: "The micro-animations and spring physics feel natural, precise, and delightfully tactile.",
  },
  {
    name: "Marcus Vance",
    role: "VP Engineering @ Vercel",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    quote: "Cleanest Tailwind v4 + Motion architecture we have evaluated for enterprise design systems.",
  },
  {
    name: "Sophia Zhang",
    role: "Founder @ Raycast Ext",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    quote: "The keyboard navigation and ARIA attribute defaults save us countless QA regression hours.",
  },
]

export default function InfiniteSliderHoverPause() {
  return (
    <div className="w-full max-w-3xl [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <InfiniteSlider speed={40} speedOnHover={0} gap={16}>
        {testimonials.map((item) => (
          <div
            key={item.name}
            className="flex w-72 shrink-0 flex-col justify-between rounded-xl border bg-card p-4 shadow-xs"
          >
            <p className="text-xs leading-relaxed text-muted-foreground">
              "{item.quote}"
            </p>
            <div className="mt-4 flex items-center gap-2.5 border-t pt-3">
              <Avatar className="size-7">
                <AvatarImage src={item.avatar} />
                <AvatarFallback>{item.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-xs font-semibold text-foreground">
                  {item.name}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {item.role}
                </div>
              </div>
            </div>
          </div>
        ))}
      </InfiniteSlider>
    </div>
  )
}

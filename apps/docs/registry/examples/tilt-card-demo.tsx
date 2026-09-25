import { TiltCard } from "@/registry/ui/tilt-card"

const prints = [
  {
    title: "冰川之上",
    edition: "限量 30 张",
    price: "¥680",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "雾中松林",
    edition: "限量 50 张",
    price: "¥520",
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "湖心晨光",
    edition: "限量 40 张",
    price: "¥590",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=700&q=80",
  },
]

export default function TiltCardDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-6 sm:grid-cols-3">
      {prints.map((print) => (
        <TiltCard
          key={print.title}
          maxTilt={10}
          hoverScale={1.03}
          glare
          className="bg-card rounded-lg border p-2.5"
        >
          <img
            src={print.image}
            alt={print.title}
            className="bg-muted aspect-[4/5] w-full rounded-md object-cover"
          />
          <div className="flex items-baseline justify-between px-1.5 pt-3 pb-1 [transform:translateZ(24px)]">
            <div>
              <p className="text-sm font-medium">{print.title}</p>
              <p className="text-muted-foreground text-xs">{print.edition}</p>
            </div>
            <p className="text-sm tabular-nums">{print.price}</p>
          </div>
        </TiltCard>
      ))}
    </div>
  )
}

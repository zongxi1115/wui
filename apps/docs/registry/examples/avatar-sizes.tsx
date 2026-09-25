import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar"

const sizes = [
  { size: "xs", label: "xs · 24px" },
  { size: "sm", label: "sm · 32px" },
  { size: "default", label: "default · 40px" },
  { size: "lg", label: "lg · 48px" },
] as const

export default function AvatarSizes() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-6">
      {sizes.map((item) => (
        <div key={item.size} className="flex flex-col items-center gap-2">
          <Avatar size={item.size}>
            <AvatarImage
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
              alt="沈知意"
            />
            <AvatarFallback>沈</AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground font-mono text-xs">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}

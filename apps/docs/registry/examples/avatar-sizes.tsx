import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar"

export default function AvatarSizes() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Avatar size="xs">
          <AvatarImage
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
            alt="Extra Small"
          />
          <AvatarFallback>XS</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">xs (24px)</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Avatar size="sm">
          <AvatarImage
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
            alt="Small"
          />
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">sm (32px)</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Avatar size="default">
          <AvatarImage
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
            alt="Default"
          />
          <AvatarFallback>DF</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">default (40px)</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Avatar size="lg">
          <AvatarImage
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
            alt="Large"
          />
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">lg (48px)</span>
      </div>
    </div>
  )
}

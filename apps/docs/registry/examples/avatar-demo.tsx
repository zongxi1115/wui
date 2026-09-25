import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/registry/ui/avatar"

export default function AvatarDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <Avatar>
        <AvatarImage
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
          alt="林晓雯"
        />
        <AvatarFallback>林</AvatarFallback>
        <AvatarBadge status="online" />
      </Avatar>

      <Avatar>
        <AvatarImage
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
          alt="陈嘉树"
        />
        <AvatarFallback>陈</AvatarFallback>
        <AvatarBadge status="busy" />
      </Avatar>

      <Avatar>
        <AvatarFallback className="bg-primary/10 text-primary">周</AvatarFallback>
        <AvatarBadge status="away" />
      </Avatar>

      <Avatar>
        <AvatarFallback>许</AvatarFallback>
        <AvatarBadge status="offline" />
      </Avatar>
    </div>
  )
}

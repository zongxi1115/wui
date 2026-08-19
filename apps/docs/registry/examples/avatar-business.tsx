import { MoreHorizontalIcon, ShieldCheckIcon } from "lucide-react"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/registry/ui/avatar"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"

const members = [
  {
    name: "Elena Rostova",
    email: "elena.r@acme.corp",
    role: "Lead Architect",
    status: "online" as const,
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    fallback: "ER",
  },
  {
    name: "Marcus Vance",
    email: "m.vance@acme.corp",
    role: "Product Designer",
    status: "busy" as const,
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    fallback: "MV",
  },
  {
    name: "Sophie Zhang",
    email: "sophie.z@acme.corp",
    role: "DevOps Engineer",
    status: "away" as const,
    src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    fallback: "SZ",
  },
]

export default function AvatarBusiness() {
  return (
    <div className="w-full max-w-md rounded-xl border border-border/70 bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div>
          <h4 className="text-sm font-semibold text-foreground">Project Collaborators</h4>
          <p className="text-xs text-muted-foreground">3 active members in this workspace</p>
        </div>
        <Badge variant="secondary" size="sm" className="gap-1">
          <ShieldCheckIcon className="size-3 text-emerald-500" /> Enterprise
        </Badge>
      </div>

      <div className="divide-y divide-border/40">
        {members.map((member) => (
          <div
            key={member.email}
            className="flex items-center justify-between py-3 gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar>
                <AvatarImage src={member.src} alt={member.name} />
                <AvatarFallback>{member.fallback}</AvatarFallback>
                <AvatarBadge status={member.status} />
              </Avatar>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-foreground truncate">
                    {member.name}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {member.role} · {member.email}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="size-8 shrink-0 text-muted-foreground">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

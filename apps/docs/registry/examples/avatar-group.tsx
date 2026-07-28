import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/registry/ui/avatar"

export default function AvatarGroupDemo() {
  return (
    <AvatarGroup aria-label="项目成员">
      <Avatar>
        <AvatarFallback>林</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-secondary text-secondary-foreground">
          陈
        </AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-primary text-primary-foreground">
          JW
        </AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+4</AvatarGroupCount>
    </AvatarGroup>
  )
}

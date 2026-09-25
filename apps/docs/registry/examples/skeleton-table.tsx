import { Skeleton } from "@/registry/ui/skeleton"

const columns = ["成员", "邮箱", "角色", "最近活跃"]
const rowWidths = [
  ["w-20", "w-36", "w-12", "w-14"],
  ["w-16", "w-40", "w-10", "w-12"],
  ["w-24", "w-32", "w-12", "w-16"],
  ["w-14", "w-44", "w-10", "w-12"],
  ["w-20", "w-36", "w-12", "w-14"],
]
const grid = "grid grid-cols-[1.4fr_2fr_0.8fr_0.9fr] items-center gap-4 px-4"

export default function SkeletonTable() {
  return (
    <div
      className="w-full max-w-2xl overflow-hidden rounded-lg border"
      aria-busy="true"
      aria-label="正在加载成员列表"
    >
      <div className="flex items-center justify-between border-b px-4 py-3">
        <p className="text-sm font-medium">团队成员</p>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>

      <div
        className={`${grid} bg-muted/40 text-muted-foreground h-9 border-b text-xs font-medium`}
      >
        {columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>

      <div className="divide-y">
        {rowWidths.map(([name, email, role, active], index) => (
          <div key={index} className={`${grid} h-12`}>
            <div className="flex items-center gap-2.5">
              <Skeleton shape="circle" className="size-7" />
              <Skeleton shape="text" className={`h-3.5 ${name}`} />
            </div>
            <Skeleton shape="text" className={`h-3.5 ${email}`} />
            <Skeleton className={`h-5 rounded-full ${role}`} />
            <Skeleton shape="text" className={`h-3.5 ${active}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

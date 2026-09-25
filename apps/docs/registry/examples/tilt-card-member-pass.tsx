import { TiltCard } from "@/registry/ui/tilt-card"

export default function TiltCardMemberPass() {
  return (
    <TiltCard
      maxTilt={14}
      hoverScale={1.04}
      perspective={1000}
      glare
      glareOpacity={0.5}
      className="aspect-[1.586] w-full max-w-sm rounded-xl bg-zinc-900 p-6 text-zinc-50 shadow-lg dark:bg-zinc-800"
    >
      <div className="flex h-full flex-col justify-between [transform-style:preserve-3d]">
        <div className="flex items-start justify-between [transform:translateZ(30px)]">
          <div>
            <p className="text-xs text-zinc-400">年度会员</p>
            <p className="mt-0.5 font-semibold tracking-tight">山野俱乐部</p>
          </div>
          <span className="rounded border border-zinc-600 px-1.5 py-0.5 font-mono text-[10px] text-zinc-300">
            GOLD
          </span>
        </div>

        <p className="font-mono text-lg tracking-[0.2em] text-zinc-200 [transform:translateZ(40px)]">
          6208 4417 0932
        </p>

        <div className="flex items-end justify-between text-xs [transform:translateZ(20px)]">
          <div>
            <p className="text-zinc-500">持卡人</p>
            <p className="mt-0.5 text-zinc-200">林知夏</p>
          </div>
          <div className="text-right">
            <p className="text-zinc-500">有效期至</p>
            <p className="mt-0.5 font-mono text-zinc-200">09 / 27</p>
          </div>
        </div>
      </div>
    </TiltCard>
  )
}

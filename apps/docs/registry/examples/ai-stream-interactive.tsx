"use client"

import * as React from "react"
import { PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react"

import { AiStream } from "@/registry/ui/ai-stream"
import { Button } from "@/registry/ui/button"
import { Slider } from "@/registry/ui/slider"
import { Switch } from "@/registry/ui/switch"

const ANSWER = `本次迭代把首屏请求从 14 个合并为 5 个，关键资源改为预加载，LCP 从 3.1s 降到 1.8s。

剩余的主要瓶颈在商品详情页：图片仍按原尺寸下发，建议接入按视口宽度裁切的图片服务，并为首屏以外的推荐位启用懒加载。预计可再节省约 420KB 传输体积。`

export default function AiStreamInteractive() {
  const [text, setText] = React.useState(ANSWER)
  const [playing, setPlaying] = React.useState(false)
  const [feather, setFeather] = React.useState([18])
  const [speed, setSpeed] = React.useState([36])
  const [caret, setCaret] = React.useState(true)
  const cursor = React.useRef(ANSWER.length)

  React.useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      cursor.current = Math.min(cursor.current + 2, ANSWER.length)
      setText(ANSWER.slice(0, cursor.current))
      if (cursor.current === ANSWER.length) setPlaying(false)
    }, speed[0])
    return () => window.clearInterval(timer)
  }, [playing, speed])

  function toggle() {
    if (!playing && cursor.current >= ANSWER.length) {
      cursor.current = 0
      setText("")
    }
    setPlaying((current) => !current)
  }

  function reset() {
    setPlaying(false)
    cursor.current = 0
    setText("")
  }

  const finished = text.length >= ANSWER.length

  return (
    <div className="mx-auto grid w-full max-w-2xl gap-6 md:grid-cols-[1fr_200px]">
      <div className="min-h-44 text-sm leading-7 text-foreground">
        {text ? (
          <AiStream
            isStreaming={playing}
            featherLength={feather[0]}
            caret={caret}
          >
            {text}
          </AiStream>
        ) : (
          <p className="text-muted-foreground">点击「开始」模拟模型逐字返回。</p>
        )}
      </div>

      <div className="flex flex-col gap-5 border-t pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
        <div className="flex items-center gap-2">
          <Button size="sm" className="flex-1" onClick={toggle}>
            {playing ? <PauseIcon /> : <PlayIcon />}
            {playing ? "暂停" : finished ? "重新播放" : "开始"}
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="size-8"
            aria-label="清空"
            disabled={!text}
            onClick={reset}
          >
            <RotateCcwIcon />
          </Button>
        </div>

        <label className="grid gap-2.5 text-xs">
          <span className="flex justify-between text-muted-foreground">
            羽化长度
            <span className="font-mono tabular-nums text-foreground">
              {feather[0]} 字
            </span>
          </span>
          <Slider
            min={0}
            max={40}
            step={1}
            value={feather}
            onValueChange={setFeather}
            showValue="never"
          />
        </label>

        <label className="grid gap-2.5 text-xs">
          <span className="flex justify-between text-muted-foreground">
            吐字间隔
            <span className="font-mono tabular-nums text-foreground">
              {speed[0]} ms
            </span>
          </span>
          <Slider
            min={16}
            max={120}
            step={4}
            value={speed}
            onValueChange={setSpeed}
            showValue="never"
          />
        </label>

        <label className="flex items-center justify-between text-xs text-muted-foreground">
          显示光标
          <Switch size="sm" checked={caret} onCheckedChange={setCaret} />
        </label>
      </div>
    </div>
  )
}

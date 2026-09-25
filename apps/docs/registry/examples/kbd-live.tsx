"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { Kbd, KbdGroup } from "@/registry/ui/kbd"
import { Textarea } from "@/registry/ui/textarea"

export default function KbdLive() {
  const reduceMotion = useReducedMotion()
  const [value, setValue] = React.useState("")
  const [shift, setShift] = React.useState(false)
  const [enter, setEnter] = React.useState(false)
  const [sent, setSent] = React.useState<string[]>([])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Shift") setShift(true)
    if (event.key !== "Enter") return
    setEnter(true)
    if (event.shiftKey || event.nativeEvent.isComposing) return
    event.preventDefault()
    const text = value.trim()
    if (!text) return
    setSent((prev) => [...prev.slice(-2), text])
    setValue("")
  }

  const handleKeyUp = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Shift") setShift(false)
    if (event.key === "Enter") setEnter(false)
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <ul className="flex min-h-20 flex-col items-end justify-end gap-1.5">
        <AnimatePresence initial={false}>
          {sent.map((text, index) => (
            <motion.li
              key={`${index}-${text}`}
              layout={!reduceMotion}
              initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="bg-primary text-primary-foreground max-w-[80%] rounded-lg px-3 py-1.5 text-sm whitespace-pre-wrap"
            >
              {text}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <Textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onBlur={() => {
          setShift(false)
          setEnter(false)
        }}
        rows={2}
        placeholder="输入消息，试试下方的快捷键"
        aria-label="消息内容"
      />

      <div className="text-muted-foreground flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <Kbd size="sm" pressed={enter && !shift}>
            Enter
          </Kbd>
          发送
        </span>
        <span className="flex items-center gap-1.5">
          <KbdGroup>
            <Kbd size="sm" pressed={shift}>
              Shift
            </Kbd>
            <Kbd size="sm" pressed={shift && enter}>
              Enter
            </Kbd>
          </KbdGroup>
          换行
        </span>
      </div>
    </div>
  )
}

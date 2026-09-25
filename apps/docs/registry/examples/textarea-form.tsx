"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import {
  Form,
  FormActions,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from "@/registry/ui/form"
import { Kbd } from "@/registry/ui/kbd"
import { Textarea } from "@/registry/ui/textarea"

const MIN_LENGTH = 15

export default function TextareaForm() {
  const formRef = React.useRef<HTMLFormElement>(null)
  const [feedback, setFeedback] = React.useState("")
  const [touched, setTouched] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const invalid = touched && feedback.trim().length < MIN_LENGTH

  return (
    <Form
      ref={formRef}
      animated={false}
      className="w-full max-w-md"
      onSubmit={(event) => {
        event.preventDefault()
        setTouched(true)
        if (feedback.trim().length < MIN_LENGTH) return
        setSubmitted(true)
        setFeedback("")
        setTouched(false)
      }}
    >
      <FormField invalid={invalid} required>
        <FormLabel>问题或建议</FormLabel>
        <FormControl>
          <Textarea
            value={feedback}
            onChange={(event) => {
              setFeedback(event.target.value)
              setSubmitted(false)
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault()
                formRef.current?.requestSubmit()
              }
            }}
            autoSize={{ minRows: 3, maxRows: 8 }}
            maxLength={300}
            showCount
            placeholder="在什么场景下遇到了什么问题，或希望新增哪些能力"
          />
        </FormControl>
        <FormMessage>至少输入 {MIN_LENGTH} 个字，帮助我们准确理解你的反馈</FormMessage>
        <FormDescription className="flex items-center gap-1">
          按 <Kbd size="sm">Ctrl</Kbd> + <Kbd size="sm">Enter</Kbd> 快速提交
        </FormDescription>
      </FormField>

      <FormActions className="justify-between">
        <span className="text-success text-xs font-medium" aria-live="polite">
          {submitted ? "已提交，感谢你的反馈" : null}
        </span>
        <Button type="submit">提交反馈</Button>
      </FormActions>
    </Form>
  )
}

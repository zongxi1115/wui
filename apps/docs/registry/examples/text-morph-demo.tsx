"use client"

import * as React from "react"

import { Button } from "@/registry/ui/button"
import { TextMorph } from "@/registry/ui/text-morph"

const labels = ["Continue", "Confirm", "Complete"]

export default function TextMorphDemo() {
  const [index, setIndex] = React.useState(0)

  return (
    <Button
      type="button"
      size="lg"
      className="w-32"
      onClick={() => setIndex((current) => (current + 1) % labels.length)}
    >
      <TextMorph as="span">{labels[index]}</TextMorph>
    </Button>
  )
}

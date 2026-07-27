import { TextLoop } from "@/registry/ui/text-loop"

export default function TextLoopDemo() {
  return (
    <p className="text-2xl font-medium tracking-tight">
      Designed to be{" "}
      <TextLoop className="text-muted-foreground" interval={1.8}>
        {[
          <span key="clear">clear.</span>,
          <span key="useful">useful.</span>,
          <span key="yours">yours.</span>,
        ]}
      </TextLoop>
    </p>
  )
}

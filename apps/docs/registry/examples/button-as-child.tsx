import { Button } from "@/registry/ui/button"

export default function ButtonAsChild() {
  return (
    <Button asChild>
      <a href="#button">Rendered as a link</a>
    </Button>
  )
}

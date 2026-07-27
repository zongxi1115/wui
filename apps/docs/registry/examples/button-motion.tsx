import { Button } from "@/registry/ui/button"

export default function ButtonMotion() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button motion>Press me</Button>
      <Button motion variant="secondary">
        Secondary
      </Button>
      <Button motion variant="outline">
        Outline
      </Button>
    </div>
  )
}

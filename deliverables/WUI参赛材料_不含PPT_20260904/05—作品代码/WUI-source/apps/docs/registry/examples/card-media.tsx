import { ArrowRightIcon } from "lucide-react"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
} from "@/registry/ui/card"

export default function CardMediaDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardMedia className="h-44">
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"
          alt="Abstract 3D Waves"
        />
      </CardMedia>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant="info" size="sm">Design System</Badge>
          <span className="text-xs text-muted-foreground">5 min read</span>
        </div>
        <CardTitle className="mt-1">Building Predictable Component Architecture</CardTitle>
        <CardDescription>
          Learn how to balance composability, performance, and accessibility in modern React libraries.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          Explore architectural decisions behind design tokens, slot patterns, and keyboard navigation.
        </p>
      </CardContent>
      <CardFooter className="justify-between pt-1">
        <span className="text-xs font-medium text-muted-foreground">By Sarah Chen</span>
        <Button variant="ghost" size="sm" className="gap-1 text-primary">
          Read article <ArrowRightIcon className="size-3.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ui/tabs"

export default function TabsUnderline() {
  return (
    <Tabs defaultValue="details" className="w-full max-w-md">
      <TabsList variant="underline"><TabsTrigger value="details">Details</TabsTrigger><TabsTrigger value="history">History</TabsTrigger><TabsTrigger value="access">Access</TabsTrigger></TabsList>
      <TabsContent value="details" className="text-sm text-muted-foreground">Project details appear here.</TabsContent>
      <TabsContent value="history" className="text-sm text-muted-foreground">Recent changes appear here.</TabsContent>
      <TabsContent value="access" className="text-sm text-muted-foreground">Member permissions appear here.</TabsContent>
    </Tabs>
  )
}

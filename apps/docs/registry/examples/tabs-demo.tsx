"use client"

import { ActivityIcon, Layers3Icon, SlidersHorizontalIcon } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ui/tabs"

export default function TabsDemo() {
  return (
    <Tabs defaultValue="overview" className="w-full max-w-lg">
      <TabsList>
        <TabsTrigger value="overview"><Layers3Icon />Overview</TabsTrigger>
        <TabsTrigger value="activity"><ActivityIcon />Activity</TabsTrigger>
        <TabsTrigger value="settings"><SlidersHorizontalIcon />Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview"><Panel value="68%" label="Weekly completion" detail="12% higher than last week" /></TabsContent>
      <TabsContent value="activity"><Panel value="1,284" label="Events processed" detail="Across 18 active workflows" /></TabsContent>
      <TabsContent value="settings"><Panel value="3" label="Active automations" detail="All systems are healthy" /></TabsContent>
    </Tabs>
  )
}

function Panel({ value, label, detail }: { value: string; label: string; detail: string }) {
  return (
    <div className="border-t px-1 py-5">
      <p className="text-4xl font-semibold tracking-[-0.05em]">{value}</p>
      <p className="mt-2 text-sm font-medium">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  )
}

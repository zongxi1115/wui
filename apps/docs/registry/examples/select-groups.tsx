import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/registry/ui/select"

export default function SelectGroups() {
  return (
    <Select defaultValue="design">
      <SelectTrigger><SelectValue placeholder="Choose a team" /></SelectTrigger>
      <SelectContent>
        <SelectGroup><SelectLabel>Creative</SelectLabel><SelectItem value="design">Design</SelectItem><SelectItem value="brand">Brand</SelectItem></SelectGroup>
        <SelectSeparator />
        <SelectGroup><SelectLabel>Engineering</SelectLabel><SelectItem value="web">Web</SelectItem><SelectItem value="platform">Platform</SelectItem></SelectGroup>
      </SelectContent>
    </Select>
  )
}

import { Switch } from "@/registry/ui/switch"

export default function SwitchSizes() {
  return (
    <div className="flex items-center gap-5">
      <Switch size="sm" defaultChecked aria-label="Small switch" />
      <Switch defaultChecked aria-label="Default switch" />
      <Switch size="lg" defaultChecked aria-label="Large switch" />
    </div>
  )
}

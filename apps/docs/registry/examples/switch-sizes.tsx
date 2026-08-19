import { Switch } from "@/registry/ui/switch"

export default function SwitchSizes() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
      <div className="flex items-center gap-2.5">
        <Switch size="sm" id="switch-size-sm" defaultChecked />
        <label htmlFor="switch-size-sm" className="text-xs font-medium cursor-pointer">
          小号 (sm)
        </label>
      </div>

      <div className="flex items-center gap-2.5">
        <Switch size="default" id="switch-size-default" defaultChecked />
        <label htmlFor="switch-size-default" className="text-sm font-medium cursor-pointer">
          默认 (default)
        </label>
      </div>

      <div className="flex items-center gap-2.5">
        <Switch size="lg" id="switch-size-lg" defaultChecked />
        <label htmlFor="switch-size-lg" className="text-base font-medium cursor-pointer">
          大号 (lg)
        </label>
      </div>
    </div>
  )
}

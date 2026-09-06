import { Switch } from "@/registry/ui/switch"

export default function SwitchDisabled() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
      <div className="flex items-center gap-3">
        <Switch id="switch-disabled-off" disabled />
        <label
          htmlFor="switch-disabled-off"
          className="text-sm font-medium text-muted-foreground cursor-not-allowed"
        >
          禁用（未选中）
        </label>
      </div>

      <div className="flex items-center gap-3">
        <Switch id="switch-disabled-on" defaultChecked disabled />
        <label
          htmlFor="switch-disabled-on"
          className="text-sm font-medium text-muted-foreground cursor-not-allowed"
        >
          禁用（已选中）
        </label>
      </div>
    </div>
  )
}

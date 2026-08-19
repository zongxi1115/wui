import { Switch } from "@/registry/ui/switch"

export default function SwitchWithLabel() {
  return (
    <div className="w-full max-w-md rounded-lg border p-4">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor="marketing-emails" className="flex flex-col gap-1 cursor-pointer select-none">
          <span className="text-sm font-medium">营销邮件推送</span>
          <span className="text-xs text-muted-foreground">
            接收有关新功能、产品更新以及活动促销的电子邮件通知。
          </span>
        </label>
        <Switch id="marketing-emails" defaultChecked />
      </div>
    </div>
  )
}

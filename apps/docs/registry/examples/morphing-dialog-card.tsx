import { ArrowUpRightIcon, CreditCardIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from "@/registry/ui/morphing-dialog"

const details = [
  ["本月额度", "¥50,000.00"],
  ["已使用", "¥14,250.00（28.5%）"],
  ["持卡成员", "市场部 · 6 人"],
  ["账单日", "每月 1 日"],
]

export default function MorphingDialogCard() {
  return (
    <div>
      <MorphingDialog>
        <MorphingDialogTrigger className="group flex w-72 flex-col items-stretch gap-4 rounded-lg p-4 text-left">
          <span className="flex items-center justify-between">
            <CreditCardIcon className="text-muted-foreground size-5" />
            <span className="text-muted-foreground font-mono text-xs">
              ···· 4242
            </span>
          </span>
          <span>
            <span className="text-muted-foreground block text-xs">
              市场部费用卡
            </span>
            <span className="mt-1 block text-xl font-semibold tabular-nums tracking-tight">
              ¥14,250.00
            </span>
          </span>
          <span className="text-muted-foreground flex items-center justify-between text-xs">
            剩余额度 ¥35,750.00
            <span className="text-foreground flex items-center gap-0.5">
              详情
              <ArrowUpRightIcon className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </span>
        </MorphingDialogTrigger>

        <MorphingDialogContent className="max-w-md">
          <MorphingDialogTitle>市场部费用卡</MorphingDialogTitle>
          <MorphingDialogSubtitle className="text-muted-foreground">
            账期 9 月 1 日 – 9 月 30 日
          </MorphingDialogSubtitle>
          <MorphingDialogDescription>
            查看本期额度使用情况与持卡成员，超出额度的消费需要部门负责人审批。
          </MorphingDialogDescription>

          <dl className="mt-5 divide-y border-y text-sm">
            {details.map(([label, value]) => (
              <div key={label} className="flex justify-between py-2.5">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex justify-end gap-2">
            <MorphingDialogClose asChild>
              <Button variant="ghost" size="sm">
                关闭
              </Button>
            </MorphingDialogClose>
            <Button size="sm">调整额度</Button>
          </div>
          <MorphingDialogClose />
        </MorphingDialogContent>
      </MorphingDialog>
    </div>
  )
}

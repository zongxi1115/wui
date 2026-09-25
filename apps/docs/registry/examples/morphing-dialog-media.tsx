import { Button } from "@/registry/ui/button"
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from "@/registry/ui/morphing-dialog"

export default function MorphingDialogMedia() {
  return (
    <div>
      <MorphingDialog>
        <MorphingDialogTrigger className="flex w-72 flex-col items-stretch overflow-hidden rounded-lg p-0 text-left">
          <span className="block aspect-[4/3] overflow-hidden">
            <MorphingDialogImage
              src="/wui/demo/field-notes/cliff-horizon.jpg"
              alt="悬崖与海平线"
              className="size-full"
            />
          </span>
          <span className="block p-3">
            <span className="block text-sm font-medium">海平线以北</span>
            <span className="text-muted-foreground mt-0.5 block text-xs">
              摄影集 · 24 张
            </span>
          </span>
        </MorphingDialogTrigger>

        <MorphingDialogContent
          className="max-w-lg"
          media={
            <>
              <div className="aspect-[4/3]">
                <MorphingDialogImage
                  src="/wui/demo/field-notes/cliff-horizon.jpg"
                  alt="悬崖与海平线"
                  className="size-full"
                />
              </div>
              <MorphingDialogClose className="bg-background/80 text-foreground hover:bg-background" />
            </>
          }
        >
          <MorphingDialogTitle>海平线以北</MorphingDialogTitle>
          <MorphingDialogSubtitle className="text-muted-foreground">
            拍摄于 2025 年冬 · 北大西洋沿岸
          </MorphingDialogSubtitle>
          <MorphingDialogDescription>
            一组关于风、岩石与光线的长期记录。封面图从卡片中的位置平滑放大到弹窗，关闭时再原路收回。
          </MorphingDialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <MorphingDialogClose asChild>
              <Button variant="ghost" size="sm">
                关闭
              </Button>
            </MorphingDialogClose>
            <Button size="sm">查看全部</Button>
          </div>
        </MorphingDialogContent>
      </MorphingDialog>
    </div>
  )
}

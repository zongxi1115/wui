"use client"

import { Button } from "@/registry/ui/button"
import { MessageProvider, useMessage } from "@/registry/ui/message"

export default function MessageDemo() {
  return (
    <MessageProvider>
      <MessageTypeButtons />
    </MessageProvider>
  )
}

function MessageTypeButtons() {
  const message = useMessage()

  return (
    <div className="flex w-full max-w-xl flex-wrap justify-center gap-2.5">
      <Button
        variant="outline"
        size="sm"
        onClick={() => message.info("新功能已灰度发布，可在设置中开启。")}
      >
        信息提示 (Info)
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => message.success("配置更改已成功保存！")}
      >
        成功提示 (Success)
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => message.warning("网络连接较慢，正在尝试重连...")}
      >
        警告提示 (Warning)
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => message.error("数据加载失败，请检查网络权限。")}
      >
        错误提示 (Error)
      </Button>
    </div>
  )
}

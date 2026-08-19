"use client"

import * as React from "react"
import { RefreshCwIcon } from "lucide-react"

import { Alert } from "@/registry/ui/alert"
import { Button } from "@/registry/ui/button"

export default function AlertDismissible() {
  const [visible, setVisible] = React.useState(true)

  return (
    <div className="grid w-full max-w-lg gap-3">
      <Alert
        visible={visible}
        onVisibleChange={setVisible}
        closable
        variant="info"
        title="临时维护通知"
      >
        系统将于本周日凌晨 02:00 进行数据库只读升级，预计耗时 30 分钟。
      </Alert>

      {!visible ? (
        <Button
          variant="outline"
          size="sm"
          className="w-fit gap-1"
          onClick={() => setVisible(true)}
        >
          <RefreshCwIcon className="size-3.5" /> 重新显示提示
        </Button>
      ) : null}
    </div>
  )
}

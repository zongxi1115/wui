"use client"

import * as React from "react"

import { Steps } from "@/registry/ui/steps"

const items = [
  { title: "创建项目", description: "设置名称与所属团队" },
  { title: "连接数据源", description: "授权生产数据库的只读访问" },
  { title: "邀请成员", description: "为协作者分配角色" },
  { title: "发布", description: "检查配置并开放访问" },
]

export default function StepsVertical() {
  const [current, setCurrent] = React.useState(1)

  return (
    <div className="w-full max-w-sm">
      <Steps
        items={items}
        current={current}
        orientation="vertical"
        onCurrentChange={setCurrent}
      />
    </div>
  )
}

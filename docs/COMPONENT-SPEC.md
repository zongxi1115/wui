# 组件新增规范（wui）

本文档定义在 **wui** 组件库中新增一个组件的完整流程与规范。目标：任何人按此规范新增的组件，都能① 通过 registry 被 CLI 按需拉取、② 在文档站正确渲染（实时预览 + 源码 + 属性/事件表）、③ 风格与既有组件保持一致。

> TL;DR：`pnpm --filter docs gen:component <name>` 一键生成骨架 → 填代码/文档 → `pnpm --filter docs registry:build` → 本地预览 & `wui add` 验证。

---

## 0. 目录与命名

| 内容 | 位置 | 命名 |
|---|---|---|
| 组件源码（基础 UI） | `apps/docs/registry/ui/<name>.tsx` | 文件 kebab-case，导出 PascalCase |
| 组件源码（复合组件） | `apps/docs/registry/components/<name>.tsx` | 同上 |
| 工具函数/hook | `apps/docs/registry/lib/*`、`apps/docs/registry/hooks/*` | — |
| 示例 demo | `apps/docs/registry/examples/<name>-*.tsx` | `<name>-demo.tsx` 为主示例，其余按用途命名 |
| 文档页 | `apps/docs/content/docs/components/<name>.mdx` | — |
| registry 登记 | `apps/docs/registry.json` 的 `items[]` | `name` = kebab-case |

**导入约定（重要）**：registry 源码内部一律用 `@/registry/...` 前缀互相引用：

- `@/registry/lib/utils` → `cn`
- `@/registry/ui/<x>` → 其他 UI 组件
- `@/registry/components/<x>`、`@/registry/hooks/<x>`

CLI 在 `wui add` 时会把这些前缀改写成使用者 `wui.json` 里配置的 alias（默认 `@/lib/utils`、`@/components/ui/...` 等）。**不要**在源码里直接写 `@/components/...`，否则拉取到别人项目会错位。

---

## 1. 代码规范

以现有 `registry/ui/button.tsx` 为范本，遵循 **React 19 + Radix + Tailwind v4 + cva** 写法：

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/lib/utils"

const badgeVariants = cva("inline-flex items-center rounded-md ...", {
  variants: {
    variant: { default: "...", secondary: "...", destructive: "..." },
  },
  defaultVariants: { variant: "default" },
})

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
```

必须遵守：

1. **不使用 `forwardRef`**（React 19 中 `ref` 已是普通 prop）；组件写成普通函数，props 用 `React.ComponentProps<...>`。
2. **变体用 `cva`**，并 `export` variants 函数（如 `badgeVariants`），供他人复用。
3. **每个可样式化的元素挂 `data-slot="<name>"`**（复合组件每个部件都挂，如 `dialog-header`）。
4. **`className` 合并顺序**：`cn(variants({ ..., className }))` —— 使用者传入的 `className` 放最后，冲突时用户覆盖。
5. **交互/带状态的组件**基于 Radix（统一包 `radix-ui`）：`import { Dialog as DialogPrimitive } from "radix-ui"`，无障碍交给 Radix。这类文件顶部加 `"use client"`。
6. **`asChild`**：需要“渲染成子元素”的组件用 Radix `Slot`：`const Comp = asChild ? Slot.Root : "button"`。
7. **受控/非受控**：透传 Radix 的 `open`/`defaultOpen`/`onOpenChange` 等，不要自造状态覆盖。
8. **主题变量**：只用语义 token（`bg-primary`、`text-muted-foreground`、`border` 等），不要硬编码颜色；token 定义见 `apps/docs/app/global.css`。
9. 图标统一用 `lucide-react`。

---

## 2. 在 registry.json 登记

在 `apps/docs/registry.json` 的 `items[]` 增加一项：

```jsonc
{
  "name": "badge",
  "type": "registry:ui",          // ui | component | lib | hook | block | page | file
  "title": "Badge",
  "description": "小标签，用于状态或分类。",
  "dependencies": ["class-variance-authority"],   // 需要安装的 npm 包
  "registryDependencies": ["utils"],               // 依赖的其他 registry 组件（会递归拉取）
  "files": [{ "path": "registry/ui/badge.tsx", "type": "registry:ui" }]
}
```

- **`type` 决定落地目录**：`registry:ui` → 使用者的 `components/ui/`；`registry:component` → `components/`；`registry:lib` → `lib/`；`registry:hook` → `hooks/`。`registry:page`/`registry:file` 必须显式写 `target`。
- **`dependencies`**：组件用到的 npm 包（`radix-ui`、`lucide-react`、`class-variance-authority`…）。`clsx`/`tailwind-merge` 由 `utils` 带入。
- **`registryDependencies`**：组件内部 `import` 了哪些其它 registry 组件，就在这里列它们的 `name`（如复合组件 `confirm-dialog` 列 `["dialog", "button"]`）。CLI 会递归解析并去重。
- 需要注入主题变量时用 `cssVars` / `css`（Tailwind v4）。

---

## 3. 示例（demo）要求

- 至少提供 `registry/examples/<name>-demo.tsx` 作为主示例。
- 每个 demo **默认导出**一个无参组件（`export default function XxxDemo() { ... }`）—— 构建脚本据此生成实时预览。
- 变体/尺寸/组合等各写一个 demo（如 `button-variants.tsx`、`button-sizes.tsx`），供文档“拓展使用”小节引用。
- demo 里引用组件同样用 `@/registry/...` 前缀。

---

## 4. 文档要求（5 个必备小节）

`content/docs/components/<name>.mdx` 必须包含以下 5 个小节（顺序固定，可中英双标题）。可用 MDX 组件：`<ComponentPreview name>`、`<ComponentSource name title>`、`<CodeTabs command>`、`<PropsTable data>`、`<Steps>/<Step>`、`<Callout>`。

1. **基础示例** —— `<ComponentPreview name="<name>-demo" />` + 安装命令 `<CodeTabs command="wui@latest add @wui/<name>" />` + 源码 `<ComponentSource name="<name>" />`。
2. **组件作用** —— 用途、适用/不适用场景。
3. **组件属性** —— `<PropsTable>` 列出每个 prop 的 名称/类型/默认值/说明。
4. **事件** —— 回调与透传的原生事件（`onClick`、`onOpenChange`…）。
5. **拓展使用** —— 变体、组合、`asChild` 等进阶示例，各配 `<ComponentPreview>`。

范本见 `content/docs/components/button.mdx`。生成器会产出带 5 小节 + TODO 的骨架。

> frontmatter 需含 `title`、`description`，建议加 `component: <name>`。新页会自动加入 `content/docs/components/meta.json` 的 `pages`（生成器已处理）；手写时记得补上以出现在侧边栏。

---

## 5. 新增组件 Checklist

```text
□ 1. pnpm --filter docs gen:component <name> [--type ui|component]
      → 生成 组件 / <name>-demo / <name>.mdx，并写入 registry.json + 侧边栏
□ 2. 编写组件源码（cva + cn + data-slot，见 §1）
□ 3. 补充/新增 demo（examples/<name>-*.tsx）
□ 4. 完善文档 5 小节（填 §4 的 TODO）
□ 5. 核对 registry.json：type / dependencies / registryDependencies
□ 6. pnpm --filter docs registry:build      # 生成 public/r/*.json + __index__/__components__
□ 7. pnpm --filter docs dev                  # 本地预览：实时渲染 + 源码 + 属性表
□ 8. 用 CLI 验证拉取：
      node packages/cli/dist/index.js add @wui/<name> --cwd <某测试项目> --dry-run
□ 9. pnpm --filter @wui/cli typecheck / test（若改动了 CLI）
```

---

## 6. 脚手架（generator）

```bash
# 生成一个名为 badge 的 UI 组件骨架
pnpm --filter docs gen:component badge

# 生成一个复合组件（落到 registry/components/）
pnpm --filter docs gen:component confirm-banner --type component
```

生成器（`apps/docs/scripts/new-component.mts`）会：创建组件文件、`<name>-demo.tsx`、`<name>.mdx`（含 5 小节骨架），并把条目写入 `registry.json` 与组件侧边栏 `meta.json`。已存在的文件会跳过，不会覆盖。

---

## 7. 构建产物与拉取原理（背景）

- `registry:build` 读取 `registry.json`，把每个组件的源码 **inline 成字符串** 写入 `apps/docs/public/r/<name>.json`（遵循 shadcn `registry-item.json` schema），同时生成文档站预览用的 `registry/__index__.tsx`（元数据）与 `registry/__components__.tsx`（`name → React.lazy` 懒加载映射）。
- 使用者侧 `wui add @wui/<name>`：CLI 拉取该 JSON → 递归解析 `registryDependencies` 并去重 → 安装 npm 依赖 → 改写 `@/registry/...` import 为使用者 alias → 写入目标目录。
- 因为遵循 shadcn schema，官方 `npx shadcn@latest add @wui/<name>` 也能拉取（前提：使用者已在 `components.json` 配好 `@wui` 命名空间）。
```

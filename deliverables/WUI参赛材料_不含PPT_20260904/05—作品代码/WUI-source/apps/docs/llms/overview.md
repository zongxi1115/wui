# wui — 给大模型的使用说明

wui 是 shadcn 风格的 React 组件库：组件源码会被**复制进使用者的项目**，而不是作为
黑盒依赖安装。因此生成代码时，组件是本地文件，可以直接读改。

## 技术栈

React 19 · TypeScript · Tailwind CSS v4（oklch，CSS-first，无 tailwind.config.js） ·
Radix（统一从 `radix-ui` 包导入） · `class-variance-authority` · `motion`（不是
`framer-motion`）。

## 安装组件

```bash
pnpm dlx @wui-design/cli@latest add @wui/<name>     # 或者：pnpm dlx shadcn@latest add <registry>/<name>.json
```

`add` 会递归解析 registry 依赖，并自动安装所需 npm 包。所有组件都依赖 `utils`
（提供 `cn()`），`utils` 依赖 `theme`（提供设计 token）。

## 导入路径

组件落盘到使用者项目后的默认位置（由其 `wui.json` 的 aliases 决定，默认如下）：

| registry 类型        | 落盘目录         | 导入写法                                                      |
| -------------------- | ---------------- | ------------------------------------------------------------- |
| `registry:ui`        | `components/ui/` | `import { Button } from "@/components/ui/button"`             |
| `registry:component` | `components/`    | `import { ConfirmDialog } from "@/components/confirm-dialog"` |
| `registry:lib`       | `lib/`           | `import { cn } from "@/lib/utils"`                            |

## 硬性规则

1. **不要臆造 prop。** 只使用 `wui_get_component` 返回的 props 表里存在的属性；
   组件都会把剩余 props 展开到底层 DOM 元素，所以原生属性可以直接传。
2. **用语义 token，不要用调色板色值。** 写 `bg-primary text-primary-foreground`、
   `border-border`、`text-muted-foreground`，不要写 `bg-blue-500`、`text-gray-400`、
   `#fff`。token 清单见 `wui_get_theme_tokens`。深色模式由 token 自动处理，
   不需要成对写 `dark:` 变体。
3. **复用组件的 variant/size，不要用 className 覆盖外观。** 需要新外观时优先扩展
   组件内部的 `cva` 定义。
4. **动效走组件自带开关**（如 Button 的 `motion` / `ripple`），并且必须尊重
   `prefers-reduced-motion`；组件内部已处理。
5. **不确定用法时先看示例**，用 `wui_get_example` 取真实示例代码，而不是凭印象生成。

## 建议的调用顺序

`wui_search_components`（按关键词找组件） → `wui_get_component`（拿 props 和用法约束）
→ `wui_get_example`（拿可参考的写法） → 只有需要理解/修改实现时才调
`wui_get_component_source`（源码较长）。

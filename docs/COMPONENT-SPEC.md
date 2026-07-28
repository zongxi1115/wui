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
8. **主题变量**：只用语义 token（`bg-primary`、`text-muted-foreground`、`border` 等），不要硬编码颜色；发布源、命名、变更与废弃规则见 [`docs/DESIGN-TOKENS.md`](./DESIGN-TOKENS.md)。
9. 静态图标统一用 `lucide-react`；需要图标内部路径运动时使用 `@animateicons/react/lucide`，并通过 `AnimatedIcon` 统一无障碍语义和播放控制。

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
3. **组件属性** —— 优先用 **`<PropsTable name="<name>" />`**：属性从组件 TS 类型 + TSDoc **自动解析**（见 §8），每个 prop 的类型/默认值/说明都来自代码。也可用 `<PropsTable data={[...]}/>` 手写。
4. **事件** —— 回调与透传的原生事件（`onClick`、`onOpenChange`…）。
5. **拓展使用** —— 变体、组合、`asChild` 等进阶示例，各配 `<ComponentPreview>`。

> 交互演示（可选但推荐）：`<Playground name="<name>" />` 会根据解析出的属性生成可调控件（联合类型→下拉、布尔→开关、字符串→输入框），docstring 作为每个控件的描述实时展示。用 `exclude={["asChild"]}` 隐藏不适合交互的属性。前提：该组件已在 `scripts/build-docgen.mts` 的 `PLAYGROUND` 列表中登记。

范本见 `content/docs/components/button.mdx`。生成器会产出带 5 小节 + TODO 的骨架。

> **这 5 小节同时喂给大模型。** `registry:build` 会把「组件作用」「事件」「拓展使用」
> 三节的正文、props 的 TSDoc、以及全部 demo 代码汇总成 MCP digest（见
> [`MCP.md`](./MCP.md)）。所以「组件作用」务必写清楚**什么时候用、什么时候不该用**——
> 这是模型最容易搞错、也最依赖文档的部分；写得含糊，AI 生成的代码就会选错组件。

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
□ 6. pnpm --filter docs registry:build      # 生成 public/r/*.json + __index__/__components__ + MCP digest
□ 7. pnpm --filter docs tokens:audit         # token 对称性、镜像、依赖和硬编码审计
□ 8. pnpm --filter docs dev                  # 本地预览：实时渲染 + 源码 + 属性表
□ 9. 用 CLI 验证拉取：
      node packages/cli/dist/index.js add @wui/<name> --cwd <某测试项目> --dry-run
□ 10. pnpm --filter @wui/cli typecheck / test（若改动了 CLI）
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

---

## 8. 属性自动解析与交互演示（docgen）

- `scripts/build-docgen.mts` 用 `react-docgen-typescript` 解析每个组件源码，提取**自有属性**（过滤掉继承的 DOM/aria 噪声）的 名称/类型/默认值/**docstring 描述**，并推导控件类型（联合字符串→`select`、布尔→`boolean`、数字→`number`、其余→`text`），产出 `registry/__props__.ts` 与 `registry/__playground__.tsx`。
- 因此**写好属性的 TSDoc 注释**即可自动获得属性表与演示控件的描述。属性最好声明在组件自有的 `interface XxxProps` 上（`ConfirmDialogProps` 是范本）；即便 `extends` 了 DOM 类型（如 Button / Motion），解析器也会保留自有属性并过滤噪声。
- `<PropsTable name="<name>" />` 读取解析结果渲染属性表；`<Playground name="<name>" />` 读取它生成可调控件（下拉 / 开关 / 输入框）并实时渲染真实组件，docstring 即控件描述。
- 让组件进入 Playground：在 `scripts/build-docgen.mts` 的 `PLAYGROUND` 数组登记 `{ name, file, export }`（组件需能独立渲染、接受文本 children）。
- `registry:build` 已串联 docgen（`build-registry && build-docgen`），一条命令全部生成。

---

## 9. 动效与交互规范（Motion & interaction）

组件不该「太过平淡」——恰当的过渡/微交互能让界面更有生命力；但动效要**有节制、分场合、可降级**。本节定义 wui 的动效原则与每类组件的取舍。

### 9.1 三条硬性原则

1. **必须尊重 `prefers-reduced-motion`。** 任何动效都要能优雅降级为「静态终态」。
   - JS 动效：用 `const reduceMotion = useReducedMotion()`（来自 `motion/react`），为真时渲染静态版本。范本见 `registry/ui/button.tsx`、`registry/ui/dialog.tsx`、`registry/ui/motion.tsx`、`registry/ui/shiny-button.tsx`。
   - 纯 CSS 动效：交给浏览器/`tw-animate-css` 自行响应减弱偏好即可（如各组件 hover/focus 的 `transition` 过渡）。
2. **基础组件默认走 CSS，效果超纲才引 `motion`。** 能用 CSS `transition` / `tw-animate-css` 表达的动效（颜色/阴影过渡、hover/focus 反馈），优先纯 CSS、不引入 `motion` 运行时。只有「弹簧手感」「涟漪」「持续动画」「从某元素位移/形变 morph 出来」这类 CSS 难以胜任的效果，才 opt-in 引入 `motion`，并在 `registry.json` 的 `dependencies` 里声明 `"motion"`（如 `dialog`、`button` 的 `motion`/`ripple`）。
3. **动效是 opt-in，不是默认强灌。** 除「进出场」这类组件本身语义需要的动画外，花哨微交互（涟漪、弹簧）用 `prop` 显式开启（如 Button 的 `motion` / `ripple`），让使用者按需取舍，且彼此**可组合**。

### 9.2 「加/不加」判断

| 该加 | 不该加 |
|---|---|
| 交互反馈：hover/press/focus 的颜色、位移、缩放 | 纯被动、需「隐入背景」的图层（水印、分隔线、骨架底纹） |
| 进出场：浮层/弹层的 fade + 位移 + 缩放 | 大面积重绘、持续动画会拖累性能或分散注意力的场景 |
| 引导视线：单个 CTA、空状态的点睛效果 | 一屏内多处同时持续动，互相打架、令人疲劳 |
| 链接/按钮：下划线滑入、渐变过渡 | 会伤害可读性或让核心内容「抖动」的地方 |

一句话：**动效服务于「反馈」「引导」「层级」，而不是为动而动。** 拿不准就先不加，或做成 opt-in prop。

### 9.3 各组件基线（现状 + 要求）

- **Button**（`registry/ui/button.tsx`）
  - 基础：`transition-[color,background-color,border-color,box-shadow]` 平滑过渡（不含 transform，避免与弹簧打架）。
  - `link` 变体：**下划线滑入动画 + 文字颜色渐变过渡**（hover 时下划线从右向左展开，紧贴文字、与 `size` 无关）。`asChild` 渲染真实 `<a>` 时降级为原生 `hover:underline`。
  - `motion`（opt-in，需 `motion`）：按压/悬浮弹簧微交互。
  - `ripple`（opt-in，需 `motion`）：Material 式点击涟漪，从指针处扩散；与 `motion` 可组合；`asChild` 时忽略。
- **Dialog**（`registry/ui/dialog.tsx`）
  - **从触发按钮「布局变换」出来**：打开时面板从触发按钮所在位置（缩小 + 透明）弹簧展开到居中静止态，关闭时缩回按钮——不是简单淡入。用 `motion`（`AnimatePresence` + Radix `forceMount`）实现，故 dialog 的 `dependencies` 含 `"motion"`。
  - 实现要点：① `Dialog` 根镜像一份 open 状态（不夺走受控调用方的所有权）以驱动 `AnimatePresence` 的进出场；② `DialogTrigger` 把 DOM `ref` 存进 context，`DialogContent` 打开时读取其 `getBoundingClientRect` 换算成相对视口中心的偏移作为动画起点；③ 居中改用外层 `flex` 容器承担（而非 content 上的 `translate-x/y-[-50%]`），把 transform 让给 morph 动画；content 需 `relative` 以锚定关闭按钮；④ `useReducedMotion` 为真时退化为纯淡入、无位移。
  - 这是「基础组件也可以引入 `motion`」的正例：当效果（此处的位移/形变 morph）超出 CSS `transition` 能力时，opt-in 引入 `motion` 并在 `registry.json` 声明依赖是允许的；能用 CSS 表达的仍优先 CSS。
- **Motion**（`registry/ui/motion.tsx`）：共享动画原语与 `presets`/`transitions`，是「需要 `motion` 运行时」的统一入口，供其他组件 `asChild` 复用。
- **Watermark**（`registry/ui/watermark.tsx`）：**刻意不加任何动效**。它是被动环境图层，动它会喧宾夺主、伤可读性、且大面积重绘无收益——典型的「不该加」。

### 9.4 Fancy · 效果组件栏目

面向「从 CodePen 搬来的炫酷效果」这类**展示型/花哨**组件，单独归入 **Fancy** 栏目。它们与核心组件共用同一套 registry + `wui add` 按需拉取流程，只是**允许更张扬、更有主见**，但仍受 §9.1 三条硬性原则约束（尤其必须能在减弱动效下降级）。范本：`registry/ui/shiny-button.tsx`（掠光按钮）。

新增一个 Fancy 组件，在 §5 常规流程之上只多两步：

```text
□ registry.json 该条目加 "categories": ["fancy"]
□ content/docs/components/meta.json 的 pages 里，在分隔符
  "---Fancy · 效果组件---" 之后加入该组件页
```

- **归类靠 `categories`，不新增 `type`。** 效果组件仍按落地目录选 `type`（通常 `registry:ui` → 使用者 `components/ui/`）；`"categories": ["fancy"]` 只是元数据分组，`registry:build` 会原样写入 `public/r/<name>.json`，供后续按分类筛选。
- **侧边栏分组靠 Fumadocs 分隔符。** `meta.json` 的 `pages` 支持 `"---标题---"` 分隔符（可选图标 `"---[icon]标题---"`），效果组件页放在该分隔符之后即自成一组。
- 其余（源码规范、demo、5 小节文档、docgen 属性表、`registry:build`）与普通组件完全一致——效果组件同样「支持按需拉取下载」。

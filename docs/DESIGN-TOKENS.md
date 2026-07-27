# WUI 设计 Token 治理规范

本文定义的是 **WUI 组件库对外提供的设计契约**。文档站自身的导航、代码高亮和排版变量不属于组件库 token。

## 1. 单一来源与分发

- `apps/docs/registry.json` 中的 `theme` 条目是组件库 token 的发布源，类型固定为 `registry:theme`。
- `apps/docs/app/global.css` 是文档预览镜像，必须与 `theme.cssVars` 保持一致。
- `utils` 依赖 `theme`，因此所有依赖 `utils` 的视觉组件都会递归携带主题。
- `wui add` 会把 `cssVars.light`、`cssVars.dark` 和 `cssVars.theme` 合并到 `wui.json` 配置的全局 CSS；带标记的区块可重复更新，不覆盖项目其他样式。
- 官方 shadcn CLI 也会按照 registry-item 的 `cssVars` 规范更新项目 CSS。

不要在组件文件、示例或文档页中复制一份新的主题值。

## 2. Token 分层

### 2.1 语义层：由 WUI 维护

组件只消费语义，不感知具体色相。

| 类别 | Token | 用途 |
|---|---|---|
| 页面 | `background` / `foreground` | 应用底色和主内容 |
| 容器 | `card` / `card-foreground` | 持久容器 |
| 浮层 | `popover` / `popover-foreground` | 菜单、选择器、浮层 |
| 主操作 | `primary` / `primary-foreground` | 主要动作和选中态 |
| 次操作 | `secondary` / `secondary-foreground` | 次要动作 |
| 弱化内容 | `muted` / `muted-foreground` | 辅助底色和次级内容 |
| 交互反馈 | `accent` / `accent-foreground` | Hover、选项聚焦 |
| 危险反馈 | `destructive` / `destructive-foreground` | 删除、失败、不可逆动作 |
| 信息反馈 | `info` / `info-foreground` | 中性通知和进度 |
| 成功反馈 | `success` / `success-foreground` | 完成、成功 |
| 警告反馈 | `warning` / `warning-foreground` | 风险提示、待处理 |
| 结构 | `border` / `input` / `ring` | 边界、输入轮廓、焦点 |
| 环境效果 | `overlay` / `shine` | 模态遮罩、受控高光 |

任何可能作为填充色的语义色都必须提供 `*-foreground` 配对。浅色和深色组必须包含相同的 key。

### 2.2 基础层：Tailwind 提供，WUI 约束用法

- 圆角统一从 `radius` 派生为 `radius-sm/md/lg/xl`；`rounded-full` 仅用于圆形控制和胶囊形态。
- 间距、字号、阴影和时长默认使用 Tailwind 标准刻度，不为同义值另造变量。
- 若同一个非颜色值在三个以上核心组件中表达同一语义，再提升为 WUI token；先复用，后抽象。
- 组件的光学修正可以使用任意值，但必须局限在组件 recipe 内，不能冒充全局 token。

### 2.3 组件层：recipe，不对外宣称为全局 token

Button 高度、Dialog 宽度、Slider 拇指尺寸等属于组件 recipe。它们可通过 `cva` 变体和 `className` 扩展，但不进入全局主题，除非已经成为跨组件语义。

## 3. 使用规则

允许：

- `bg-primary text-primary-foreground`
- `border-warning/30 text-warning`
- `bg-overlay`
- 布局尺寸、透明度和光学修正使用 Tailwind 标准值

禁止：

- 在核心组件写 `text-white`、`bg-black/50`、`text-emerald-500` 等原始颜色
- 在 TSX 中直接写 `#fff`、`rgb(...)`、`oklch(...)`
- 用 `primary` 同时代替 info、success、warning
- 只为浅色或只为深色增加 token

展示型 Fancy 组件确需特殊颜色时，也应先声明窄语义 token；无法复用的实验值必须在同一行添加 `wui-token-audit-allow` 注释并说明原因。

## 4. 新增与变更流程

### 新增

1. 证明现有语义无法表达需求，而不是因为想换一个色值。
2. 选择描述用途的名称，禁止用 `blue-500`、`dark-gray` 等视觉名称。
3. 同时定义 light、dark；填充色同时定义 foreground。
4. 在 `theme.cssVars.theme` 暴露 Tailwind v4 映射。
5. 同步文档站镜像，并运行 `pnpm --filter docs tokens:audit`。
6. 在真实组件状态中检查普通文字、图标、边框和焦点可见性。

### 修改

- 改值属于全库视觉变更，需要列出受影响组件和明暗模式。
- 改名属于破坏性变更；先新增新名称并迁移消费方，再进入废弃期。
- 不允许在一次组件修复中顺手改变无关 token。

### 废弃

1. 标记替代 token 和迁移原因。
2. 迁移 registry、示例和文档。
3. 至少保留一个发布周期后再删除旧 token。
4. 删除前通过审计确认没有消费方。

## 5. 可访问性底线

- 正文与底色的目标对比度不低于 4.5:1；大号文字不低于 3:1。
- 边界、图标、焦点和状态表达不能只依靠色相差异。
- 透明度修饰后的最终组合也需要检查，不能只验证 token 原值。
- `ring` 必须在浅色、深色和错误状态下可见。
- 动效 token 或 recipe 必须尊重 `prefers-reduced-motion`。

## 6. 自动治理

运行：

```bash
pnpm --filter docs tokens:audit
```

审计会检查：

- registry 主题结构和 light/dark key 对称性；
- 语义填充色的 foreground 配对；
- 文档站镜像是否与发布 token 漂移；
- `utils -> theme` 分发依赖是否存在；
- 组件源码中的原始 Tailwind 色板和 CSS 颜色字面量。

`tokens:audit` 是新增组件和 token 变更的必过门槛；它不替代真实浏览器中的视觉与对比度检查。

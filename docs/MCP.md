# MCP —— 把组件库接给大模型

wui 通过 [Model Context Protocol](https://modelcontextprotocol.io) 把组件的
**props、用法约束、示例代码和设计 token** 暴露给 AI 编码工具（Claude Code、Cursor、
Windsurf 等），让模型不再靠记忆猜 API。

## 使用方

### 方式一：远程 HTTP（零安装，推荐）

```bash
claude mcp add --transport http wui https://<你的站点>/api/mcp
```

Cursor / Windsurf 等在其 MCP 配置里填：

```json
{ "mcpServers": { "wui": { "url": "https://<你的站点>/api/mcp" } } }
```

组件更新后重新部署即刻生效，使用方不需要升级任何东西。

### 方式二：stdio（可指定本地 registry）

```bash
claude mcp add wui -- pnpm dlx @wui-design/mcp@latest
```

```json
{
  "mcpServers": {
    "wui": { "command": "pnpm", "args": ["dlx", "@wui-design/mcp@latest"] }
  }
}
```

可选参数：

默认仍会读取在线 registry。离线使用或锁定组件数据时，需通过 `--dir` 指向本地快照；固定 MCP 包版本只会固定服务端代码。

| 参数               | 环境变量           | 说明                                          |
| ------------------ | ------------------ | --------------------------------------------- |
| `--registry <url>` | `WUI_REGISTRY_URL` | 指向自建 registry 的 `/r` 目录                |
| `--dir <path>`     | `WUI_REGISTRY_DIR` | 直接读本地 `apps/docs/public/r`，开发本库时用 |

在本仓库里调试：

```bash
pnpm --filter docs registry:build
pnpm --filter @wui-design/mcp build
node packages/mcp/dist/index.js --dir apps/docs/public/r
```

### 方式三：llms.txt（不支持 MCP 的工具）

站点会生成 `https://<你的站点>/llms.txt`，包含组件清单和使用规则，可直接粘给任意模型。

## 工具

分层设计，让模型按需取用而不是一次塞满上下文：

| 工具                       | 用途                                   | 典型体积       |
| -------------------------- | -------------------------------------- | -------------- |
| `wui_overview`             | 技术栈、导入路径、token 约定、硬性规则 | ~600 token     |
| `wui_search_components`    | 按关键词搜索组件，默认最多 12 条       | 取决于结果数   |
| `wui_get_component`        | 分组 API、关联类型、使用约束和示例名   | 随组合组件规模变化 |
| `wui_get_example`          | 单个示例的完整代码                     | ~200 token     |
| `wui_get_component_source` | 组件实现源码（按需，较大）             | 1k–8k token    |
| `wui_get_theme_tokens`     | 语义 token 及明暗色值                  | ~1.5k token    |

建议调用链：`wui_search_components` → `wui_get_component` → `wui_get_example`，
只有需要理解或修改实现时才调 `wui_get_component_source`。

## 数据来源

MCP 不额外维护内容，全部来自已有的构建产物。`pnpm --filter docs registry:build`
的第三步 `build-llms.mts` 负责汇总：

```
registry.json              → 名称/描述/依赖/安装命令/设计 token
registry/__api__.json      → 按导出组件分组的 props、Radix 行为属性、关联数据类型
registry/__props__.json    → 文档 Playground 的精简属性表
content/docs/<name>.mdx    → 使用场景、事件表、扩展示例和无障碍约束
registry/examples/*.tsx    → 示例代码（导入路径改写为使用方的 @/components/ui/*）
registry/ui/<name>.tsx     → 导出名，用于生成 import 语句
        ↓
public/r/llms/{index,overview,<name>}.json
public/r/llms/examples/{index,<example-name>}.json
public/llms.txt
```

> 给模型看的 digest 刻意与 CLI 用的 `public/r/<name>.json` 分开：后者内联了完整源码
> （4–8k token），模型只想知道 Button 有哪些 variant 时不该付这个代价。

因此**新增组件不需要碰 MCP**：按 [`COMPONENT-SPEC.md`](./COMPONENT-SPEC.md) 正常
写代码、写 5 小节文档、跑 `registry:build`，组件就会自动出现在 MCP 里。

digest 的质量直接取决于文档质量：

- 「组件作用」写清楚**什么时候该用、什么时候不该用**——这是模型最缺、最容易搞错的信息。
- props 的 TSDoc 注释会原样出现在 MCP 输出里，写全默认值和约束。
- 每个有代表性的用法都配一个 example，模型会优先照抄示例。

使用说明支持「使用场景与设计规范」「使用场景」「使用建议」「组件作用」等既有标题，
并规范化 `事件 Events`、`事件 · Events` 这类双语标题。已有文档未提取到使用说明时，
生成命令会报错，避免标题变动后悄悄丢失内容。字面量 `PropsTable data` 使用 TypeScript
解析器转成可读条目，不执行 MDX 表达式。

API 摘要保留 Radix 行为属性，省略常规 DOM 属性；属性透传由具体实现决定。
`examples.json` 继续为旧版 stdio 客户端生成，新客户端只读取示例索引和目标示例。

## 实现

```
packages/mcp/
├─ src/core/          # 与传输无关：registry 读取 + 6 个工具的定义和渲染
│  ├─ registry.ts     # Loader 抽象（fetch / fs）+ 进程内缓存 + 名称纠错
│  ├─ tools.ts        # 工具定义、schema 校验、搜索排序、markdown 渲染
│  └─ types.ts
├─ src/server.ts      # 共用 SDK Server、初始化说明和工具元信息
├─ src/http.ts        # SDK WebStandardStreamableHTTPServerTransport
└─ src/index.ts       # stdio 入口（@modelcontextprotocol/sdk）

apps/docs/app/api/mcp/route.ts   # Streamable HTTP 入口，复用同一份 core
```

两个传输共用 `core` 和 SDK Server 工厂，工具行为和初始化说明一致。`core`、`http` 以 TypeScript 源码形式导出
（配合 `transpilePackages`），因此改动 core 后 docs 站不需要先构建 `@wui-design/mcp`。

HTTP 端点是无状态的：每个请求自包含，直接返回 JSON 而不是 SSE 流（协议允许），
所以不需要会话存储，可以直接跑在 serverless 上。

stdio 的解析结果共享 60 秒缓存窗口，过期后统一清空，在下一次调用时读取新数据。
HTTP 部署内的 registry 文件不可变，因此缓存随部署进程存在。远程读取超时为 10 秒。
搜索按名称精确命中、前缀、名称包含、标题/类别、描述/属性排序；所有工具标记为只读，
使用与 `tools/list` 一致的 JSON Schema 校验参数。

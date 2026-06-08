---
description: 在 scene-forge 项目中从零开发一个新的 UI 场景，包含建分支、通用组件提取、场景文件编写、路由注册全流程
allowed-tools: Bash, Read, Write, Edit
argument-hint: <SceneName>
---

场景名：$ARGUMENTS（PascalCase，如 `CardGrid`）。将其转为 kebab-case 备用（`CardGrid` → `card-grid`）。

严格按以下步骤执行，不得跳过或合并。

## Step 1：需求与技术方案确认

根据场景描述判断是否存在**非显而易见的技术决策**，如有则向用户确认，例如：

- 虚拟滚动：用库（`react-virtuoso` / `react-window`）还是自实现？
- 拖拽排序：用 `@dnd-kit` 还是原生 Drag API？
- 富文本：用哪个编辑器？

**若场景简单明确（如普通列表、表单、卡片网格），跳过此步骤直接进入 Step 2。**

## Step 2：创建场景分支

```bash
git checkout -b scene/<kebab-name>
```

## Step 3：识别通用 UI 原语

在动手写代码前，分析场景所需 UI 结构，**提前**区分：

| 判断 | 放哪里 |
|------|--------|
| 纯 UI 容器/布局，不含业务字段，其他场景可复用 | `src/ui/` |
| 与本场景数据结构强绑定，其他场景不会用 | `src/scenes/<SceneName>/` |

**必须对照以下常见布局模式逐一检查**，命中即提取：

| 模式 | 典型代码气味 | 参考命名 |
|------|------------|---------|
| 左固定 + 右自适应（Media Object） | `display:flex` + 左侧 `flex-shrink:0` + 右侧 `flex:1; min-width:0` | `MediaRow` |
| 标题 + 副文本竖排 | 两行文字上下叠，一大一小一深一浅 | `TextStack` |
| 标题行（左标题 + 右操作） | `justify-content:space-between` 的单行容器 | `RowHeader` |
| 滚动容器 | `overflow:auto` 配合固定高度，内部撑开 | `ScrollArea` |
| 操作按钮组 | 多个 `<button>` / icon-button 横排，带间距 | `ActionBar` |
| 状态徽标 | 小圆点/小标签表示在线/离线/告警等状态 | `StatusBadge` |

**写代码过程中如果出现以下气味，立即停下来判断是否该提取：**
- 手写 `flex` 布局超过 4 行 CSS，且不含任何业务字段名
- 出现 `min-width: 0` 或 `flex-shrink: 0`（经典防溢出结构）
- 同一个 div 嵌套结构在组件里出现 2 次以上

## Step 4：写通用 UI 组件（如有）

**每个组件单独走一遍以下流程：**

1. 在 `src/ui/<ComponentName>/` 下创建 `index.tsx` 和 `index.module.css`
2. 在 `src/ui/index.ts` 末尾追加导出：
   ```ts
   export { default as <ComponentName> } from './<ComponentName>'
   ```
3. 提交到 main 并 rebase 回当前分支：
   ```bash
   bash .claude/scripts/promote-to-ui.sh <ComponentName>
   ```

参考现有组件风格：`src/ui/Tag/`、`src/ui/Avatar/`、`src/ui/EmptyState/`

## Step 5：写场景文件

在 `src/scenes/<SceneName>/` 下创建三个文件：

**`types.ts`** — 类型定义，PascalCase + 语义后缀（如 `CardItem`），禁用 `any`

**`mock.ts`** — 必须导出 `mockScenes` 对象，固定包含以下五个变体：

| key | 数据量 | 用途 |
|-----|--------|------|
| `empty` | 0 条 | 空状态 |
| `single` | 1 条 | 单条布局 |
| `normal` | 10 条 | 常规展示 |
| `large` | 100 条以上 | 性能/虚拟滚动 |
| `withEdge` | 若干 | 超长文本、空字段、特殊字符等边界值 |

使用工厂函数生成数据，禁止硬编码：
```ts
const createItem = (index: number, overrides?: Partial<XxxItem>): XxxItem => ({
  id: `item-${index}`,
  // ...默认字段
  ...overrides,
})
```

**`index.tsx`** — 场景组件，通过 `useMockVariant` 读取当前变体，空数据时渲染 `<EmptyState />`：
```tsx
import { useMockVariant } from '@/hooks/useMockVariant'
import { EmptyState } from '@/ui'
import { mockScenes } from './mock'

const <SceneName> = () => {
  const { current } = useMockVariant()
  const items = mockScenes[current]
  if (items.length === 0) return <EmptyState />
  // ...
}
```

## Step 6：注册场景

**`src/scenes/index.ts`** — 在 `SCENE_LIST` 数组末尾追加：
```ts
{
  path: '<kebab-name>',
  label: '<中文显示名>',
  icon: SomeIcon,  // 从 lucide-react 选一个语义相符的图标
}
```

**`src/App.tsx`** — 在注释行前追加路由：
```tsx
import <SceneName> from '@/scenes/<SceneName>'
// ...
<Route path="<kebab-name>" element={<SceneName />} />
```

## Step 7：构建验证

```bash
pnpm build
```

有类型错误必须修复后再提交。

## Step 8：提交场景代码

```bash
git add src/scenes/<SceneName>/ src/App.tsx src/scenes/index.ts
git commit -m "feat(<kebab-name>): 开发<场景中文名>场景"
```

## Step 9：更新分支记录到 main

先切换到 main，再修改文件、提交，最后 rebase 回场景分支：

```bash
git checkout main
```

在 `docs/branches.md` 的「场景分支」表格末尾追加一行：

```markdown
| `scene/<kebab-name>` | <场景中文名> | <一句话说明场景用途，含关键技术点> |
```

说明字段的写法参考：
- 体现「验证什么」或「实现什么交互」
- 如有引入第三方库，注明库名（如「使用 react-virtuoso」、「使用 @dnd-kit」）

追加完毕后提交，再切回场景分支 rebase：

```bash
git add docs/branches.md
git commit -m "docs(branches): 新增 scene/<kebab-name> 分支记录"
git checkout scene/<kebab-name>
git rebase main
```

## 禁止事项

- 禁止把 `src/ui/` 的改动直接提交到 scene 分支（必须通过 `promote-to-ui.sh`）
- 禁止在组件内硬编码 Mock 数据（必须从 `mock.ts` 引入）
- 禁止使用 `any` 类型
- 禁止魔法数字，提取为具名常量
- 禁止把通用 UI 原语内联写在场景组件里

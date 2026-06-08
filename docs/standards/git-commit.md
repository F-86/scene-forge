---
名称：Git 提交规范
创建日期：2026-06-08
更新日期：2026-06-08
---

# Git 提交规范

## 一、分支策略

本项目采用**四类分支**，对应四种不同性质的工作：

| 分支 | 命名 | 用途 |
|------|------|------|
| `main` | 固定 | 框架骨架、通用组件、规范文档；不包含任何具体场景 |
| `scene/<name>` | 如 `scene/basic-list` | 单个 UI 场景的完整实现；从 `main` 切出，**不合并回 main** |
| `combo/<purpose>` | 如 `combo/data-display` | 组合多个场景同时呈现；从 `main` 切出，merge 所需的 scene 分支 |
| `exp/<name>` | 如 `exp/tab-bar` | 实验性功能探索；从 `main` 切出，根据结论决定是否合并 |

### main 分支上允许存在的内容

- `src/components/` — 通用布局组件（Layout、Sidebar、MockSwitcher 等）
- `src/ui/` — 共享 UI 原语（Avatar、Tag、EmptyState 等）
- `src/hooks/` — 通用 Hook（`useMockVariant` 等）
- `src/mock/` — Mock 目录结构（**不含**具体场景的工厂函数）
- `src/scenes/Home/` — 占位首页
- `src/scenes/index.ts` — 仅注册首页，不含任何场景条目
- `src/App.tsx` — 仅包含首页路由，不含任何场景路由
- `docs/` — 所有规范文档

### 新建场景的完整流程

```bash
# 1. 从 main 切出新分支
git checkout main
git checkout -b scene/basic-list

# 2. 开发：创建 src/scenes/BasicList/，注册到 scenes/index.ts 和 App.tsx

# 3. 提交
git add src/scenes/BasicList/ src/scenes/index.ts src/App.tsx docs/requirements/scenes/basic-list.md
git commit -m "feat(basic-list): 新增基础列表场景"

# 4. 切回 main，main 保持干净
git checkout main
```

### 新建实验的完整流程

```bash
# 1. 从 main 切出实验分支
git checkout main
git checkout -b exp/tab-bar

# 2. 开发：可以随意修改框架代码进行探索

# 3. 提交（以 exp 为 commit 类型）
git commit -m "exp(tab-bar): 探索顶部标签栏布局方案"

# 4a. 探索成功，择机合并回 main（需整理提交，去掉过程性提交）
# 4b. 探索放弃，保留分支存档即可，不合并
```

### 组合多个场景的完整流程

`combo` 分支用于把多个 `scene` 分支合并在一起，同时呈现多个场景。分支名用**目的/用途**命名，不枚举场景名（场景越并越多，名字枚举会失控）。

```bash
# 1. 从 main 切出
git checkout main
git checkout -b combo/data-display

# 2. 依次 merge 所需的 scene 分支
git merge scene/basic-list
git merge scene/data-table   # App.tsx 和 scenes/index.ts 此处必然冲突

# 3. 解决冲突：两侧内容全部保留，不要丢弃任何一边
# App.tsx 冲突示例 ↓
# <<<<<<< HEAD
# import BasicList from '@/scenes/BasicList'
# =======
# import DataTable from '@/scenes/DataTable'
# >>>>>>> scene/data-table
# → 改为同时保留两行：
# import BasicList from '@/scenes/BasicList'
# import DataTable from '@/scenes/DataTable'

git add src/App.tsx src/scenes/index.ts
git commit -m "combo(data-display): 合并基础列表 + 数据表格场景"

# 4. 继续 merge 更多场景，重复步骤 2-3
git merge scene/kanban
```

**冲突规律**：每次 merge 新场景时，`App.tsx` 和 `scenes/index.ts` 必然冲突，处理方式永远相同——把两侧的 import 和注册条目全部保留。其余文件（`src/scenes/Xxx/`）不会冲突，因为各场景目录是独立的。

### 脚本工具

项目根目录 `scripts/` 下提供两个辅助脚本，在项目根目录下执行。

#### `sync-main.sh` — 将 main 同步到所有本地分支

当 main 上有新的通用组件或规范更新时，执行此脚本将变更 rebase 到所有 `scene/*`、`combo/*`、`exp/*` 分支。**建议每次修改 main 后立即执行。**

```bash
bash scripts/sync-main.sh
```

注意事项：
- 执行前工作区必须干净（无未提交改动），否则脚本会中止
- 脚本会尝试拉取远程 main 的最新代码，无远程时自动跳过
- rebase 冲突时该分支会被跳过并记录，脚本继续处理其他分支，最后汇报失败列表
- 失败的分支需手动 `git checkout <分支> && git rebase main` 解决冲突

#### `create-combo.sh` — 从多个 scene 分支创建 combo 分支

需要同时展示多个场景时使用。从 main 切出新分支后依次 merge 指定的 scene 分支。

```bash
bash scripts/create-combo.sh <combo分支名> <scene分支1> <scene分支2> [...]

# 示例
bash scripts/create-combo.sh combo/data-display scene/basic-list scene/data-table
```

注意事项：
- combo 分支名必须以 `combo/` 开头，且不能已存在
- 执行前工作区必须干净，且所有目标 scene 分支须已存在于本地
- merge 时遇到冲突脚本会暂停，在另一个终端解决冲突并 `git add + git commit` 后，回到脚本按回车继续
- 脚本完成后在 `docs/branches.md` 补充该 combo 分支的记录

---

## 二、提交信息格式

```
<类型>(<范围>): <中文描述>
```

## 三、类型说明

| 类型 | 适用分支 | 说明 |
|------|----------|------|
| `feat` | `main` / `scene/*` | 新增功能或场景 |
| `fix` | 所有 | 修复问题 |
| `mock` | `scene/*` | 新增或修改 Mock 数据 |
| `refactor` | 所有 | 重构，不影响外部行为 |
| `docs` | `main` | 文档变更 |
| `chore` | `main` | 工具、依赖、配置变更 |
| `exp` | `exp/*` | 实验性探索（过程提交可以随意，合并前整理） |
| `combo` | `combo/*` | 合并多个场景或解决合并冲突后的整理提交 |

## 四、提交示例

```
# main 分支
feat(sidebar): 新增场景分组折叠功能
feat(ui): 新增 Avatar / Tag / EmptyState 共享组件
fix(mock-switcher): 修复刷新后变体未保留的问题
refactor(mock): 提取公共工厂函数至 mock/factory.ts
docs(standards): 更新 Git 分支规范
chore: 升级 Vite 至 6.x

# scene/* 分支
feat(basic-list): 新增基础列表场景
mock(basic-list): 补充超长文本边界数据
fix(basic-list): 修复空描述时布局出现多余间距的问题
docs(basic-list): 补充场景需求文档

# combo/* 分支
combo(data-display): 合并基础列表 + 数据表格场景
combo(data-display): 合并看板场景，解决 App.tsx 冲突

# exp/* 分支
exp(tab-bar): 初始化顶部标签栏结构
exp(tab-bar): 验证多标签滚动溢出方案
```

## 五、注意事项

- 描述使用中文，动词开头，简洁明确
- 范围对应场景目录名（`src/scenes/` 下）或模块名
- 单次提交只做一件事，避免将多个场景变更合并提交
- `scene/*` 分支**永不合并回 main**，main 始终只有框架代码
- `combo/*` 分支合并冲突时，`App.tsx` 和 `scenes/index.ts` 两侧内容**全部保留**，不丢弃任何一边
- `exp/*` 分支的过程提交可以凌乱，合并前需用 `git rebase -i` 整理
- `src/ui/` 中的共享组件只放与业务无关的 UI 原语，不放场景专属逻辑

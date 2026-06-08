# Scene Forge

一个用于测试各类 UI 场景的 React 单页面原型项目。数据全部使用 Mock，覆盖空数据、少量数据、正常数据量、大数据量及边界值等场景，用于快速验证页面在不同数据状态下的表现。

---

## 项目目标

- 以最小成本验证 UI 场景在不同数据量下的表现
- 无需后端依赖，Mock 数据可随时构造、随时切换
- 每个场景独立维护，互不干扰

---

## 目录结构

```
scene-forge/
├── docs/
│   ├── standards/              # 项目规范文档
│   │   ├── code-style.md       # 代码规范
│   │   ├── documentation.md    # 文档规范
│   │   ├── requirements.md     # 需求描述规范
│   │   ├── testing.md          # 测试规范
│   │   └── git-commit.md       # Git 提交规范（含分支策略）
│   ├── requirements/           # 各场景需求文档
│   │   └── scenes/             # 按场景分文件存放
│   └── branches.md             # 分支记录（所有分支的用途说明）
├── scripts/
│   ├── sync-main.sh            # 将 main 同步到所有本地分支
│   └── create-combo.sh         # 从多个 scene 分支创建 combo 分支
├── src/
│   ├── components/             # 框架级通用组件（Layout、Sidebar 等）
│   ├── ui/                     # 共享 UI 原语（Avatar、Tag、EmptyState 等）
│   ├── scenes/                 # 场景页面（核心目录）
│   ├── hooks/                  # 通用 Hook
│   └── mock/                   # Mock 数据目录
└── README.md
```

---

## 快速上手

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

---

## 场景开发流程

```
1. 从 main 切出新的 scene 分支
        git checkout main && git checkout -b scene/<name>
        ↓
2. 在 docs/requirements/scenes/ 下新建场景需求文档
        ↓
3. 在 src/scenes/ 下新建场景目录（types.ts / mock.ts / index.tsx）
        ↓
4. 开发组件，从 mock.ts 引入数据，共享 UI 原语从 @/ui 引入
        ↓
5. 对照 docs/standards/testing.md 中的验收 Checklist 逐项验证
        ↓
6. 在需求文档中勾选已通过项，更新状态为「已完成」
        ↓
7. 提交，并在 docs/branches.md 中追加此分支的记录
```

---

## 分支管理

本项目使用四类分支，详细规范见 [Git 提交规范](docs/standards/git-commit.md)，所有分支的用途记录在 [docs/branches.md](docs/branches.md)。

| 分支 | 命名示例 | 用途 |
|------|----------|------|
| `main` | — | 框架、共享组件、规范文档，不含任何具体场景 |
| `scene/<name>` | `scene/basic-list` | 单个 UI 场景，从 main 切出，永不合并回 main |
| `combo/<purpose>` | `combo/data-display` | 组合多个场景同时展示 |
| `exp/<name>` | `exp/tab-bar` | 实验性功能探索 |

### 脚本工具

**`scripts/sync-main.sh` — 将 main 同步到所有本地分支**

当 main 上的通用组件或共享代码有更新时，执行此脚本将变更 rebase 到所有 `scene/*`、`combo/*`、`exp/*` 分支，避免分支间长期分叉导致合并困难。

```bash
bash scripts/sync-main.sh
```

注意事项：
- 执行前确保工作区干净（无未提交改动）
- 脚本会自动拉取远程 main 的最新代码
- 若某个分支 rebase 冲突，脚本会跳过该分支并继续处理其他分支，最后汇报失败列表
- 失败的分支需手动 `git checkout <分支> && git rebase main` 解决冲突后重新执行

**`scripts/create-combo.sh` — 从多个 scene 分支创建 combo 分支**

需要同时展示多个场景时，用此脚本从 main 切出新分支并依次 merge 所需的 scene 分支。

```bash
bash scripts/create-combo.sh <combo分支名> <scene分支1> <scene分支2> [...]

# 示例：合并基础列表和数据表格两个场景
bash scripts/create-combo.sh combo/data-display scene/basic-list scene/data-table
```

注意事项：
- combo 分支名必须以 `combo/` 开头，用途命名而非枚举场景名（如 `combo/data-display` 而非 `combo/list-and-table`）
- 执行前确保工作区干净，且所有目标 scene 分支已存在于本地
- merge 时 `src/App.tsx` 和 `src/scenes/index.ts` 必然冲突，脚本会暂停等待手动处理；处理方式固定：**两侧内容全部保留**，不删除任何一边的 import 和注册条目
- 解决冲突后执行 `git add <文件> && git commit`，再回到脚本按回车继续
- 脚本完成后在 `docs/branches.md` 补充此 combo 分支的记录

---

## 规范文档索引

| 文档 | 说明 |
|------|------|
| [代码规范](docs/standards/code-style.md) | 目录结构、命名、组件写法、Mock 数据管理 |
| [文档规范](docs/standards/documentation.md) | 文档格式、命名、文件头部模板 |
| [需求描述规范](docs/standards/requirements.md) | 场景需求模板、分类标签定义 |
| [测试规范](docs/standards/testing.md) | 测试策略、验收 Checklist、单元测试写法 |
| [Git 提交规范](docs/standards/git-commit.md) | 分支策略、提交格式、脚本工具说明 |
| [分支记录](docs/branches.md) | 所有分支的用途和状态一览 |

---

## Mock 场景覆盖

每个场景的 `mock.ts` 须覆盖以下数据量变体：

| 变体 | 数据量 | 用途 |
|------|--------|------|
| `empty` | 0 条 | 验证空状态 UI |
| `single` | 1 条 | 验证单条布局 |
| `normal` | 10 条 | 验证常规展示 |
| `large` | 100 条以上 | 验证性能与虚拟滚动 |
| `withEdge` | 若干 | 验证超长文本、空字段等边界值 |

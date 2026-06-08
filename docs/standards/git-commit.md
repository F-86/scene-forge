---
名称：Git 提交规范
创建日期：2026-06-08
更新日期：2026-06-08
---

# Git 提交规范

## 一、分支策略

本项目采用**三类分支**，对应三种不同性质的工作：

| 分支 | 命名 | 用途 |
|------|------|------|
| `main` | 固定 | 框架骨架、通用组件、规范文档；不包含任何具体场景 |
| `scene/<name>` | 如 `scene/basic-list` | 单个 UI 场景的完整实现；从 `main` 切出，**不合并回 main** |
| `exp/<name>` | 如 `exp/tab-bar` | 实验性功能探索；从 `main` 切出，根据结论决定是否合并 |

### main 分支上允许存在的内容

- `src/components/` — 通用布局组件（Layout、Sidebar、MockSwitcher 等）
- `src/hooks/` — 通用 Hook（`useMockVariant` 等）
- `src/mock/` — 工厂函数基础结构（**不含**具体场景的工厂函数）
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

## 四、提交示例

```
# main 分支
feat(sidebar): 新增场景分组折叠功能
fix(mock-switcher): 修复刷新后变体未保留的问题
refactor(mock): 提取公共工厂函数至 mock/factory.ts
docs(standards): 更新 Git 分支规范
chore: 升级 Vite 至 6.x

# scene/* 分支
feat(basic-list): 新增基础列表场景
mock(basic-list): 补充超长文本边界数据
fix(basic-list): 修复空描述时布局出现多余间距的问题
docs(basic-list): 补充场景需求文档

# exp/* 分支
exp(tab-bar): 初始化顶部标签栏结构
exp(tab-bar): 验证多标签滚动溢出方案
```

## 五、注意事项

- 描述使用中文，动词开头，简洁明确
- 范围对应场景目录名（`src/scenes/` 下）或模块名
- 单次提交只做一件事，避免将多个场景变更合并提交
- `scene/*` 分支**永不合并回 main**，main 始终只有框架代码
- `exp/*` 分支的过程提交可以凌乱，合并前需用 `git rebase -i` 整理

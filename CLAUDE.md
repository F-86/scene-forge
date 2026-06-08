# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 语言规范

始终使用**简体中文**交流，代码注释使用中文，技术术语可保留英文。

## 常用命令

```bash
pnpm dev        # 启动开发服务器
pnpm build      # 类型检查 + 构建产物
pnpm lint       # ESLint 检查
```

> 本项目强制使用 pnpm，禁止使用 npm 或 yarn。

## 项目架构

这是一个用于验证 UI 场景的 React 单页原型项目，**无真实后端**，所有数据均来自 Mock。

### 核心概念：场景（Scene）

每个场景是一个独立的 UI 验证单元，存放在 `src/scenes/<SceneName>/`，包含三个文件：

- `index.tsx` — 场景组件入口
- `mock.ts` — 该场景的所有 Mock 数据变体
- `types.ts` — 该场景的类型定义

### Mock 数据分层

```
src/mock/factory.ts     # 底层：工厂函数，生成单条基础数据，支持 overrides
src/mock/index.ts       # 统一出口
scenes/SceneName/mock.ts  # 上层：组合工厂函数，定义场景所需的数据量变体
```

每个场景的 `mock.ts` 须导出 `mockScenes` 对象，固定包含以下变体：

| key | 数据量 | 用途 |
|-----|--------|------|
| `empty` | 0 条 | 空状态 |
| `single` | 1 条 | 单条布局 |
| `normal` | 10 条 | 常规展示 |
| `large` | 100 条以上 | 性能 / 虚拟滚动 |
| `withEdge` | 若干 | 超长文本、空字段等边界值 |

### 命名规范

| 类型 | 规范 |
|------|------|
| 组件文件 / 场景目录 | PascalCase |
| 非组件文件 | camelCase |
| CSS 类名（CSS Modules） | camelCase |
| Mock 变量 | `mock` + 场景描述，如 `mockEmptyList` |
| 类型定义 | PascalCase + 语义后缀，如 `UserItem` |

### 禁止事项

- 禁止在组件内直接硬编码 Mock 数据，必须从 `mock.ts` 引入
- 禁止使用 `any` 类型（特殊情况须注释说明）
- 禁止魔法数字，提取为具名常量

## 规范文档

完整规范见 `docs/standards/`：

- `code-style.md` — 代码规范
- `requirements.md` — 场景需求文档模板
- `testing.md` — 验收 Checklist
- `git-commit.md` — 提交信息格式

## 分支策略

| 分支 | 用途 |
|------|------|
| `main` | 框架、通用组件、规范文档；**不包含任何具体场景** |
| `scene/<name>` | 单个 UI 场景；从 `main` 切出，永不合并回 main |
| `exp/<name>` | 实验性功能探索；从 `main` 切出，根据结论决定是否合并 |

## Git 提交格式

```
<类型>(<范围>): <中文描述>

类型：feat | fix | mock | refactor | docs | chore | exp
范围：对应 src/scenes/ 下的目录名或模块名
```

完整分支规范见 `docs/standards/git-commit.md`。

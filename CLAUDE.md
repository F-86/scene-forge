# CLAUDE.md

## 语言规范

始终使用**简体中文**交流，代码注释使用中文，技术术语可保留英文。

## 常用命令

```bash
pnpm dev        # 启动开发服务器
pnpm build      # 类型检查 + 构建产物
pnpm lint       # ESLint 检查
```

强制使用 pnpm，禁止使用 npm 或 yarn。

## 禁止事项

- 禁止在组件内直接硬编码 Mock 数据，必须从 `mock.ts` 引入
- 禁止使用 `any` 类型（特殊情况须注释说明）
- 禁止魔法数字，提取为具名常量
- 禁止把通用 UI 原语内联在场景组件里——开发时就识别，直接写到 `src/ui/`

## 分支与提交规则

开发场景时，若发现可提取到 `src/ui/` 的通用组件，**必须分两次提交**：

1. `bash .claude/scripts/promote-to-ui.sh <ComponentName>` — 提交到 main 并 rebase 回当前分支
2. 再提交场景专属代码（`src/scenes/`、`src/App.tsx`、`src/scenes/index.ts`）

**`src/ui/` 的任何改动都只能提交到 main，禁止在 scene/* 分支上提交。**

**禁止直接执行 `git commit`。** 需要提交时，给出提交信息后提示用户自行执行。

提交信息格式：

```
<类型>(<范围>): <中文描述>

类型：feat | fix | mock | refactor | docs | chore | exp | combo
```

## 规范文档

完整规范见 `docs/`。

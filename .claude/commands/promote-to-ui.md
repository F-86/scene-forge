---
description: 将当前场景分支中的通用 UI 组件提升到 main 分支的 src/ui/
allowed-tools: Bash, Read, Edit
argument-hint: <ComponentName>
---

组件名称：$ARGUMENTS（PascalCase）

## Step 1：确认 index.ts 已导出该组件

检查 `src/ui/index.ts` 是否包含对应的 `export` 行，若缺少则自动补上再继续：

```ts
export { default as $ARGUMENTS } from './$ARGUMENTS'
```

## Step 2：运行脚本

```bash
bash .claude/scripts/promote-to-ui.sh $ARGUMENTS
```

## Step 3：提示后续操作

脚本完成后，执行 `git status`，列出剩余的未提交文件，告诉用户：
- 哪些是场景专属文件（`src/scenes/`、`src/App.tsx`、`src/scenes/index.ts`）
- 给出具体的 `git add` + `git commit` 命令建议，commit message 格式：`feat(<scene-name>): ...`

## 注意事项

- 如果 rebase 失败，引导用户手动解决冲突后执行 `git rebase --continue`

---
description: 将当前场景分支中的通用 UI 组件提升到 main 分支的 src/ui/
allowed-tools: Bash, Read, Edit
argument-hint: <ComponentName>
---

用户希望将当前 `scene/*` 分支上开发的通用 UI 组件提升（promote）到 main 分支的 `src/ui/`，并重新 rebase 回当前分支。

组件名称：$ARGUMENTS

## 执行步骤

1. **确认组件目录存在**：检查 `src/ui/$ARGUMENTS/` 是否存在，不存在则报错提示

2. **确认 `src/ui/index.ts` 已导出该组件**：如果缺少 `export { default as $ARGUMENTS }` 这一行，先用 Edit 工具补上，再继续

3. **运行脚本**：
   ```bash
   bash scripts/promote-to-ui.sh $ARGUMENTS
   ```

4. **脚本完成后**，执行 `git status`，列出剩余的未提交文件，告诉用户：
   - 哪些是场景专属文件（`src/scenes/`、`src/App.tsx`、`src/scenes/index.ts`、`docs/requirements/`）
   - 给出具体的 `git add` + `git commit` 命令建议，commit message 格式：`feat(<scene-name>): ...`

## 注意事项

- 脚本只能在 `scene/*` 分支上执行，否则报错
- 如果 rebase 失败，引导用户手动解决冲突后执行 `git rebase --continue`

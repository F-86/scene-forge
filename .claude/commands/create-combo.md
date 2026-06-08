---
description: 从多个 scene 分支创建 combo 分支，用于同时展示多个场景
allowed-tools: Bash
argument-hint: <combo分支名> <scene分支1> <scene分支2> ...
---

用户希望将多个 scene 分支合并到一个新的 combo 分支中同时展示。

参数：$ARGUMENTS
（格式：<combo分支名> <scene分支1> <scene分支2> ...，示例：combo/data-display scene/basic-list scene/data-table）

## 执行步骤

1. 解析参数，确认格式正确（至少 2 个参数：combo 分支名 + 至少 1 个 scene 分支）

2. 运行脚本：
   ```bash
   bash scripts/create-combo.sh $ARGUMENTS
   ```

3. 脚本执行过程中可能暂停等待冲突处理，此时：
   - 告知用户需要在终端中解决 `src/App.tsx` 和 `src/scenes/index.ts` 的冲突
   - 冲突处理方式：**两侧内容全部保留**，不删除任何一边的 import 和注册条目
   - 解决后执行 `git add <冲突文件> && git commit`，再回到脚本按回车继续

4. 全部完成后，提示用户：
   - 运行 `pnpm dev` 验证所有场景是否正常
   - 在 `docs/branches.md` 中补充此 combo 分支的记录

## 注意事项

- combo 分支名必须以 `combo/` 开头，用途命名而非枚举场景名
- 执行前工作区必须干净，且所有目标 scene 分支须已存在于本地

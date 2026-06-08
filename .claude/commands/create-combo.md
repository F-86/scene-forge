---
description: 从多个 scene 分支创建 combo 分支，用于同时展示多个场景
allowed-tools: Bash
argument-hint: <combo分支名> <scene分支1> <scene分支2> ...
---

参数：$ARGUMENTS
（格式：`<combo分支名> <scene分支1> <scene分支2> ...`，示例：`combo/data-display scene/basic-list scene/data-table`）

## Step 1：运行脚本

```bash
bash .claude/scripts/create-combo.sh $ARGUMENTS
```

## Step 2：处理冲突（如有）

脚本执行过程中可能暂停等待冲突处理，此时：
- 告知用户需要在终端中解决 `src/App.tsx` 和 `src/scenes/index.ts` 的冲突
- 冲突处理方式：**两侧内容全部保留**，不删除任何一边的 import 和注册条目
- 解决后执行 `git add <冲突文件> && git commit`，再回到脚本按回车继续

## Step 3：完成提示

全部完成后，提示用户：
- 运行 `pnpm dev` 验证所有场景是否正常渲染
- 在 `docs/branches.md` 中补充此 combo 分支的记录

## 注意事项

- 执行前工作区必须干净，脚本内部会检查并报错

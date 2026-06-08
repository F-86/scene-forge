---
description: 将 main 分支的最新代码同步（rebase）到所有本地 scene/combo/exp 分支
allowed-tools: Bash
argument-hint: 无参数
---

## Step 1：运行同步脚本

```bash
bash .claude/scripts/sync-main.sh
```

## Step 2：检查输出并处理结果

脚本完成后，检查输出：
- 若全部成功，告知用户同步完成，并列出已同步的分支
- 若有分支失败（rebase 冲突），列出失败的分支，并提示用户逐个手动处理：
  ```bash
  git checkout <失败的分支>
  git rebase main
  # 解决冲突后
  git rebase --continue
  ```

## 注意事项

- 脚本要求工作区干净，若有未提交改动会中止，提示用户先 commit 或 stash
- 脚本会拉取远程 main 的最新代码，无远程时自动跳过
- 全部同步完成后，脚本自动切回 main 分支

# .claude/scripts/

Claude Code 工作流辅助脚本，由 slash command 调用，也可直接在终端执行。

**必须在项目根目录下运行。**

## 脚本列表

| 脚本 | 用途 | 典型调用方式 |
|------|------|-------------|
| [`promote-to-ui.sh`](./promote-to-ui.sh) | 将通用 UI 组件从 scene 分支提交到 main，并 rebase 回来 | `/promote-to-ui Button` |
| [`sync-main.sh`](./sync-main.sh) | 将 main 的最新改动 rebase 到所有 scene / combo / exp 分支 | `/sync-main` |
| [`create-combo.sh`](./create-combo.sh) | 从 main 切出 combo 分支，依次 merge 指定的 scene 分支 | `/create-combo combo/dashboard scene/list scene/chart` |

## 直接调用示例

```bash
# 提升通用组件
bash .claude/scripts/promote-to-ui.sh Avatar

# 同步所有分支
bash .claude/scripts/sync-main.sh

# 创建 combo 分支
bash .claude/scripts/create-combo.sh combo/data-display scene/basic-list scene/data-table
```

## 注意事项

- `promote-to-ui.sh` 只能在 `scene/*` 分支上执行
- `sync-main.sh` 和 `create-combo.sh` 执行前工作区必须干净（无未提交改动）
- 详细行为说明见各脚本文件内的注释，或对应的 `commands/*.md`

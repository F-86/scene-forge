#!/usr/bin/env bash
# scripts/sync-main.sh
#
# 将 main 分支的最新代码 rebase 到所有本地分支（scene/*、combo/*、exp/*）
#
# 用法：
#   bash scripts/sync-main.sh
#
# 执行后效果：
#   - 每个非 main 分支依次执行 git rebase main
#   - rebase 成功则自动继续下一个分支
#   - rebase 冲突则中止并提示手动处理，退出脚本
#   - 最终切回 main 分支

set -euo pipefail

# ── 颜色输出 ────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

info()    { echo -e "${GREEN}[sync]${NC} $*"; }
warn()    { echo -e "${YELLOW}[warn]${NC} $*"; }
error()   { echo -e "${RED}[error]${NC} $*"; }

# ── 前置检查 ────────────────────────────────────────────────────────────────

# 必须在项目根目录执行
if [ ! -f "CLAUDE.md" ]; then
  error "请在项目根目录下执行此脚本"
  exit 1
fi

# 工作区必须干净
if ! git diff --quiet || ! git diff --cached --quiet; then
  error "工作区有未提交的改动，请先 commit 或 stash 后再执行"
  exit 1
fi

# 当前分支
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# 确保 main 是最新的
info "切换到 main 并拉取最新代码..."
git checkout main
git pull --rebase origin main 2>/dev/null || warn "拉取远程 main 失败（可能无远程），跳过"

# ── 收集需要同步的分支 ──────────────────────────────────────────────────────
# 只处理 scene/*、combo/*、exp/* 三类分支
BRANCHES=$(git branch --format='%(refname:short)' | grep -E '^(scene|combo|exp)/' || true)

if [ -z "$BRANCHES" ]; then
  warn "没有找到 scene/*、combo/*、exp/* 分支，无需同步"
  git checkout "$CURRENT_BRANCH"
  exit 0
fi

echo ""
info "将对以下分支执行 rebase main："
echo "$BRANCHES" | while read -r b; do echo "  • $b"; done
echo ""

# ── 逐分支 rebase ────────────────────────────────────────────────────────────
FAILED=()

while IFS= read -r branch; do
  info "正在同步 $branch ..."
  git checkout "$branch"

  if git rebase main; then
    info "✓ $branch 同步完成"
  else
    error "✗ $branch rebase 冲突，请手动处理："
    error "  1. 解决冲突后执行：git rebase --continue"
    error "  2. 或放弃本次 rebase：git rebase --abort"
    error "  3. 手动处理完再重新执行此脚本同步剩余分支"
    git rebase --abort 2>/dev/null || true
    FAILED+=("$branch")
    warn "已跳过 $branch，继续同步其他分支..."
  fi
  echo ""
done <<< "$BRANCHES"

# ── 收尾 ─────────────────────────────────────────────────────────────────────
git checkout main

if [ ${#FAILED[@]} -gt 0 ]; then
  warn "以下分支同步失败，需手动处理冲突后重新同步："
  for b in "${FAILED[@]}"; do echo "  • $b"; done
  exit 1
else
  info "所有分支同步完成，已切回 main"
fi

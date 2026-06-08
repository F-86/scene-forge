#!/usr/bin/env bash
# scripts/promote-to-ui.sh
#
# 将当前 scene 分支上开发的通用 UI 组件提升到 main 分支的 src/ui/
#
# 用法：
#   bash scripts/promote-to-ui.sh <ComponentName>
#
# 示例：
#   bash scripts/promote-to-ui.sh SortIndicator
#
# 执行后效果：
#   1. stash 当前所有改动（含未追踪文件）
#   2. 切到 main，pop stash
#   3. 只提交 src/ui/<ComponentName>/ 和 src/ui/index.ts 到 main
#   4. 切回原分支，rebase main
#   5. 剩余改动（场景专属代码）留在工作区，等待用户手动提交

set -euo pipefail

# ── 颜色输出 ────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

info()  { echo -e "${GREEN}[promote]${NC} $*"; }
warn()  { echo -e "${YELLOW}[warn]${NC} $*"; }
error() { echo -e "${RED}[error]${NC} $*"; }
step()  { echo -e "${CYAN}[step]${NC} $*"; }

# ── 参数校验 ────────────────────────────────────────────────────────────────
if [ $# -ne 1 ]; then
  error "参数不正确"
  echo ""
  echo "用法：bash scripts/promote-to-ui.sh <ComponentName>"
  echo ""
  echo "示例："
  echo "  bash scripts/promote-to-ui.sh SortIndicator"
  exit 1
fi

COMPONENT="$1"
UI_DIR="src/ui/${COMPONENT}"
UI_INDEX="src/ui/index.ts"

# 必须在项目根目录执行
if [ ! -f "CLAUDE.md" ]; then
  error "请在项目根目录下执行此脚本"
  exit 1
fi

# 必须在 scene/* 分支上执行
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$CURRENT_BRANCH" != scene/* ]]; then
  error "此脚本只能在 scene/* 分支上执行，当前分支：$CURRENT_BRANCH"
  exit 1
fi

# 组件目录必须存在
if [ ! -d "$UI_DIR" ]; then
  error "组件目录不存在：$UI_DIR"
  exit 1
fi

# ── 开始执行 ────────────────────────────────────────────────────────────────
echo ""
info "准备将 ${COMPONENT} 提升到 main 分支"
info "组件目录：$UI_DIR"
info "当前分支：$CURRENT_BRANCH"
echo ""

# 1. stash 所有改动（含未追踪文件）
step "stash 当前所有改动..."
git stash -u
echo ""

# 2. 切到 main
step "切换到 main..."
git checkout main

# 3. pop stash
step "还原改动..."
git stash pop
echo ""

# 4. 只暂存组件目录和 index.ts
step "暂存 $UI_DIR 和 $UI_INDEX ..."
git add "$UI_DIR"
git add "$UI_INDEX"

# 检查是否有内容可提交
if git diff --cached --quiet; then
  warn "没有检测到 ${COMPONENT} 的新改动，main 上可能已是最新"
  git checkout "$CURRENT_BRANCH"
  exit 0
fi

# 5. 提交到 main
COMMIT_MSG="feat(ui): 新增 ${COMPONENT} 共享组件"
step "提交到 main：$COMMIT_MSG"
git commit -m "$COMMIT_MSG"
echo ""

# 6. 切回原分支
step "切回 $CURRENT_BRANCH ..."
git checkout "$CURRENT_BRANCH"

# 7. rebase main，拉取刚才的提交
step "rebase main..."
if git rebase main; then
  echo ""
  info "✓ 完成！${COMPONENT} 已提升到 main"
  echo ""
  info "剩余改动（场景专属代码）已还原到工作区，下一步："
  echo "  git add src/scenes/<SceneName>/ src/scenes/index.ts src/App.tsx"
  echo "  git commit -m \"feat(<scene-name>): ...\""
else
  echo ""
  error "rebase 冲突，请手动解决后执行："
  error "  git rebase --continue"
  exit 1
fi

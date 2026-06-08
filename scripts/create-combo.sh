#!/usr/bin/env bash
# scripts/create-combo.sh
#
# 从 main 切出新的 combo 分支，依次 merge 指定的 scene 分支
# merge 冲突时只有 App.tsx 和 scenes/index.ts 需要手动合并（保留两侧内容），
# 其余场景目录文件不会冲突。
#
# 用法：
#   bash scripts/create-combo.sh <combo分支名> <scene分支1> <scene分支2> [...]
#
# 示例：
#   bash scripts/create-combo.sh combo/data-display scene/basic-list scene/data-table
#
# 执行后效果：
#   - 从 main 切出指定名称的 combo 分支
#   - 依次 merge 每个 scene 分支
#   - 遇到冲突时暂停并提示，等待手动解决后按回车继续

set -euo pipefail

# ── 颜色输出 ────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

info()    { echo -e "${GREEN}[combo]${NC} $*"; }
warn()    { echo -e "${YELLOW}[warn]${NC} $*"; }
error()   { echo -e "${RED}[error]${NC} $*"; }
step()    { echo -e "${CYAN}[step]${NC} $*"; }

# ── 参数校验 ────────────────────────────────────────────────────────────────
if [ $# -lt 2 ]; then
  error "参数不足"
  echo ""
  echo "用法：bash scripts/create-combo.sh <combo分支名> <scene分支1> <scene分支2> [...]"
  echo ""
  echo "示例："
  echo "  bash scripts/create-combo.sh combo/data-display scene/basic-list scene/data-table"
  exit 1
fi

COMBO_BRANCH="$1"
shift
SCENE_BRANCHES=("$@")

# combo 分支名必须以 combo/ 开头
if [[ "$COMBO_BRANCH" != combo/* ]]; then
  error "combo 分支名必须以 'combo/' 开头，当前：$COMBO_BRANCH"
  exit 1
fi

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

# 校验所有 scene 分支是否存在
for branch in "${SCENE_BRANCHES[@]}"; do
  if ! git rev-parse --verify "$branch" &>/dev/null; then
    error "分支不存在：$branch"
    exit 1
  fi
done

# combo 分支不能已存在
if git rev-parse --verify "$COMBO_BRANCH" &>/dev/null; then
  error "分支已存在：$COMBO_BRANCH，请换一个名称或手动删除后重试"
  exit 1
fi

# ── 开始执行 ────────────────────────────────────────────────────────────────
echo ""
info "即将创建 combo 分支：$COMBO_BRANCH"
info "合并以下 scene 分支："
for b in "${SCENE_BRANCHES[@]}"; do echo "  • $b"; done
echo ""

# 切到 main，确保 combo 从最新 main 切出
info "切换到 main..."
git checkout main

# 创建并切换到 combo 分支
info "创建分支 $COMBO_BRANCH ..."
git checkout -b "$COMBO_BRANCH"

# ── 逐个 merge ───────────────────────────────────────────────────────────────
for branch in "${SCENE_BRANCHES[@]}"; do
  step "正在 merge $branch ..."

  if git merge --no-ff "$branch" --no-edit 2>/dev/null; then
    info "✓ $branch merge 完成（无冲突）"
  else
    # 有冲突，提示用户处理
    echo ""
    warn "⚠ merge $branch 时发生冲突"
    warn "冲突文件通常只有："
    warn "  • src/App.tsx          → 保留两侧的 import 和 Route，不要删除任何一边"
    warn "  • src/scenes/index.ts  → 保留两侧的注册条目，不要删除任何一边"
    echo ""
    warn "请在新终端中解决冲突，完成后回到此处按回车继续..."
    warn "（解决完冲突后需要先执行：git add <冲突文件> && git commit）"
    echo ""
    read -r -p "冲突已解决，按回车继续合并下一个分支..."

    # 检查是否还有未解决的冲突
    if git diff --check 2>/dev/null | grep -q "conflict"; then
      error "仍有未解决的冲突，请处理后重新执行脚本"
      exit 1
    fi
  fi
  echo ""
done

# ── 完成 ─────────────────────────────────────────────────────────────────────
echo ""
info "✓ 所有分支合并完成"
info "当前分支：$COMBO_BRANCH"
echo ""
info "下一步建议："
echo "  1. pnpm dev  — 启动开发服务器验证所有场景是否正常"
echo "  2. 确认无误后在 docs/branches.md 中补充此 combo 分支的记录"

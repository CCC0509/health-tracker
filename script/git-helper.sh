#!/bin/bash
set -e

echo "📂 當前 Git branch: $(git branch --show-current)"
git status

echo ""
echo "🚀 Git 操作選單："
echo "1) git pull"
echo "2) git add + commit + push"
echo "3) git fetch + rebase"
echo "4) 跳過 Git 操作"
read -p "> " GIT_MODE

case "$GIT_MODE" in
  1)
    echo "🔄 執行 git pull"
    git pull
    ;;
  2)
    read -p "請輸入 commit 訊息: " MSG
    git add .
    git commit -m "$MSG"
    echo "🚀 嘗試 git push"
    if ! git push; then
      echo "⚠️ 分支尚未設定上游，嘗試自動設定..."
      git push --set-upstream origin $(git branch --show-current)
    fi
    ;;
  3)
    echo "🔃 執行 git fetch + rebase"
    git fetch
    git rebase
    ;;
  4)
    echo "🟡 跳過 Git 操作"
    ;;
  *)
    echo "❌ 無效選項"
    exit 1
    ;;
esac

echo "✅ Git 操作完成"

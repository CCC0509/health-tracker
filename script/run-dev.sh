#!/bin/bash

set -e

echo "🌍 請選擇要使用的環境檔："
echo "1) 開發環境（.env）"
echo "2) 正式環境（.env.production）"
read -p "> " ENV_CHOICE

case "$ENV_CHOICE" in
  1)
    ENV_FILE=".env"
    ;;
  2)
    ENV_FILE=".env.production"
    ;;
  *)
    echo "❌ 無效選項"
    exit 1
    ;;
esac

echo "📦 使用環境檔：$ENV_FILE"

# 匯入環境變數
export $(grep -v '^#' "$ENV_FILE" | xargs)

# 執行 NestJS 開發模式
echo "🚀 啟動 NestJS 開發伺服器..."
nest start --watch

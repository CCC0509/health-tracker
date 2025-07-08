#!/bin/bash

set -e

# 選擇環境
echo ""
echo "🌍 請選擇執行環境："
echo "1) 開發（.env）"
echo "2) 正式（.env.production）"
read -p "> " ENV_MODE

case "$ENV_MODE" in
  1)
    COMPOSE_FILE="docker-compose.dev.yml"
    ENV_FILE=".env"
    ENV_MODE="dev"
    ;;
  2)
    COMPOSE_FILE="docker-compose.prod.yml"
    ENV_FILE=".env.production"
    ENV_MODE="prod"
    ;;
  *)
    echo "❌ 無效選項"
    exit 1
    ;;
esac

echo "🛠 使用 Compose 檔案：$COMPOSE_FILE"
echo "🛠 使用環境檔：$ENV_FILE"

# 載入環境變數（支援 DB_HOST, DB_PORT 切換）
export $(grep -v '^#' "$ENV_FILE" | xargs)

DB_HOST="localhost"
DB_PORT=$(grep DB_PORT "$ENV_FILE" | cut -d '=' -f2 | xargs)
RETRIES=5
WAIT=1

echo "🔍 檢查 PostgreSQL 是否可連線 ($DB_HOST:$DB_PORT)..."

for i in $(seq 1 $RETRIES); do
  nc -z $DB_HOST $DB_PORT && break
  echo "⏳ 等待 PostgreSQL 第 $i 次... ($WAIT 秒)"
  if [ $i -eq $RETRIES ]; then
    echo "🚫 無法連線 PostgreSQL，嘗試啟動 Docker..."
    docker compose -p "$ENV_MODE" --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d
    sleep 5
  else
    sleep $WAIT
  fi
done

echo "✅ PostgreSQL 可連線"

# 問題選單
echo ""
echo "請選擇操作模式："
echo "1) migrate reset (⚠️ 清除全部資料)"
echo "2) migrate dev（輸入 commit 訊息）"
echo "3) migrate deploy"
echo "4) db push"
read -p "> " MODE

# schema merge
echo "🧩 合併 Prisma schema..."
npx prisma-merge -b=schema/_base.prisma -s=schema/*.prisma -o=prisma/schema.prisma

# prisma generate
echo "⚙️ 執行 prisma generate..."
npx prisma generate

# 根據選項執行操作
case "$MODE" in
  1)
    echo "🚨 你選擇了 reset！"
    npx prisma migrate reset --force
    ;;
  2)
    read -p "請輸入 migration 名稱: " COMMIT
    npx prisma migrate dev --name "$COMMIT"
    ;;
  3)
    echo "🧱 執行 migrate deploy..."
    if ! npx prisma migrate deploy; then
      echo "⚠️ 偵測到 P3005（資料庫已有資料但未設定 baseline）"
      LAST_MIGRATION=$(ls -1 prisma/migrations | tail -n 1)
      echo "🧩 自動標記已套用的 migration：$LAST_MIGRATION"
      npx prisma migrate resolve --applied "$LAST_MIGRATION"
      echo "🔁 重新執行 migrate deploy..."
      npx prisma migrate deploy
    fi
    ;;
  4)
    npx prisma db push
    ;;
  *)
    echo "❌ 無效選項，結束"
    exit 1
    ;;
esac

echo "✅ [$ENV_FILE]資料庫操作完成"

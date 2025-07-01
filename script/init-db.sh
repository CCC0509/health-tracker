#!/bin/bash

set -e

DB_HOST="localhost"
DB_PORT=5432
RETRIES=5
WAIT=1

echo "🔍 檢查 PostgreSQL 是否可連線 ($DB_HOST:$DB_PORT)..."

for i in $(seq 1 $RETRIES); do
  nc -z $DB_HOST $DB_PORT && break
  echo "⏳ 等待 PostgreSQL 第 $i 次... ($WAIT 秒)"
  if [ $i -eq $RETRIES ]; then
    echo "🚫 無法連線 PostgreSQL，嘗試啟動 Docker..."
    docker-compose up -d
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
npx prisma-merge -i prisma/schema -o prisma/schema.prisma

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

echo "✅ 資料庫操作完成"

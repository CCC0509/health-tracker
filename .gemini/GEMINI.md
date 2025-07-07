# Gemini Context for Health Tracker Backend (繁體中文)

## 1. 專案概覽

這是一個健康追蹤應用程式的後端服務，使用 NestJS 框架開發。主要負責管理使用者、食物、營養數據和運動紀錄。

## 2. 技術棧

- **語言**: TypeScript
- **框架**: NestJS
- **資料庫**: PostgreSQL
- **ORM**: Prisma
- **套件管理器**: npm
- **API架構**: RESTful api

## 3. 專案結構

- `src/`: 主要的應用程式原始碼，依功能模組組織。
- `prisma/`: 包含資料庫結構 (`schema.prisma`)、遷移檔案和種子資料。
- `schema/`: 將所有資料庫結構分檔建立。
- `test/`: 端對端 (E2E) 測試。
- `dist/`: 編譯後的 JavaScript 檔案。

## 4. 重要指令

- **安裝依賴**: `npm install`
- **運行開發伺服器**: `npm run start:dev`
- **運行單元與整合測試**: `npm run test`
- **運行端對端測試**: `npm run test:e2e`
- **Linter 檔案檢查**: `npm run lint`
- **格式化檔案**: `npm run format` (使用 Prettier)
- **建置生產版本**: `npm run build`
- **套用資料庫遷移**: `npx prisma migrate dev`

## 5. 編碼慣例

- 遵循標準的 NestJS 慣例和檔案結構。
- 使用 ESLint (`.eslintrc.js`) 和 Prettier (`.prettierrc`) 進行程式碼品質管理和格式化。
- 所有新功能都應包含對應的測試。
- API 端點和 DTO 應使用 Swagger 裝飾器進行良好註釋。

## 6. 環境設定

專案根目錄需要一個 `.env` 檔案來存放環境變數。其中最重要的是：

- `DATABASE_URL`: PostgreSQL 資料庫的連線字串。
  - 格式: `postgresql://使用者:密碼@主機:埠號/資料庫名稱`

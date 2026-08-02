# Next.js + NestJSスターターキット

- フロントエンド：Next.js
- バックエンド：NestJS
- DB：PostgreSQL
- 上記の最低限構成

## ファイル構成

```
.
├── apps/
│   ├── backend/              # NestJS バックエンド
│   │   ├── src/              # ソースコード
│   │   │   ├── app.controller.ts
│   │   │   ├── app.service.ts
│   │   │   ├── main.ts
│   │   │   └── prisma/
│   │   ├── prisma/
│   │   │   ├── schema.prisma # DB スキーマ
│   │   │   ├── seed.ts       # サンプルデータ
│   │   │   └── migrations/   # マイグレーション
│   │   ├── Dockerfile
│   │   └── package.json
│   └── frontend/             # Next.js フロントエンド
│       ├── src/
│       │   └── app/
│       │       ├── page.tsx
│       │       └── components/
│       │           └── Persons.tsx  # 人物一覧表示
│       ├── Dockerfile
│       └── package.json
├── docker-compose.yml        # Docker Compose 設定
├── package.json              # ルート package.json (monorepo)
└── README.md
```

## セットアップ・起動

### 前提条件
- Docker × Docker Compose がインストール済み

### 起動方法

```bash
docker compose up --build
```

起動後：
- **フロント** : http://localhost:3000 → Next.js UI
- **バック（ルート）** : http://localhost:3001/ → `{"message":"Welcome to the API!"}`
- **バック（人物一覧）** : http://localhost:3001/persons → 人物データ一覧（JSON）

### DB 初期化（初回のみ）

`docker compose up` 実行時に自動で Prisma migration が走ります。
必要に応じて seed でサンプルデータを投入：

```bash
docker compose exec backend npx prisma db seed
```

### ログを見る

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

### 停止

```bash
docker compose down
```

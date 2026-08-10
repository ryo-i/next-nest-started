# Next.js + NestJS スターターキット

- フロントエンド：Next.js 15（App Router）
- バックエンド：NestJS 11（Repository パターン）
- DB：PostgreSQL + Prisma
- 共通型：`packages/shared`（monorepo）

## アーキテクチャ

### バックエンド

```
Controller → Service → Repository（抽象） → Repository実装（Prisma）
```

- `app.controller.ts` : エンドポイント定義
- `app.service.ts` : ビジネスロジック
- `persons/persons.repository.ts` : Repositoryインターフェース（抽象クラス）
- `persons/persons.repository.impl.ts` : Prismaを使った実装
- `common/filters/global-exception.filter.ts` : グローバルエラーハンドリング

### フロントエンド

```
Page → Component → Custom Hook → API層（Axios）
```

- `app/page.tsx` : ページ
- `app/components/Persons.tsx` : UIコンポーネント
- `hooks/usePersons.ts` : データ取得ロジック
- `lib/api.ts` : Axiosクライアント・エンドポイント集約
- `types/person.ts` : `@repo/shared` からの再エクスポート

### 共通型（packages/shared）

```
packages/shared/src/types/person.ts
  → Person / CreatePersonDto / UpdatePersonDto
```

フロント・バック両方が `@repo/shared` を参照するため、型の乖離が発生しません。

## ファイル構成

```
.
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── common/filters/       # グローバルエラーハンドリング
│   │   │   ├── persons/              # Repositoryパターン
│   │   │   ├── prisma/               # PrismaService
│   │   │   ├── app.controller.ts
│   │   │   ├── app.service.ts
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── seed.ts
│   │   │   └── migrations/
│   │   └── test/                     # E2Eテスト
│   └── frontend/
│       ├── src/
│       │   ├── app/
│       │   │   ├── components/       # UIコンポーネント
│       │   │   ├── page.tsx
│       │   │   └── layout.tsx
│       │   ├── hooks/                # Custom Hooks
│       │   ├── lib/                  # API層
│       │   └── types/                # 型定義（shared再エクスポート）
│       └── e2e/                      # PlaywrightによるE2E
├── packages/
│   └── shared/                       # フロント・バック共通型
│       └── src/types/person.ts
├── docker-compose.yml
└── package.json                      # npm workspaces（monorepo）
```

## セットアップ・起動

### 前提条件

- Docker / Docker Compose がインストール済み

### 環境変数

`.env.example` から各 `.env` を作成します：

```bash
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

### 起動

```bash
docker compose up --build
```

| サービス           | URL                           |
| ------------------ | ----------------------------- |
| フロント           | http://localhost:3000         |
| バック（ルート）   | http://localhost:3001/        |
| バック（人物一覧） | http://localhost:3001/persons |

### DB 初期化（初回のみ）

`docker compose up` 時に Prisma migration が自動実行されます。
サンプルデータの投入：

```bash
docker compose exec backend npx prisma db seed
```

### ログ確認

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

### 停止

```bash
docker compose down
```

## テスト

### バックエンド

```bash
# ユニットテスト
npm run test --workspace=apps/backend

# E2Eテスト（DB不要・Prismaをモック化）
npm run test:e2e --workspace=apps/backend
```

### フロントエンド

```bash
# ユニットテスト（Vitest + React Testing Library）
npm run test --workspace=apps/frontend

# E2Eテスト（Playwright・開発サーバーが必要）
npm run test:e2e --workspace=apps/frontend
```

### pre-commitフック

コミット時に自動でフロント・バックのユニットテストが実行されます。
テストが1つでも失敗するとコミットがブロックされます。

## 主な技術スタック

| カテゴリ           | 技術                                           |
| ------------------ | ---------------------------------------------- |
| フロントエンド     | Next.js 15、React 19、TypeScript、Tailwind CSS |
| バックエンド       | NestJS 11、TypeScript                          |
| DB                 | PostgreSQL 16、Prisma                          |
| テスト（フロント） | Vitest、React Testing Library、Playwright      |
| テスト（バック）   | Jest、Supertest                                |
| インフラ           | Docker、Docker Compose                         |
| 共通               | npm workspaces（monorepo）                     |

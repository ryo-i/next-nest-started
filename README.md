# Next.js + NestJS スターターキット

- フロントエンド：Next.js 15（App Router / Bulletproof React）
- バックエンド：NestJS 11（レイヤードアーキテクチャ）
- DB：PostgreSQL + Prisma
- API 型：OpenAPI（フロント） / DTO とドメイン型（バックエンド）
- CI：GitHub Actions で unit / e2e を実行
- API ドキュメント：Swagger（`/api`） / OpenAPI spec（`apps/backend/openapi.json`）
- DB GUI：Prisma Studio
- UIカタログ：Storybook
- バリデーション：`class-validator` + `ValidationPipe`

## アーキテクチャ

### バックエンド

レイヤードアーキテクチャです。機能モジュール `persons/` の中を、プレゼンテーション層、ドメイン層、データアクセス層に分けています。Prisma はデータアクセス層だけが使います。

```
PersonsController → PersonsService → PersonsRepository → Prisma
```

- `persons/persons.controller.ts` : プレゼンテーション層（エンドポイント）
- `persons/dto/` : プレゼンテーション層（リクエスト/レスポンス DTO + Swagger / class-validator）
- `persons/persons.service.ts` : ドメイン層（ユースケース）
- `persons/person.ts` : ドメイン型
- `persons/persons.repository.ts` : データアクセス層（Prisma）
- `app.controller.ts` : ルートメッセージ
- `common/filters/global-exception.filter.ts` : グローバルエラーハンドリング

認証・設定ライブラリは未導入です。必要になったときの候補:

- 認証: `@nestjs/jwt` + Passport（JWT。フロントの Auth.js と対になる）
- 設定: `@nestjs/config`（環境変数の型付き読み込み）
- レート制限: `@nestjs/throttler`
- ログ: nestjs-pino
- ヘルスチェック: `@nestjs/terminus`

### フロントエンド

Next.js の App Router はルーティングと metadata（OGP）に使います。人物一覧の取得には SSR を使わず、ブラウザから API を呼びます。画面の機能は Bulletproof React の feature-based 構成で、`features/persons/` にまとめます。

```
Page → Feature（Component / Hook / API） → 共通 axios クライアント
```

- `app/page.tsx` : ページ（Server Component）。`@/features/persons` から `Persons` を呼ぶ
- `features/persons/index.ts` : feature の公開口。外からはここだけを import する
- `features/persons/components/Persons.tsx` : ロジックを持つラッパーコンポーネント
- `features/persons/components/PersonsStatus.tsx` : loading / error の表示コンポーネント
- `features/persons/components/PersonsView.tsx` : 表示専用コンポーネント（Storybook で利用）
- `features/persons/hooks/usePersons.ts` : データ取得ロジック
- `features/persons/api/person-api.ts` : Persons の API 呼び出し
- `features/persons/types/person.ts` : 生成型から `Person` / `CreatePersonDto` を再エクスポート
- `lib/api-client.ts` : 共通 axios クライアント
- `lib/openapi.d.ts` : OpenAPI から生成した型（直接編集しない）

状態管理・フォームライブラリは未導入です。必要になったときの候補:

- サーバー状態（API データ）: TanStack Query
- クライアント状態（画面をまたぐ UI）: Zustand
- フォーム: React Hook Form + Zod
- UI 部品: shadcn/ui（Tailwind と相性が良い）
- 認証: Auth.js（ログインを足すとき）

### API 型（OpenAPI）

```
backend DTO / Swagger
  → apps/backend/openapi.json
  → apps/frontend/src/lib/openapi.d.ts
  → axios（通信）
```

フロントの API 型は OpenAPI から生成します。backend の API を変えたら `npm run generate:api` で同期します。axios は通信担当のままです。バックエンドのドメイン型は `persons/person.ts` に置きます。

## ファイル構成

```
.
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── common/filters/       # グローバルエラーハンドリング
│   │   │   ├── persons/              # Controller / Service / Repository
│   │   │   ├── prisma/               # PrismaService
│   │   │   ├── app.controller.ts     # ルートメッセージ
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── seed.ts
│   │   │   └── migrations/
│   │   ├── openapi.json              # 生成された OpenAPI spec
│   │   └── test/                     # E2Eテスト
│   └── frontend/
│       ├── src/
│       │   ├── app/                  # Next.js ルーティング
│       │   │   ├── page.tsx
│       │   │   └── layout.tsx
│       │   ├── features/persons/     # Bulletproof（feature-based）
│       │   │   └── index.ts          # feature の公開口
│       │   └── lib/                  # 共通 axios・OpenAPI生成型
│       └── e2e/                      # PlaywrightによるE2E
├── docker-compose.yml
├── package.json                      # npm workspaces（monorepo）
└── package-lock.json                 # 依存の唯一の lockfile
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

### 依存関係

ローカル、CI、Docker は、リポジトリルートの `package-lock.json` を `npm ci` で入れます。

```bash
npm ci
```

Docker のビルドコンテキストはリポジトリルートです。イメージの中でも同じ lockfile を使います。

### 起動

```bash
docker compose up --build
```

ローカルに PostgreSQL が入っている環境でも衝突しにくいように、DB 公開ポートはデフォルトで `55432` を使います。

| サービス           | URL                           |
| ------------------ | ----------------------------- |
| フロント           | http://localhost:3000         |
| バック（ルート）   | http://localhost:3001/        |
| バック（人物一覧） | http://localhost:3001/persons |
| Swagger UI         | http://localhost:3001/api     |
| DB（PostgreSQL）   | localhost:55432               |

### Swagger / OpenAPI / バリデーション

- Swagger は NestJS の `@nestjs/swagger` でコードから自動生成しています
- OpenAPI spec は `apps/backend/openapi.json` に書き出します
- フロントは `openapi-typescript` で型だけ生成し、通信は axios のままです
- `POST /persons` は `CreatePersonDto` を使ってバリデーションします
- `ValidationPipe` により、不要な項目は除去し、型変換も行います

backend の API を変えたあとは、ルートで次を実行してフロントの型を更新します。

```bash
npm run generate:api
```

#### Swagger が開かないとき（代替手順）

通常は `docker compose up --build` で `http://localhost:3001/api` を開きます。
もし Swagger が 404 になる場合は、DB を Docker で起動したまま backend だけローカル起動に切り替えます。

```bash
# 1) DB は Docker で起動
docker compose up -d db

# 2) backend コンテナが 3001 を使っている場合は停止
docker compose stop backend

# 3) backend をローカル起動（DB は Docker の 55432 に接続）
DATABASE_URL=postgres://user:password@127.0.0.1:55432/mydb BACKEND_PORT=3001 npm run start:dev --workspace=apps/backend
```

この状態で `http://localhost:3001/api` と `http://localhost:3001/api-json` を開けます。
この手順は一時的な回避策です。Docker 側が安定したら通常手順（Docker 起動）に戻してください。

### Prisma Studio（DB GUI）

Prisma Studio はブラウザで使える DB GUI です。

最短手順（推奨）：

```bash
npm run studio
```

- URL: `http://localhost:5555`
- 初期状態でデータがない場合は `There are no rows in this table` と表示されます（正常）

`npm run studio` は内部で次を実行しています。

```bash
cd apps/backend
DATABASE_URL=postgres://user:password@127.0.0.1:55432/mydb npx prisma studio --port 5555
```

- DB 側は Docker 内の `db:5432` を使い続けるため、アプリ挙動は変わりません
- ホスト側の Studio だけ `127.0.0.1:55432` を使うため、ローカル PostgreSQL と競合しにくくなります

補足：以下のエラーは接続先の不一致（別の PostgreSQL へ接続）で起きることがあります。

- `Can't reach database server at db:5432`
- `User was denied access on the database`
- `Invalid STUDIO_EMBED_BUILD ...`（詳細表示時に長いスタックが出る）

### Storybook

最小構成で導入済みです。`PersonsView` だけを Story 化しています。

```bash
npm run storybook
```

- URL: `http://localhost:6006`
- Story は `PersonsView` と `PersonsStatus` を登録しています
- addon は最小限で `@storybook/addon-essentials` のみを使っています
- バージョンは `8.6.18` に固定しています
- 実行場所はリポジトリのルートです（backend ディレクトリからは実行しません）
- `features/persons` の `Persons.tsx` は hook を使うラッパーにして、Storybook では副作用のない `PersonsView` と `PersonsStatus` を見せています
- loading / error は `resourceLabel` を props で受け、別画面でも流用しやすい形にしています

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

### CI

GitHub Actions でもフロント・バックの unit / e2e を実行します。
ローカルの pre-commit をすり抜けても、PR 時に最終確認されます。

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

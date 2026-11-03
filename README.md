# Next.js + NestJS スターターキット

TypeScript だけでフルスタックアプリを足していくための土台です。人物の一覧取得と登録まで入っています。

- フロントエンド：Next.js 15（App Router / Bulletproof React）
- バックエンド：NestJS 11（レイヤードアーキテクチャ）
- DB：PostgreSQL + Prisma
- API 型：OpenAPI（フロント） / DTO とドメイン型（バックエンド）
- CI：GitHub Actions で unit / e2e を実行
- API ドキュメント：Swagger（`/api`）
- DB GUI：Prisma Studio
- UIカタログ：Storybook

## アーキテクチャ

データ取得はブラウザから API を呼び、Next.js の App Router はルーティングと metadata（OGP）に使います。NestJS は機能フォルダの中を Controller、Service、Repository に分け、Prisma は Repository だけが使います。フロントの API 型は OpenAPI から生成します。

```
PersonsController → PersonsService → PersonsRepository → Prisma
Page → Feature（Component / Hook / API） → 共通 axios クライアント
```

ファイルの役割、未導入ライブラリの候補、サンプルデータとマスターデータの分け方は [docs/architecture.md](docs/architecture.md) にあります。

### 機能の追加

次の機能も `persons` と同じ形で足します。

- バックエンドは `apps/backend/src/<機能名>/` に Controller、Service、Repository、DTO を置きます。作ったモジュールは `AppModule` に import します。
- フロントは `apps/frontend/src/features/<機能名>/` に api、components、hooks、types と公開口の `index.ts` を置きます。`app/` のページは Server Component のまま、公開口から画面を呼びます。
- API を変えたあとは `npm run generate:api` で、フロントの型を OpenAPI から更新します。

### デプロイ

ローカルの `DATABASE_URL` は Docker 内部が `db:5432`、このマシンからは `127.0.0.1:55432` です。本番ではその環境の PostgreSQL に差し替えます。

複数のリポジトリで小さなアプリを増やすときの標準は、フロントとバックを Vercel の 1 プロジェクトにまとめ、データベースは Neon に 1 つ置くことです。同じ構成のまま、ホストを分けることも、AWS にまとめることもできます。手順と判断は [docs/deploy.md](docs/deploy.md) にあります。

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
├── docs/
│   ├── architecture.md               # 構成とデータの置き方
│   ├── deploy.md                     # デプロイ先の検討
│   └── local.md                      # 起動の補足
├── docker-compose.yml
├── package.json                      # npm workspaces（monorepo）
├── package-lock.json                 # 依存の唯一の lockfile
└── vercel.json                       # Vercel Services（フロントとバック）
```

## セットアップ・起動

Docker / Docker Compose が必要です。

```bash
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
npm ci
docker compose up --build
```

依存はリポジトリルートの `package-lock.json` を `npm ci` で入れます。Docker イメージも同じ lockfile を使います。DB の公開ポートは、このマシンの PostgreSQL とぶつかりにくいように `55432` です。

| サービス           | URL                           |
| ------------------ | ----------------------------- |
| フロント           | http://localhost:3000         |
| バック（ルート）   | http://localhost:3001/        |
| バック（人物一覧） | http://localhost:3001/persons |
| Swagger UI         | http://localhost:3001/api     |
| DB（PostgreSQL）   | localhost:55432               |

```bash
npm run generate:api    # OpenAPI からフロントの型を更新
npm run studio          # Prisma Studio（http://localhost:5555）
npm run storybook       # Storybook（http://localhost:6006）
docker compose exec backend npx prisma db seed
docker compose logs -f backend
docker compose down
```

Swagger が開かないとき、Studio の接続、Storybook の中身は [docs/local.md](docs/local.md) にあります。migration とサンプルデータの扱いは [docs/architecture.md](docs/architecture.md) にあります。

## テスト

コミット時はフロントとバックのユニットテストが走り、失敗するとコミットできません。GitHub Actions では unit と e2e の両方を実行します。

```bash
npm run test --workspace=apps/backend
npm run test:e2e --workspace=apps/backend      # DB不要。Prisma はモック
npm run test --workspace=apps/frontend
npm run test:e2e --workspace=apps/frontend     # Playwright
```

## 主な技術スタック

| カテゴリ           | 技術                                           |
| ------------------ | ---------------------------------------------- |
| フロントエンド     | Next.js 15、React 19、TypeScript、Tailwind CSS |
| バックエンド       | NestJS 11、TypeScript                          |
| DB                 | PostgreSQL 16、Prisma                          |
| テスト（フロント） | Vitest、React Testing Library、Playwright      |
| テスト（バック）   | Jest、Supertest                                |
| インフラ           | Docker、Docker Compose、Vercel、Neon           |
| 共通               | npm workspaces（monorepo）                     |

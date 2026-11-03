# アーキテクチャ

人物一覧の取得と登録を、次の機能の見本にしています。

## バックエンド

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

- 認証: `@nestjs/jwt` + Passport（JWT。フロントの Auth.js と対になる）。秘密の置き方は [deploy.md](deploy.md#秘密と公開範囲)
- 設定: `@nestjs/config`（環境変数の型付き読み込み）
- レート制限: `@nestjs/throttler`
- ログ: nestjs-pino
- ヘルスチェック: `@nestjs/terminus`

## フロントエンド

Next.js の App Router はルーティングと metadata（OGP）に使います。人物一覧の取得には SSR を使わず、ブラウザから API を呼びます。画面の機能は Bulletproof React の feature-based 構成で、`features/persons/` にまとめます。

```
Page → Feature（Component / Hook / API） → 共通 axios クライアント
```

- `app/page.tsx` : ページ（Server Component）。`@/features/persons` から `Persons` を呼ぶ
- `features/persons/index.ts` : feature の公開口。`"use client"` の境界にし、ページ本体は Server Component のままにする
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

## API 型（OpenAPI）

```
backend DTO / Swagger
  → apps/backend/openapi.json
  → apps/frontend/src/lib/openapi.d.ts
  → axios（通信）
```

フロントの API 型は OpenAPI から生成します。backend の API を変えたら `npm run generate:api` で同期します。axios は通信担当のままです。バックエンドのドメイン型は `persons/person.ts` に置きます。

Swagger は NestJS の `@nestjs/swagger` でコードから自動生成しています。`POST /persons` は `CreatePersonDto` を使い、`ValidationPipe` が不要な項目の除去と型変換をします。

## サンプルデータとマスターデータ

今の `prisma/seed.ts` はローカル確認用のサンプルデータです。`Person` をすべて削除してから入れ直すので、起動時には実行しません。

```bash
docker compose exec backend npx prisma db seed
```

マスターデータを seed で入れるときは、API が登録するテーブルとは別のテーブルにします。`seed.ts` ではこちらで決めた `id` を `upsert` し、廃止は行を消さず `deletedAt` を更新します。すでにその `id` を参照している行は残ります。ローカル確認用のサンプルは `prisma/seed-dev.ts` に分け、必要なときだけコマンドで実行します。起動時には実行しません。

backend コンテナは、プロセスの起動前に `prisma migrate deploy` を実行します。適用済みの migration は再実行しません。新しい migration ファイルを作るときは `prisma migrate dev` を使います。

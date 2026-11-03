# ローカル開発の補足

通常の起動はルートの README のとおり、`docker compose up --build` です。

## Swagger が開かないとき

通常は `http://localhost:3001/api` を開きます。404 になる場合は、DB を Docker で起動したまま backend だけローカル起動に切り替えます。

```bash
# 1) DB は Docker で起動
docker compose up -d db

# 2) backend コンテナが 3001 を使っている場合は停止
docker compose stop backend

# 3) 既存の migration を適用する
DATABASE_URL=postgres://user:password@127.0.0.1:55432/mydb npm exec --workspace=apps/backend prisma migrate deploy

# 4) backend をローカル起動（DB は Docker の 55432 に接続）
DATABASE_URL=postgres://user:password@127.0.0.1:55432/mydb BACKEND_PORT=3001 npm run start:dev --workspace=apps/backend
```

この状態で `http://localhost:3001/api` と `http://localhost:3001/api-json` を開けます。Docker 側が安定したら `docker compose up --build` に戻します。

## Prisma Studio

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

DB 側は Docker 内の `db:5432` を使い続けます。ホスト側の Studio だけ `127.0.0.1:55432` を使うので、このマシンに入っている PostgreSQL と競合しにくくなります。

次のエラーは、接続先が別の PostgreSQL になっているときに起きます。

- `Can't reach database server at db:5432`
- `User was denied access on the database`
- `Invalid STUDIO_EMBED_BUILD ...`（詳細表示時に長いスタックが出る）

## Storybook

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

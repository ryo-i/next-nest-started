import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

// Prisma は query_compiler_bg.wasm を動的に開く。Vercel は Function に必要な
// ファイルだけを入れるので、この静的な参照が無いとその WASM が落ちる。
// Docker、Render、AWS は node_modules ごと載るので、この参照があっても
// 接続や起動手順は変わらない。ファイルが無い配置では読み飛ばす。
const queryCompilerWasm = join(
  __dirname,
  '../../../../node_modules/.prisma/client/query_compiler_bg.wasm',
);
if (existsSync(queryCompilerWasm)) {
  readFileSync(queryCompilerWasm);
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly pool: Pool;

  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    super({ adapter: new PrismaPg(pool) });
    this.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect(); // PrismaClient の接続を確立
  }

  async onModuleDestroy() {
    await this.$disconnect(); // PrismaClient の接続を切断
  }
}
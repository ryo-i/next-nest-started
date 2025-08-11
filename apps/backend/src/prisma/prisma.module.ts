import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // グローバルモジュールとして登録
@Module({
  providers: [PrismaService], // PrismaService を提供
  exports: [PrismaService], // 他のモジュールで利用可能にする
})
export class PrismaModule {}

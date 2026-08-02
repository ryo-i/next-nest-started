import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule], // PrismaModule を登録
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

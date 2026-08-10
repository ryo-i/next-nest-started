import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PersonRepository } from './persons/persons.repository.impl';
import { IPersonRepository } from './persons/persons.repository';

@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: IPersonRepository,
      useClass: PersonRepository,
    },
  ],
})
export class AppModule {}

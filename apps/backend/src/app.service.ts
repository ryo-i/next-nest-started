import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {} // PrismaService を注入

  async getPersons() {
    return this.prisma.person.findMany(); // PrismaService を利用
  }
}
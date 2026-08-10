import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IPersonRepository } from './persons.repository';
import { Person } from '@prisma/client';

@Injectable()
export class PersonRepository implements IPersonRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Person[]> {
    return this.prisma.person.findMany();
  }

  async findById(id: number): Promise<Person | null> {
    return this.prisma.person.findUnique({
      where: { id },
    });
  }

  async create(data: { name: string }): Promise<Person> {
    return this.prisma.person.create({
      data,
    });
  }

  async update(id: number, data: { name: string }): Promise<Person> {
    return this.prisma.person.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Person> {
    return this.prisma.person.delete({
      where: { id },
    });
  }
}

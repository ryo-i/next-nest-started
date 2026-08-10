import { Person } from '@prisma/client';

export abstract class IPersonRepository {
  abstract findAll(): Promise<Person[]>;
  abstract findById(id: number): Promise<Person | null>;
  abstract create(data: { name: string }): Promise<Person>;
  abstract update(id: number, data: { name: string }): Promise<Person>;
  abstract delete(id: number): Promise<Person>;
}

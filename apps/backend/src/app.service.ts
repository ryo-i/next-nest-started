import { Injectable } from '@nestjs/common';
import { IPersonRepository } from './persons/persons.repository';

@Injectable()
export class AppService {
  constructor(private readonly personRepository: IPersonRepository) {}

  async getPersons() {
    return this.personRepository.findAll();
  }
}

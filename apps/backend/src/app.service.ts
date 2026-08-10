import { Injectable } from '@nestjs/common';
import { IPersonRepository } from './persons/persons.repository';
import { CreatePersonDto } from './persons/dto/create-person.dto';

@Injectable()
export class AppService {
  constructor(private readonly personRepository: IPersonRepository) {}

  async getPersons() {
    return this.personRepository.findAll();
  }

  async createPerson(createPersonDto: CreatePersonDto) {
    return this.personRepository.create(createPersonDto);
  }
}

import { Injectable } from '@nestjs/common';
import { IPersonRepository } from './persons/persons.repository';
import { CreatePersonDto } from './persons/dto/create-person.dto';

@Injectable()
export class AppService {
  constructor(private readonly personRepository: IPersonRepository) {}

  /**
   * 人物一覧を取得します。
   */
  async getPersons() {
    return this.personRepository.findAll();
  }

  /**
   * 人物を作成します。
   */
  async createPerson(createPersonDto: CreatePersonDto) {
    return this.personRepository.create(createPersonDto);
  }
}

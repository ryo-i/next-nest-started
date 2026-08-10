import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { CreatePersonDto } from './persons/dto/create-person.dto';
import { PersonResponseDto } from './persons/dto/person-response.dto';

@ApiTags('persons')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('persons')
  @ApiOperation({ summary: '人物一覧を取得する' })
  @ApiOkResponse({ type: PersonResponseDto, isArray: true })
  async getPersons() {
    return await this.appService.getPersons();
  }

  @Post('persons')
  @ApiOperation({ summary: '人物を作成する' })
  @ApiBody({ type: CreatePersonDto })
  @ApiCreatedResponse({ type: PersonResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  async createPerson(@Body() createPersonDto: CreatePersonDto) {
    return await this.appService.createPerson(createPersonDto);
  }

  @Get()
  @ApiOperation({ summary: 'ルートメッセージを返す' })
  @ApiOkResponse({
    schema: {
      example: { message: 'Welcome to the API!' },
    },
  })
  getRoot() {
    return { message: 'Welcome to the API!' };
  }
}

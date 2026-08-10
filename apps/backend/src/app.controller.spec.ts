import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const appServiceMock = {
      getPersons: jest.fn().mockResolvedValue([
        { id: 1, name: '織田信長' },
        { id: 2, name: '豊臣秀吉' },
        { id: 3, name: '徳川家康' },
      ]),
      createPerson: jest.fn().mockResolvedValue({
        id: 4,
        name: '明智光秀',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: appServiceMock }],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('should return a list of persons', async () => {
    const result = await appController.getPersons();
    expect(result).toEqual([
      { id: 1, name: '織田信長' },
      { id: 2, name: '豊臣秀吉' },
      { id: 3, name: '徳川家康' },
    ]);
    expect(appService.getPersons).toHaveBeenCalled();
  });

  it('should create a person', async () => {
    const result = await appController.createPerson({
      name: '明智光秀',
    } as any);

    expect(result).toEqual({ id: 4, name: '明智光秀' });
    expect(appService.createPerson).toHaveBeenCalledWith({
      name: '明智光秀',
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { fixtures } from './films.fixtures';

describe('FilmsController', () => {
  let controller: FilmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [FilmsService],
    })
      .useMocker((token) => {
        if (token === 'REPOSITORY') {
          return {
            films: {
              findAll: jest.fn().mockResolvedValue(fixtures.films),
              findById: jest.fn().mockResolvedValue(fixtures.film),
            },
          };
        }
        throw new Error(`Token ${token.toString()} not found!`);
      })
      .compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  it('should find all films', async () => {
    expect(controller).toBeDefined();
    const findResult = await controller.getAll();
    expect(findResult).toEqual(fixtures.films);
  });

  it('should find one schedule', async () => {
    expect(controller).toBeDefined();
    const findResult = await controller.getSchedule('11');
    expect(findResult).toEqual({
      total: fixtures.film.schedule.length,
      items: fixtures.film.schedule,
    });
  });
});

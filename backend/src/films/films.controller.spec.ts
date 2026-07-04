import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { IFilmsRepository } from '../repository/films.repository.interface';
import { fixtures } from './films.fixtures';

describe('FilmsController', () => {
  let controller: FilmsController;

  const filmsRepository: IFilmsRepository = {
    getAll: jest.fn().mockResolvedValue(fixtures.films),
    getById: jest.fn().mockResolvedValue(fixtures.film),
    getSchedule: jest.fn().mockResolvedValue(fixtures.schedule),
    bookSeatAtomic: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        FilmsService,
        { provide: 'FILMS_REPOSITORY', useValue: filmsRepository },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all films with total', async () => {
    const result = await controller.getAll();
    expect(result).toEqual({
      total: fixtures.films.length,
      items: fixtures.films,
    });
  });

  it('should return a film schedule with total', async () => {
    const result = await controller.getSchedule(fixtures.film.id);
    expect(result).toEqual({
      total: fixtures.schedule.length,
      items: fixtures.schedule,
    });
  });
});

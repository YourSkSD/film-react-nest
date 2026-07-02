import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { IFilmsRepository } from '../repository/films.repository.interface';
import { fixtures } from './films.fixtures';

describe('FilmsService', () => {
  let service: FilmsService;

  const filmsRepository: IFilmsRepository = {
    getAll: jest.fn().mockResolvedValue(fixtures.films),
    getById: jest.fn().mockResolvedValue(fixtures.film),
    getSchedule: jest.fn().mockResolvedValue(fixtures.schedule),
    bookSeatAtomic: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        { provide: 'FILMS_REPOSITORY', useValue: filmsRepository },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all films', async () => {
    const films = await service.getAll();
    expect(filmsRepository.getAll).toHaveBeenCalled();
    expect(films).toEqual(fixtures.films);
  });

  it('should return the schedule of a film', async () => {
    const schedule = await service.getSchedule(fixtures.film.id);
    expect(filmsRepository.getSchedule).toHaveBeenCalledWith(fixtures.film.id);
    expect(schedule).toEqual(fixtures.schedule);
  });
});

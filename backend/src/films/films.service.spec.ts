import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { fixtures } from './films.fixtures';

describe('FilmsService', () => {
  let service: FilmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilmsService],
    })
      .useMocker((token) => {
        if (token === 'REPOSITORY') {
          return {
            films: {
              findAll: jest.fn().mockResolvedValue(fixtures.films),
              findById: jest.fn().mockResolvedValue(fixtures.film),
              save: jest.fn().mockResolvedValue(fixtures.film.id),
            },
          };
        }
        throw new Error(`Token ${token.toString()} not found!`);
      })
      .compile();

    service = module.get<FilmsService>(FilmsService);
  });

  it('should find all films', async () => {
    expect(service).toBeDefined();
    const films = await service.getAll();
    expect(films).toEqual(films);
  });

  it('should find one film', async () => {
    expect(service).toBeDefined();
    const films = await service.getSchedule('11');
    expect(films).toEqual(fixtures.film);
  });

  it('should save film', async () => {
    expect(service).toBeDefined();
    const id = await service.save(fixtures.film);
    expect(id).toEqual(fixtures.film.id);
  });
});

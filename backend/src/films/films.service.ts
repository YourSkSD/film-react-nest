import { Inject, Injectable } from '@nestjs/common';
import { IFilmsRepository } from '../repository/films.repository.interface';

@Injectable()
export class FilmsService {
  constructor(
    @Inject('FILMS_REPOSITORY')
    private readonly filmsRepository: IFilmsRepository,
  ) {}

  getAll() {
    return this.filmsRepository.getAll();
  }

  getSchedule(id: string) {
    return this.filmsRepository.getSchedule(id);
  }
}

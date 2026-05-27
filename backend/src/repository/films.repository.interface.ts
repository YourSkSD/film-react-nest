import {
  FilmDto,
  FilmWithScheduleDto,
  ScheduleDto,
} from '../films/dto/films.dto';

export interface IFilmsRepository {
  getAll(): Promise<FilmDto[]>;
  getById(id: string): Promise<FilmWithScheduleDto | null>;
  getSchedule(id: string): Promise<ScheduleDto[] | null>;
  updateTaken(
    filmId: string,
    sessionId: string,
    taken: string[],
  ): Promise<void>;
}

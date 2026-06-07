import {
  FilmDto,
  FilmWithScheduleDto,
  ScheduleDto,
} from '../films/dto/films.dto';

export interface IFilmsRepository {
  getAll(): Promise<FilmDto[]>;
  getById(id: string): Promise<FilmWithScheduleDto | null>;
  getSchedule(id: string): Promise<ScheduleDto[] | null>;
  bookSeatAtomic(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<boolean>;
}

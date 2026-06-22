import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';
import { IFilmsRepository } from './films.repository.interface';
import {
  FilmDto,
  FilmWithScheduleDto,
  ScheduleDto,
} from '../films/dto/films.dto';

@Injectable()
export class FilmsRepository implements IFilmsRepository {
  constructor(
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,
    // DataSource нужен для управления транзакциями в bookSeatAtomic
    private dataSource: DataSource,
  ) {}

  async getAll(): Promise<FilmDto[]> {
    // Явно выбираем поля, исключая schedule (аналог { schedule: 0 })
    const films = await this.filmRepository.find({
      select: [
        'id',
        'title',
        'about',
        'description',
        'director',
        'rating',
        'tags',
        'image',
        'cover',
      ],
    });
    return films.map((film) => this.toFilmDto(film));
  }

  async getById(id: string): Promise<FilmWithScheduleDto | null> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: ['schedule'], // Подгружаем связанные сеансы
    });
    if (!film) return null;
    return this.toFilmWithScheduleDto(film);
  }

  async getSchedule(id: string): Promise<ScheduleDto[] | null> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: ['schedule'],
      select: ['id'], // Оптимизация: загружаем только ID фильма и его schedule
    });
    return film ? film.schedule : null;
  }

  async bookSeatAtomic(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const schedule = await queryRunner.manager.findOne(Schedule, {
        where: { id: sessionId, filmId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!schedule) {
        await queryRunner.rollbackTransaction();
        return false;
      }

      // Защитная инициализация и преобразование
      if (!Array.isArray(schedule.taken)) {
        if (schedule.taken === null || schedule.taken === undefined) {
          schedule.taken = [];
        } else if (typeof schedule.taken === 'string') {
          try {
            // Пытаемся распарсить как JSON
            const parsed = JSON.parse(schedule.taken);
            schedule.taken = Array.isArray(parsed) ? parsed : [];
          } catch {
            // Если не JSON, создаём пустой массив
            schedule.taken = [];
          }
        } else {
          // Если другой тип — приводим к массиву
          schedule.taken = [schedule.taken].filter(Boolean);
        }
      }

      // Проверяем, не занято ли уже место
      if (schedule.taken.includes(seatKey)) {
        await queryRunner.rollbackTransaction();
        return false;
      }

      // Добавляем место в занятые
      schedule.taken.push(seatKey);

      await queryRunner.manager.save(schedule);
      await queryRunner.commitTransaction();
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private toFilmDto(film: Film): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    };
  }

  private toFilmWithScheduleDto(film: Film): FilmWithScheduleDto {
    return {
      ...this.toFilmDto(film),
      schedule: film.schedule ?? [],
    };
  }
}

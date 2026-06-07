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
    private dataSource: DataSource, // исправлено: dataSource вместо dataSource в использовании
  ) {}

  async getAll(): Promise<FilmDto[]> {
    const films = await this.filmRepository.find({
      select: {
        id: true,
        title: true,
        about: true,
        description: true,
        director: true,
        rating: true,
        tags: true,
        image: true,
        cover: true,
      },
    });
    return films.map((film) => this.toFilmDto(film));
  }

  async getById(id: string): Promise<FilmWithScheduleDto | null> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: {
        schedule: true,
      },
    });
    if (!film) return null;
    return this.toFilmWithScheduleDto(film);
  }

  async getSchedule(id: string): Promise<ScheduleDto[] | null> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: {
        schedule: true,
      },
      select: {
        id: true, // загружаем только ID фильма
      },
    });
    return film ? film.schedule : null;
  }

  async bookSeatAtomic(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner(); // исправлено: dataSource
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

      if (schedule.taken.includes(seatKey)) {
        await queryRunner.rollbackTransaction();
        return false;
      }

      schedule.taken.push(seatKey);
      await queryRunner.manager.save(schedule);

      await queryRunner.commitTransaction();
      return true;
    } catch (err) {
      console.error('Transaction failed:', err);
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

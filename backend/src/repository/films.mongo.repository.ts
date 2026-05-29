import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from './schemas/film.schema';
import { IFilmsRepository } from './films.repository.interface';
import {
  FilmDto,
  FilmWithScheduleDto,
  ScheduleDto,
} from '../films/dto/films.dto';

type FilmLean = Omit<Film, 'schedule'> & { schedule: ScheduleDto[] };

@Injectable()
export class FilmsMongoRepository implements IFilmsRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<FilmDocument>) {}

  async getAll(): Promise<FilmDto[]> {
    const films = await this.filmModel
      .find({}, { schedule: 0 })
      .lean<FilmLean[]>();
    return films.map((film) => this.toFilmDto(film));
  }

  async getById(id: string): Promise<FilmWithScheduleDto | null> {
    const film = await this.filmModel.findOne({ id }).lean<FilmLean>();
    if (!film) return null;
    return this.toFilmWithScheduleDto(film);
  }

  async getSchedule(id: string): Promise<ScheduleDto[] | null> {
    const film = await this.filmModel
      .findOne({ id }, { schedule: 1 })
      .lean<FilmLean>();
    return film?.schedule ?? null;
  }

  async bookSeatAtomic(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<boolean> {
    const result = await this.filmModel.updateOne(
      {
        id: filmId,
        'schedule.id': sessionId,
        'schedule.taken': { $ne: seatKey },
      },
      { $push: { 'schedule.$.taken': seatKey } },
    );
    return result.matchedCount > 0;
  }

  private toFilmDto(film: FilmLean): FilmDto {
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

  private toFilmWithScheduleDto(film: FilmLean): FilmWithScheduleDto {
    return {
      ...this.toFilmDto(film),
      schedule: film.schedule ?? [],
    };
  }
}

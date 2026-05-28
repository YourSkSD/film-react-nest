import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsMongoRepository } from '../repository/films.mongo.repository';
import { Film, FilmSchema } from '../repository/schemas/film.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    {
      provide: 'FILMS_REPOSITORY',
      useClass: FilmsMongoRepository,
    },
  ],
  exports: ['FILMS_REPOSITORY'],
})
export class FilmsModule {}

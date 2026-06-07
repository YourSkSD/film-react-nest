import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsRepository } from '../repository/films.repository';
import { Film } from '../repository/entities/film.entity';
import { Schedule } from '../repository/entities/schedule.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Film, Schedule])],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    {
      provide: 'FILMS_REPOSITORY',
      useClass: FilmsRepository,
    },
  ],
  exports: ['FILMS_REPOSITORY'],
})
export class FilmsModule {}

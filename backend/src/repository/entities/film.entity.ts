import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity('films')
export class Film {
  @PrimaryColumn('varchar')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  about: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  director: string;

  @Column('float') // или 'int', в зависимости от того, как хранится рейтинг (например, 8.5)
  rating: number;

  // В PostgreSQL массивы строк хранятся так
  @Column('text', { array: true, default: '{}' })
  tags: string[];

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  cover: string;

  // Связь один-ко-многим. cascade: true позволяет сохранять сеансы вместе с фильмом
  @OneToMany(() => Schedule, (schedule) => schedule.film, { cascade: true })
  schedule: Schedule[];
}

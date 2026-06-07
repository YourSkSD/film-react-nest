import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { configProvider, AppConfig } from './app.config.provider';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { Film } from './repository/entities/film.entity';
import { Schedule } from './repository/entities/schedule.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // добавляем импорт ConfigModule
      inject: [ConfigService], // внедряем ConfigService напрямую
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL', 'postgres://localhost:5432/prac');
        const username = configService.get<string>('DATABASE_USERNAME', 'postgres');
        const password = configService.get<string>('DATABASE_PASSWORD', 'postgres');

        return {
          type: 'postgres',
          url: dbUrl,
          username,
          password,
          entities: [Film, Schedule],
          synchronize: false,
          logging: true, // для отладки
        };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
      serveStaticOptions: {
        fallthrough: false,
        index: false,
      },
    }),
    FilmsModule,
    OrderModule,
  ],
  providers: [configProvider],
})
export class AppModule {}

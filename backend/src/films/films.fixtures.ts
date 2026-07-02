import { FilmWithScheduleDto } from './dto/films.dto';

const film: FilmWithScheduleDto = {
  id: '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
  rating: 8.1,
  director: 'Амелия Хьюз',
  tags: ['Рекомендуемые'],
  cover: '/bg6s.jpg',
  image: '/bg6s.jpg',
  title: 'Сон в летний день',
  schedule: [
    {
      daytime: '2024-06-28T10:00:53+03:00',
      hall: 0,
      id: 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',
      price: 350,
      rows: 5,
      seats: 10,
      taken: ['1:2'],
    },
  ],
  about:
    'Фэнтези-фильм о группе друзей попавших в волшебный лес, где время остановилось.',
  description:
    'Причудливый фэнтези-фильм, действие которого происходит в волшебном лесу, где время остановилось. Группа друзей натыкается на это заколдованное царство и поначалу проникается беззаботным духом обитателей, но потом друзьям приходится разойтись. А как встретиться снова, если нет ни времени, ни места встречи?',
};

const films = {
  page: 1,
  size: 1,
  total: 1,
  items: [film],
};

export const fixtures = {
  film,
  films,
};

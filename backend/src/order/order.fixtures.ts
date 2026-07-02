import { TicketDto } from './dto/order.dto';

// Билет на свободное место сеанса фильма «Сон в летний день»
// (film/session соответствуют ./test/prac.shedules.sql).
const postOrderTicket: TicketDto = {
  film: '92b8a2a7-ab6b-4fa9-915b-d27945865e39',
  session: '5274c89d-f39c-40f9-bea8-f22a22a50c8a',
  daytime: '2024-06-28T10:00:53+03:00',
  row: 3,
  seat: 4,
  price: 350,
};

// Билет на уже занятое место (1:2) того же сеанса — см. films.fixtures schedule
const takenOrderTicket: TicketDto = {
  ...postOrderTicket,
  row: 1,
  seat: 2,
};

export const fixtures = {
  postOrderTicket,
  takenOrderTicket,
};

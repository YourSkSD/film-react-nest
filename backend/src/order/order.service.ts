import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto, TicketResponseDto } from './dto/order.dto';
import { IFilmsRepository } from '../repository/films.repository.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
  constructor(
    @Inject('FILMS_REPOSITORY')
    private readonly filmsRepository: IFilmsRepository,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<TicketResponseDto[]> {
    const result: TicketResponseDto[] = [];

    for (const ticket of dto.tickets) {
      const film = await this.filmsRepository.getById(ticket.film);
      if (!film) {
        throw new BadRequestException(`Film ${ticket.film} not found`);
      }

      const session = film.schedule.find((s) => s.id === ticket.session);
      if (!session) {
        throw new BadRequestException(`Session ${ticket.session} not found`);
      }

      const seatKey = `${ticket.row}:${ticket.seat}`;
      if (session.taken.includes(seatKey)) {
        throw new BadRequestException(
          `Seat ${ticket.row}:${ticket.seat} is already taken`,
        );
      }

      session.taken.push(seatKey);
      await this.filmsRepository.updateTaken(
        ticket.film,
        ticket.session,
        session.taken,
      );

      result.push({ ...ticket, id: uuidv4() });
    }

    return result;
  }
}

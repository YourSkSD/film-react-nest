import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto, TicketDto, TicketResponseDto } from './dto/order.dto';
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
      await this.bookSeat(ticket);
      result.push({ ...ticket, id: uuidv4() });
    }

    return result;
  }

  private async bookSeat(ticket: TicketDto): Promise<void> {
    const seatKey = `${ticket.row}:${ticket.seat}`;

    const matched = await this.filmsRepository.bookSeatAtomic(
      ticket.film,
      ticket.session,
      seatKey,
    );

    if (!matched) {
      throw new BadRequestException(
        `Seat ${ticket.row}:${ticket.seat} is already taken`,
      );
    }
  }
}

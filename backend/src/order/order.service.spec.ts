import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { IFilmsRepository } from '../repository/films.repository.interface';
import { fixtures } from './order.fixtures';

describe('OrderService', () => {
  let service: OrderService;

  // Занятым считается место 1:2, все остальные свободны
  const filmsRepository: Partial<IFilmsRepository> = {
    bookSeatAtomic: jest.fn(
      (_filmId: string, _sessionId: string, seatKey: string) =>
        Promise.resolve(seatKey !== '1:2'),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: 'FILMS_REPOSITORY', useValue: filmsRepository },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should book a free seat and assign an id', async () => {
    const dto = {
      email: 'user@example.com',
      phone: '+70000000000',
      tickets: [fixtures.postOrderTicket],
    };

    const result = await service.createOrder(dto);

    expect(filmsRepository.bookSeatAtomic).toHaveBeenCalledWith(
      fixtures.postOrderTicket.film,
      fixtures.postOrderTicket.session,
      '3:4',
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject(fixtures.postOrderTicket);
    expect(result[0].id).toEqual(expect.any(String));
  });

  it('should throw if the seat is already taken', async () => {
    const dto = {
      email: 'user@example.com',
      phone: '+70000000000',
      tickets: [fixtures.takenOrderTicket],
    };

    await expect(service.createOrder(dto)).rejects.toThrow('already taken');
  });
});

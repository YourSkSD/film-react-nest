import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { IFilmsRepository } from '../repository/films.repository.interface';
import { fixtures } from './order.fixtures';

describe('OrderController', () => {
  let controller: OrderController;

  // Занятым считается место 1:2, все остальные свободны
  const filmsRepository: Partial<IFilmsRepository> = {
    bookSeatAtomic: jest.fn(
      (_filmId: string, _sessionId: string, seatKey: string) =>
        Promise.resolve(seatKey !== '1:2'),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        OrderService,
        { provide: 'FILMS_REPOSITORY', useValue: filmsRepository },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should succeed if the seat is empty', async () => {
    const res = await controller.createOrder({
      email: 'user@example.com',
      phone: '+70000000000',
      tickets: [fixtures.postOrderTicket],
    });

    expect(res.total).toBe(1);
    expect(res.items).toHaveLength(1);
    expect(res.items[0]).toMatchObject(fixtures.postOrderTicket);
    expect(res.items[0].id).toEqual(expect.any(String));
  });

  it('should fail if the seat is busy', async () => {
    const res = controller.createOrder({
      email: 'user@example.com',
      phone: '+70000000000',
      tickets: [fixtures.takenOrderTicket],
    });

    await expect(res).rejects.toThrow('already taken');
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { fixtures as filmFixtures } from '../films/films.fixtures';
import { OrderController } from './order.controller';
import { fixtures } from './order.fixtures';
import { FilmsService } from '../films/films.service';
import { OrderService } from './order.service';

const fakeRepository = {
  films: {
    findAll: jest.fn().mockResolvedValue(filmFixtures.films),
    findById: jest.fn().mockResolvedValue(filmFixtures.film),
    save: jest.fn().mockResolvedValue(filmFixtures.film.id),
  },
};

describe('OrderController', () => {
  let controller: OrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [FilmsService, OrderService],
    })
      .useMocker((token) => {
        if (token === 'REPOSITORY') {
          return fakeRepository;
        }
        throw new Error(`Token ${token.toString()} not found!`);
      })
      .compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should succeed if place is empty', async () => {
    expect(controller).toBeDefined();
    const res = await controller.createOrder({
      email: 'xxx',
      phone: '+7',
      tickets: [fixtures.postOrderTicket],
    });
    expect(res).toEqual({ total: 1, items: [fixtures.postOrderTicket] });
  });

  it('should fail if place is busy', async () => {
    expect(controller).toBeDefined();
    const requestSeatTaken = { ...fixtures.postOrderTicket, row: 1, seat: 2 };
    const res = controller.createOrder({
      email: 'xxx',
      phone: '+7',
      tickets: [requestSeatTaken],
    });
    await expect(res).rejects.toThrow('already taken');
  });
});

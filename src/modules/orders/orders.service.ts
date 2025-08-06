import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) { }

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    const order = this.orderRepository.create({
      user: { id: userId },
      items: createOrderDto.items.map(item => ({
        product: { id: item.productId },
        quantity: item.quantity,
        price: 0, // Calcula el precio real aquí (ej: consultando la BD)
      })),
      total: 0, // Calcula el total sumando (price * quantity) de cada item
    });
    return this.orderRepository.save(order);
  }

  async findAll(userId: string, userRole: UserRole): Promise<Order[]> {
    return this.orderRepository.find({
      where: userRole === UserRole.ADMIN ? {} : { user: { id: userId } },
      relations: ['user', 'items', 'items.product'],
    });
  }

  /**
   * Find an order by its ID.
   *
   * @param id The order ID to search for.
   * @returns The order if found, otherwise `null`.
   * @throws {NotFoundException} If the order is not found.
   */

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
    if (!order) throw new NotFoundException('Orden no encontrada');
    return order;
  }
}
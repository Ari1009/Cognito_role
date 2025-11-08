import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private emailService: EmailService,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId?: string): Promise<Order> {
    const order = this.orderRepository.create({
      ...createOrderDto,
      userId: userId || null,
      deliveryCharge: createOrderDto.deliveryCharge || 0,
      paymentMethod: createOrderDto.paymentMethod || 'cash',
      shippingMethod: createOrderDto.shippingMethod || 'free',
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items
    const orderItems = createOrderDto.items.map((item) =>
      this.orderItemRepository.create({
        ...item,
        orderId: savedOrder.id,
      }),
    );

    await this.orderItemRepository.save(orderItems);

    // Fetch complete order with items
    const completeOrder = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['items'],
    });

    // Send order confirmation email
    try {
      await this.emailService.sendOrderConfirmation(
        createOrderDto.email,
        completeOrder,
      );
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      // Don't throw error, order is already created
    }

    return completeOrder;
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['items', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'user'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findByUser(userId: string): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    await this.orderRepository.update(id, { status });
    return this.findOne(id);
  }
}

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  deliveryCharge: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column('text')
  address: string;

  @Column()
  city: string;

  @Column()
  postCode: string;

  @Column()
  country: string;

  @Column()
  regionState: string;

  @Column({ default: 'pending' })
  status: string; // pending, processing, shipped, delivered, cancelled

  @Column({ default: 'cash' })
  paymentMethod: string; // cash, card, bank transfer

  @Column({ default: 'free' })
  shippingMethod: string; // free, flat rate

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  originalPrice: number;

  @Column()
  image: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ nullable: true })
  weight: string;

  @Column({ nullable: true })
  size: string;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ nullable: true })
  badge: string; // 'sale', 'hot', 'best', etc.

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

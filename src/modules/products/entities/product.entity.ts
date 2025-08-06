import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OrderItem } from 'src/modules/orders/entities/order-item.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('float')
  price: number;

  @Column('int')
  stock: number;

  @Column()
  category: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
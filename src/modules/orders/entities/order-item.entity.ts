
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './../../products/entities/product.entity';

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Order, (order) => order.orderItems)
    order: Order;

    @Column()
    orderId: string;

    @ManyToOne(() => Product, (product) => product.orderItems)
    product: Product;

    @Column()
    productId: string;

    @Column('int')
    quantity: number;
}
import { Controller, Post, Body, Get, Param, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

import { Request } from 'express';
import { AuthenticatedRequest } from 'src/common/interfaces/request.interface';
import { UserRole } from '../users/entities/user.entity';
import { Roles, RolesGuard } from 'src/common/guard/roles.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(UserRole.USER) // Solo usuarios autenticados
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.ordersService.create(createOrderDto, req.user.sub);
  }

  @Get()
  @Roles(UserRole.USER, UserRole.ADMIN)
  async findAll(@Req() req: AuthenticatedRequest) {
    return this.ordersService.findAll(req.user.sub, req.user.role);
  }

  @Get(':id')
  @Roles(UserRole.USER, UserRole.ADMIN)
  async findOne(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const order = await this.ordersService.findOne(id);
    if (order.user.id !== req.user.sub && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('No tienes permiso para ver esta orden');
    }
    return order;
  }
}
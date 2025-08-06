import { Controller, Get, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { UserRole } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos los usuarios (admin)' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  async findAll(@Request() req) {
    if (req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Solo admins pueden listar usuarios');
    }
    return this.usersService.findAll();
  }
}
/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch, 
  Param,
  Delete,
  ParseUUIDPipe, 
  Query,
  DefaultValuePipe, 
  ParseIntPipe,  
  HttpCode,
  HttpStatus,
  ParseFloatPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { UserRole } from '../users/entities/user.entity';
import { Roles } from 'src/common/guard/roles.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(UserRole.ADMIN)  // Solo admins pueden crear productos
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'El producto ha sido creado exitosamente.', type: Product })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.'})
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los productos con paginación y filtrado' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Cantidad de items por página' })
  @ApiQuery({ name: 'category', required: false, description: 'Filtrar por categoría' })
  @ApiResponse({ status: 200, description: 'Lista de productos.', type: [Product] })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('category') category?: string,
    @Query('minPrice', ParseFloatPipe) minPrice?: number,
  ) {
    
    const options = {
      take: limit,
      skip: (page - 1) * limit,
      where: category ? { category } : {},
    };
    return this.productsService.findAll(options);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto encontrado.', type: Product })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.'})
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id') 
  @Roles(UserRole.ADMIN)  // Solo admin
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente.', type: Product })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.'})
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)  // Solo admin
  @HttpCode(HttpStatus.NO_CONTENT) 
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiResponse({ status: 204, description: 'Producto eliminado exitosamente.'})
  @ApiResponse({ status: 404, description: 'Producto no encontrado.'})
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch, // Usaremos Patch para actualizaciones parciales
  Param,
  Delete,
  ParseUUIDPipe, // Para validar que el ID es un UUID
  Query,
  DefaultValuePipe, // Para valores por defecto en paginación
  ParseIntPipe,   // Para convertir query params a números
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Product } from './entities/product.entity';

@ApiTags('products') // Agrupa los endpoints en Swagger bajo "products"
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
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
  ) {
    // Construimos las opciones para TypeORM
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

  @Patch(':id') // Es más común usar PATCH para actualizaciones parciales
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
  @HttpCode(HttpStatus.NO_CONTENT) // Retornar 204 No Content es una buena práctica para DELETE
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiResponse({ status: 204, description: 'Producto eliminado exitosamente.'})
  @ApiResponse({ status: 404, description: 'Producto no encontrado.'})
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
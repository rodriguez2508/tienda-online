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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('products') // Agrupa los endpoints en Swagger bajo "products"
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'The product has been successfully created.'})
  @ApiResponse({ status: 400, description: 'Bad Request.'})
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all products with pagination and filtering' })
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
  @ApiOperation({ summary: 'Get a single product by ID' })
  @ApiResponse({ status: 200, description: 'Product found.'})
  @ApiResponse({ status: 404, description: 'Product not found.'})
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id') // Es más común usar PATCH para actualizaciones parciales
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully.'})
  @ApiResponse({ status: 404, description: 'Product not found.'})
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Retornar 204 No Content es una buena práctica para DELETE
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully.'})
  @ApiResponse({ status: 404, description: 'Product not found.'})
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
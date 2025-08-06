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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserRole } from '../users/entities/user.entity';
import { Roles } from 'src/common/guard/roles.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(UserRole.ADMIN)  // Solo admins pueden crear productos
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
  @ApiOperation({ summary: 'Get a single product by ID' })
  @ApiResponse({ status: 200, description: 'Product found.'})
  @ApiResponse({ status: 404, description: 'Product not found.'})
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id') 
  @Roles(UserRole.ADMIN)  // Solo admin
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
  @Roles(UserRole.ADMIN)  // Solo admin
  @HttpCode(HttpStatus.NO_CONTENT) 
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully.'})
  @ApiResponse({ status: 404, description: 'Product not found.'})
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
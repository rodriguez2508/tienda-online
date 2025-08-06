/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  // Inyectamos el repositorio de la entidad Product
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepository.create(createProductDto);
    return await this.productRepository.save(newProduct);
  }

  async findAll(options?: FindManyOptions<Product>): Promise<Product[]> {
    // El controlador se encargará de construir las opciones de paginación/filtros
    return await this.productRepository.find(options);
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      // Lanzamos una excepción estándar de NestJS si no se encuentra
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    // `preload` busca el producto y lo fusiona con los nuevos datos del DTO.
    // Si no lo encuentra, retorna undefined.
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
    });
    
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    
    return await this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const result = await this.productRepository.delete(id);
    
    // `delete` retorna un objeto con `affected`. Si es 0, no se borró nada.
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
  }
}
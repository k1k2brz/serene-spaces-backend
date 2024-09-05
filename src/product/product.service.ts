import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

import { User } from '../user/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { userRole } from '@/_configs';
import { ProductNotFoundException } from '@/_exceptions/product/product-not-found.exception';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<Product> {
    const product = this.productRepository.create({
      ...createProductDto,
      companyName: user.companyName,
      vendor: user,
    });

    return this.productRepository.save(product);
  }

  // 제품 조회
  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['reviews'],
    });
    if (!product) {
      throw new ProductNotFoundException();
    }

    return product;
  }

  // 전체 제품 조회
  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
    user: User,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // 제품을 등록한 사용자 또는 admin만 수정 가능
    if (product.vendor.id !== user.id && user.role !== userRole.ADMIN) {
      throw new UnauthorizedException(
        'You do not have permission to update this product',
      );
    }

    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  // 제품 삭제
  async deleteProduct(id: number, user: User): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // 제품을 등록한 사용자 또는 admin만 삭제 가능
    if (product.vendor.id !== user.id && user.role !== userRole.ADMIN) {
      throw new UnauthorizedException(
        'You do not have permission to delete this product',
      );
    }

    await this.productRepository.delete(id);
  }
}

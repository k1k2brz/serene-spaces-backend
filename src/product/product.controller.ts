import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';

import { userRole } from '@/_configs';
import { RolesGuard } from '@/_lib/guard/role.guard';
import { Roles } from '@/_decorator/roles.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 제품 등록 (authorization 추가)
  @Post('create')
  @UseGuards(RolesGuard)
  @Roles(userRole.VENDOR, userRole.ADMIN)
  async createProduct(@Body() createProductDto: CreateProductDto, @Req() req) {
    return this.productService.createProduct(createProductDto, req.user);
  }

  // 특정 제품 조회
  @Get(':id')
  async getProduct(@Param('id') id: number) {
    return this.productService.getProductById(id);
  }

  // 모든 제품 조회
  @Get()
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  // 제품 수정
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(userRole.VENDOR, userRole.ADMIN)
  async updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req,
  ) {
    return this.productService.updateProduct(id, updateProductDto, req.user);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(userRole.VENDOR, userRole.ADMIN)
  async deleteProduct(@Param('id') id: number, @Req() req) {
    return this.productService.deleteProduct(id, req.user);
  }
}

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
  UnauthorizedException,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from './product.service';

import { userRole } from '@/_configs';
import { RolesGuard } from '@/_lib/guard/role.guard';
import { Roles } from '@/_decorator/roles.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '@/_lib/guard/jwt.auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 제품 등록 (authorization 추가)
  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(userRole.VENDOR, userRole.ADMIN)
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      // 'images' 필드에서 최대 5개의 파일을 처리
      storage: diskStorage({
        destination: './uploads/product',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
        },
      }),
    }),
  )
  async createProduct(
    @UploadedFiles() file: Express.Multer.File[],
    @Body() createProductDto: CreateProductDto,
    @Req() req,
  ) {
    if (!req.user || !req.user.role) {
      throw new UnauthorizedException('User is not authenticated');
    }

    // 파일 경로를 DTO의 images 필드에 추가
    createProductDto.images = file.map((file) => file.filename);

    console.log('File:', file);
    console.log('Body:', createProductDto);
    console.log('Received user from request:', req.user);

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(userRole.VENDOR, userRole.ADMIN)
  async updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req,
  ) {
    return this.productService.updateProduct(id, updateProductDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(userRole.VENDOR, userRole.ADMIN)
  async deleteProduct(@Param('id') id: number, @Req() req) {
    return this.productService.deleteProduct(id, req.user);
  }
}

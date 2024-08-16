import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  images: string[];
  @ApiProperty()
  options: string[];
  @ApiProperty()
  companyName: string;
  @ApiProperty()
  vendorId: number; // 제품을 등록한 사용자의 ID
}

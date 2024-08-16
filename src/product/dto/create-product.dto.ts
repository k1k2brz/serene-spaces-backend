import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1) // 최소 1개의 이미지를 등록
  images: string[];

  @ApiProperty()
  @IsString({ each: true })
  @IsArray()
  @IsNotEmpty()
  options: string[];
}

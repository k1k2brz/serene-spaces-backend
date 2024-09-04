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
  @IsString({ message: '제품명은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '제품명을 입력해주세요.' })
  productName: string;

  @ApiProperty()
  @IsString({ message: '제품설명은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '제품 설명을 입력해주세요.' })
  description: string;

  @ApiProperty()
  @IsNumber({}, { message: '가격은 숫자 형식이어야 합니다.' })
  @IsNotEmpty({ message: '가격을 입력해주세요.' })
  price: number;

  @ApiProperty()
  @IsArray({ message: '이미지 목록은 배열이어야 합니다.' })
  @ArrayMinSize(1, { message: '최소 1개의 이미지를 등록해야 합니다.' })
  images: string[];

  @ApiProperty()
  @IsString({ each: true, message: '옵션은 문자열이어야 합니다.' })
  @IsArray({ message: '옵션 목록은 배열이어야 합니다.' })
  @IsNotEmpty({ message: '옵션을 입력해주세요.' })
  options: string[];
}

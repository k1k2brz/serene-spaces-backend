import { userRole } from '@/_configs';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: '유저의 권한',
    default: 'customer',
    enum: [Object.values(userRole)],
  })
  @IsNotEmpty()
  role: string;

  @ApiProperty({
    description: '유저의 비밀번호',
    example: '1234',
  })
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty({
    description: '유저의 회사명',
    example: 'Acme Corporation',
  })
  @ValidateIf((o) => o.role === userRole.VENDOR) // role이 VENDOR일 때만 유효성 검사
  @IsOptional()
  @IsString()
  companyName: string;

  @ApiProperty({
    description: '기업 로고 이미지 URL',
    example: 'https://example.com/logo.png',
  })
  @ValidateIf((o) => o.role === userRole.VENDOR)
  @IsOptional() // VENDOR가 아닐 경우 선택 사항
  @IsString()
  logoUrl: string;
}

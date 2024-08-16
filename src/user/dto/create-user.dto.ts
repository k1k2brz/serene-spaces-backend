import { userRole } from '@/_configs';
import { UserRole } from '@/_types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';

// create-user.dto.ts
export class CreateUserDto {
  @ApiProperty({
    description: '유저의 이메일',
    example: 'acme@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '유저의 비밀번호',
    example: '1234',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: '유저의 권한',
    default: 'customer',
    enum: [Object.values(userRole)],
  })
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({
    description: '유저의 회사명',
    example: 'Acme Corporation',
  })
  @ValidateIf((o) => o.role === userRole.VENDOR) // role이 VENDOR일 때만 유효성 검사
  @IsNotEmpty({ message: '회사명은 Vendor 계정에 필수입니다.' })
  companyName: string;
}

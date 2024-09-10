import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { userRole } from '@/_configs';
import { UserRole } from '@/_types';

export class DeleteLogoDto {
  @ApiProperty({
    description: '유저의 비밀번호',
    example: '1234',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: '유저의 권한',
    default: 'customer',
    enum: [Object.values(userRole)],
  })
  @IsNotEmpty()
  role: UserRole;
}

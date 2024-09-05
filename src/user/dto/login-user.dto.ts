import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
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
}

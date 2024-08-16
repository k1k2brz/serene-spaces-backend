import { userRole } from '@/_configs';
import { UserRole } from '@/_types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

// create-user.dto.ts
export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: '유저의 권한',
    default: 'customer',
    enum: [Object.values(userRole)],
  })
  role?: UserRole;
}

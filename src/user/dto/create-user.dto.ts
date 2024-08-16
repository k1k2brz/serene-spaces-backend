import { userRole } from '@/_configs';
import { UserRole } from '@/_types';
import { ApiProperty } from '@nestjs/swagger';

// create-user.dto.ts
export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty({
    description: '유저의 권한',
    default: 'customer',
    enum: [Object.values(userRole)],
  })
  role?: UserRole;
}

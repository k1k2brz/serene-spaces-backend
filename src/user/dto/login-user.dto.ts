import { ApiProperty } from '@nestjs/swagger';

// login-user.dto.ts
export class LoginUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

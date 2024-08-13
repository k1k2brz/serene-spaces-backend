import { UserRole } from '@/_types';

// create-user.dto.ts
export class CreateUserDto {
  email: string;
  password: string;
  role?: UserRole;
}

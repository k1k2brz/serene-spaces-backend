import { UserRole } from '@/types';

// create-user.dto.ts
export class CreateUserDto {
  email: string;
  password: string;
  role?: UserRole;
}

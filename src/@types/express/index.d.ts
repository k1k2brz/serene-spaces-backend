import { User } from '@/user/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User; // user가 Request 객체에 존재함을 선언
    }
  }
}

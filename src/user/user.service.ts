import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { InvalidEmailException } from '@/_exceptions/user/email/email-invalid.exception';
import { InvalidPasswordException } from '@/_exceptions/user/password/password-invalid.exception';
import { UserNotFoundException } from '@/_exceptions/user/user-not-found.exception';
import { EmailAlreadyExistsException } from '@/_exceptions/user/email/email-already-exists.exception';
import { CompanyNameRequiredException } from '@/_exceptions/user/company/companyname-required.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // User 엔티티를 저장 또는 업데이트하는 메서드
  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  // login 검사
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new InvalidEmailException();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new InvalidPasswordException();
    }

    return user;
  }

  // 유저 정보 받기
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  // 회원가입
  async signup(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, role, companyName } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }

    if (!email) {
      throw new InvalidEmailException();
    }

    if (!password) {
      throw new InvalidPasswordException();
    }

    if (role === 'VENDOR' && !companyName) {
      throw new CompanyNameRequiredException();
    }

    // 비밀번호 해싱
    const saltRounds = 10; // 해싱 강도
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 유저 생성 및 저장
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      role,
      companyName,
    });

    return this.userRepository.save(newUser);
  }
}

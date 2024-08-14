import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

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

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      // 비밀번호 검사
      return user;
    }
    return null;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, role } = createUserDto;

    // 비밀번호 해싱
    const saltRounds = 10; // 해싱 강도
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 유저 생성 및 저장
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      role,
    });

    return this.userRepository.save(newUser);
  }
}

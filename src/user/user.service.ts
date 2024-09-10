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
import { UpdateUserDto } from './dto/update-user.dto';
import * as fs from 'fs';
import { UserResponseDto } from './dto/response-user.dto';
import { plainToInstance } from 'class-transformer';
import { userRole } from '@/_configs';
import path from 'path';

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
    console.log(user);

    if (!user) {
      throw new InvalidEmailException();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new InvalidPasswordException();
    }

    return user;
  }

  // 유저 전체
  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find();
    return users.map((user) => plainToInstance(UserResponseDto, user));
  }

  // 유저 정보 받기
  async findById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UserNotFoundException();
    }

    const { password, ...rest } = user;
    return plainToInstance(UserResponseDto, rest);
  }

  // 회원가입
  async signup(createUserDto: CreateUserDto, logoUrl?: string): Promise<User> {
    const { email, password, role, companyName } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (!email) {
      throw new InvalidEmailException();
    }

    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }

    if (!password) {
      throw new InvalidPasswordException();
    }

    if (role === userRole.VENDOR && !companyName) {
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
      logoUrl,
    });

    return this.userRepository.save(newUser);
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found.');
    }

    if (updateUserDto.role === userRole.VENDOR) {
      if (file) {
        if (user.logoUrl) {
          fs.unlinkSync(
            `${process.env.UPLOAD_PATH}/${user.logoUrl.split('/').pop()}`,
          );
        }
        user.logoUrl = `${process.env.UPLOAD_PATH}/${file.filename}`;
      }
    } else {
      // VENDOR가 아닌 경우 companyName과 logoUrl은 업데이트하지 않음
      delete updateUserDto.companyName;
      delete updateUserDto.logoUrl;
    }

    if (updateUserDto.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
      updateUserDto.password = hashedPassword;
    }

    Object.assign(user, updateUserDto);

    return this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error('User not found.');
    }

    // 로고 이미지가 있는 경우 삭제
    if (user.logoUrl) {
      const logoPath = path.join(
        process.env.UPLOAD_PATH,
        user.logoUrl.split('/').pop(),
      );

      try {
        if (fs.existsSync(logoPath)) {
          fs.unlinkSync(logoPath);
          console.log(`Logo image ${logoPath} has been deleted.`);
        }
      } catch (err) {
        console.error(`Failed to delete logo image: ${err.message}`);
        // 에러처리 추가
      }
    }

    // 유저 삭제
    await this.userRepository.delete(id);
  }

  // 로고 업로드
  async uploadLogo(userId: number, file: Express.Multer.File): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found.');
    }

    if (file) {
      if (user.logoUrl) {
        fs.unlinkSync(
          `${process.env.UPLOAD_PATH}/${user.logoUrl.split('/').pop()}`,
        );
      }
      user.logoUrl = `${process.env.UPLOAD_PATH}/${file.filename}`;
    }

    return this.userRepository.save(user);
  }

  // 로고 삭제
  async deleteLogo(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found.');
    }

    if (user.logoUrl) {
      const logoPath = path.join(
        process.env.UPLOAD_PATH,
        user.logoUrl.split('/').pop(),
      );

      try {
        if (fs.existsSync(logoPath)) {
          fs.unlinkSync(logoPath);
          console.log(`Logo image ${logoPath} has been deleted.`);
        }
      } catch (err) {
        console.error(`Failed to delete logo image: ${err.message}`);
      }

      user.logoUrl = null;
      return this.userRepository.save(user);
    }

    return user;
  }
}

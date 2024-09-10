import * as fs from 'fs';
import { AuthService } from '@/user/auth/auth.service';
import { JwtAuthGuard } from '@/_lib/guard/jwt.auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/response-user.dto';
import { imageFileFilter } from '@/_lib/interceptor/file.interceptor';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // 회원가입
  @Post('signup')
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: async (req, file, cb) => {
          const uploadPath = process.env.UPLOAD_PATH;

          // 폴더가 존재하지 않으면 생성
          try {
            if (!fs.existsSync(uploadPath)) {
              await fs.promises.mkdir(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
          } catch (err) {
            cb(err, uploadPath);
          }
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
        },
      }),
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 이하로 파일 크기 제한
    }),
  )
  async signup(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // file이 존재할 경우 파일 경로를 처리
    let logoUrl = null;
    if (file) {
      logoUrl = `${process.env.UPLOAD_PATH}/${file.filename}`;
    }

    return this.userService.signup(createUserDto, logoUrl);
  }

  // 로그인
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // 전체 유저 받기
  @Get()
  async getAllUsers(): Promise<UserResponseDto[]> {
    return this.userService.getAllUsers();
  }

  // 개별 유저 받기
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: number): Promise<UserResponseDto> {
    return this.userService.findById(id);
  }

  // 유저 수정
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: async (req, file, cb) => {
          const uploadPath = process.env.UPLOAD_PATH;

          // 폴더가 존재하지 않으면 생성
          try {
            if (!fs.existsSync(uploadPath)) {
              await fs.promises.mkdir(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
          } catch (err) {
            cb(err, uploadPath);
          }
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
        },
      }),
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 이하로 파일 크기 제한
    }),
  )
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto, file);
  }

  // 유저 삭제
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }

  // 회사 로고 등록
  @UseGuards(JwtAuthGuard)
  @Post('upload-logo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: async (req, file, cb) => {
          const uploadPath = process.env.UPLOAD_PATH;

          try {
            if (!fs.existsSync(uploadPath)) {
              await fs.promises.mkdir(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
          } catch (err) {
            cb(err, uploadPath);
          }
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
        },
      }),
    }),
  )
  async uploadLogo(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const userId = req.user.id;
    return this.userService.uploadLogo(userId, file);
  }

  // 회사 로고 삭제
  @UseGuards(JwtAuthGuard)
  @Delete('delete-logo')
  async deleteLogo(@Req() req) {
    const userId = req.user.id;
    return this.userService.deleteLogo(userId);
  }
}

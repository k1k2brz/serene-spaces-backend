import { AuthService } from '@/user/auth/auth.service';
import { JwtAuthGuard } from '@/user/auth/jwt.auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // 회원가입
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.signup(createUserDto);
  }

  // 로그인
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // 전체 유저 받기
  @UseGuards(JwtAuthGuard)
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
  @Put(':id')
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
        destination: process.env.UPLOAD_PATH,
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
    return this.userService.updateUser(userId, {}, file);
  }

  // 회사 로고 삭제
  @UseGuards(JwtAuthGuard)
  @Delete('delete-logo')
  async deleteLogo(@Req() req) {
    const userId = req.user.id;
    return this.userService.updateUser(userId, { logoUrl: null });
  }
}

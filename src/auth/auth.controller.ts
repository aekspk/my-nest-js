import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserResponseDto } from 'src/users/dtos/user-response.dto';
import { RegisterAuthGuard } from './guards/register-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { LoginAuthGuard } from './guards/login-auth.guard';
import { ProfileWithTokenDto } from './dtos/profile-with-tokens.dto';
import { AccessTokenAuthGuard } from './guards/access-token-auth.guard';
import { UploadFileInterceptor } from 'src/core/interceptors/upload-file.interceptor';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';
import { RefreshTokenAuthGuard } from './guards/refresh-token-auth.guard';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { Login } from './dtos/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @Post('register')
  @UseGuards(RegisterAuthGuard)
  register(@CurrentUser() user: User) {
    return new UserResponseDto(user);
  }

  //POST /auth/login
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: Login })
  @Post('login')
  @UseGuards(LoginAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async login(@CurrentUser() user: User) {
    const profileWithTokens =
      await this.authService.generateProfileWithTokens(user);

    return new ProfileWithTokenDto(profileWithTokens);
  }

  //POST /auth/refresh-token
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBearerAuth()
  @Post('refresh-token')
  @UseGuards(RefreshTokenAuthGuard)
  async refreshToken(@CurrentUser() user: User) {
    const profileWithTokens =
      await this.authService.generateProfileWithTokens(user);

    return new ProfileWithTokenDto(profileWithTokens);
  }

  // GET /auth/profile
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth()
  @Get('profile')
  @UseGuards(AccessTokenAuthGuard)
  async getProfile(@CurrentUser() user: User) {
    const profile = await this.authService.getProfile(user.id);
    return new UserResponseDto(profile);
  }

  // PATCH /auth/profile
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
        name: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        address: { type: 'object' },
      },
    },
  })
  @Patch('profile')
  @UploadFileInterceptor('image', { destination: 'uploads/users' })
  async updateProfile(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Body() form: Omit<UpdateUserDto, 'image'>,
  ) {
    const profile = await this.authService.updateProfile(user.id, {
      ...form,
      image: file.filename,
    });

    return new UserResponseDto(profile);
  }

  //DELETE /auth/logout
  @ApiOperation({ summary: 'Logout current user' })
  @ApiBearerAuth()
  @Delete('logout')
  @UseGuards(AccessTokenAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id);
  }
}

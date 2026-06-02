import type { User } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from 'src/users/dtos/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileWithTokenDto {
  @ApiProperty({ type: () => UserResponseDto })
  @Expose()
  @Type(() => UserResponseDto)
  profile: User;

  @ApiProperty({ example: 'eyJhbGci...' })
  @Expose()
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGci...' })
  @Expose()
  refreshToken: string;

  @ApiProperty({ example: 300 })
  @Expose()
  expiresIn: number;

  constructor(profileWithTokens: Partial<ProfileWithTokenDto>) {
    Object.assign(this, profileWithTokens);
  }
}

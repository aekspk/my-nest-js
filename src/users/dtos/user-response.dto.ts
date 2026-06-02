import { Role, User } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';
import { UserAddressDto } from './user-address.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  image: string;

  @ApiProperty({ example: 'Member' })
  @Expose()
  @Transform(({ value }) => {
    switch (value) {
      case Role.ADMIN:
        return 'Admin';
      case Role.MODERATOR:
        return 'Moderator';
      default:
        return 'Member';
    }
  })
  role: Role;

  @ApiProperty({ type: () => UserAddressDto })
  @Expose()
  @Type(() => UserAddressDto)
  address: UserAddressDto;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}

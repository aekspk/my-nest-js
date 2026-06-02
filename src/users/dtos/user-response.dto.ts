import { Role, User } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';
import { UserAddressDto } from './user-address.dto';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  image: string;

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

  @Expose()
  @Type(() => UserAddressDto)
  address: UserAddressDto;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}

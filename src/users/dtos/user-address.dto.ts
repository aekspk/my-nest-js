import { Address } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserAddressDto {
  @ApiProperty({ example: '123' })
  @Expose()
  @IsString()
  houseNumber: string;

  @ApiProperty({ required: false, example: 'Moo 5' })
  @Expose()
  @IsString()
  @IsOptional()
  village?: string;

  @ApiProperty({ example: 'Sukhumvit Rd' })
  @Expose()
  @IsString()
  road: string;

  @ApiProperty({ example: 'Watthana' })
  @Expose()
  @IsString()
  district: string;

  @ApiProperty({ example: 'Bangkok' })
  @Expose()
  @IsString()
  province: string;

  @ApiProperty({ example: '10110' })
  @Expose()
  @IsString()
  postalCode: string;

  constructor(address: Address) {
    Object.assign(this, address);
  }
}

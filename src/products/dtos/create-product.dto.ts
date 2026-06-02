import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro' })
  @IsString()
  @Length(5, 50)
  name: string;

  @ApiProperty({ example: 'Latest Apple smartphone' })
  @IsString()
  @Length(5, 50)
  desc: string;

  @ApiProperty({ example: 49999 })
  @Transform(({ value }) => +value)
  @IsNumber()
  price: number;

  @ApiProperty({ type: [Number], example: [1, 2] })
  @Transform(({ value }) => (value as string[]).map((i) => +i))
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  categoryIds: number[];
}

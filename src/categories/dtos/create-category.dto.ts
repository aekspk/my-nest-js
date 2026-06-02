import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics' })
  @IsString()
  @Length(5, 50)
  name: string;

  @ApiProperty({ example: 'All kinds of electronic devices and accessories' })
  @IsString()
  @Length(10, 150)
  desc;
}

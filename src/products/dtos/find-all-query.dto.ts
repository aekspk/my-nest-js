import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllQueryDto {
  @ApiProperty({ required: false, example: 1 })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => +value)
  page?: number;

  @ApiProperty({ required: false, example: 1 })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => +value)
  limit?: number;
}

import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty()
  @Expose()
  page: number;

  @ApiProperty()
  @Expose()
  limit: number;

  @ApiProperty({ required: false })
  @Expose()
  previousPage?: number;

  @ApiProperty({ required: false })
  @Expose()
  nextPage?: number;

  @ApiProperty()
  @Expose()
  totalCount: number;

  constructor(meta: PaginationMetaDto) {
    Object.assign(this, meta);
  }
}

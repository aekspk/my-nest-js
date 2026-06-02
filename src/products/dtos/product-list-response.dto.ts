import { Expose, Type } from 'class-transformer';
import { ProductResponseDto } from './product-response.dto';
import { PaginationMetaDto } from './pagination-meta.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ProductListResponseDto {
  @ApiProperty({ type: () => PaginationMetaDto })
  @Expose()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;

  @ApiProperty({ type: () => [ProductResponseDto] })
  @Expose()
  @Type(() => ProductResponseDto)
  items: ProductResponseDto[];

  constructor(itemsPaging: ProductListResponseDto) {
    Object.assign(this, itemsPaging);
  }
}

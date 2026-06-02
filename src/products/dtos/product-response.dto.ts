import { Category, Product } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { CategoryResponseDto } from 'src/categories/dtos/category-response.dto';
import { ApiProperty } from '@nestjs/swagger';

type ProductInput = Product & { categories: Category[] };

export class ProductResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  slug: string;

  @ApiProperty()
  @Expose()
  desc: string;

  @ApiProperty()
  @Expose()
  price: number;

  @ApiProperty()
  @Expose()
  image: string;

  @ApiProperty({ type: () => [CategoryResponseDto] })
  @Expose()
  @Type(() => CategoryResponseDto)
  categories: Category[];

  constructor(product: Partial<ProductInput>) {
    Object.assign(this, product);
  }
}

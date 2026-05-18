import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FindAllQueryDto } from './dtos/find-all-query.dto';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductResponseDto } from './dtos/product-response.dto';
import { ProductListResponseDto } from './dtos/product-list-response.dto';
import { UniqueConstraintError } from 'src/core/errors/unique-constraint.error';
import { RecordNotFoundError } from 'src/core/errors/record-not-found.error';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}
  @Get()
  async findAll(@Query() query: FindAllQueryDto) {
    const itemsPaging = await this.productService.findAll({
      page: query.page,
      limit: query.limit,
    });

    return new ProductListResponseDto(itemsPaging);
  }

  @Get(':idOrSlug')
  async findOne(@Param('idOrSlug') idOrSlug: string) {
    const product = await this.productService.findByIdOrSlug(idOrSlug);
    if (!product) throw new NotFoundException();
    return new ProductResponseDto(product);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() form: CreateProductDto) {
    try {
      const product = await this.productService.create(form, 'file/path');
      return new ProductResponseDto(product);
    } catch (e) {
      if (e instanceof UniqueConstraintError) {
        throw new BadRequestException(e.message);
      }
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() form: UpdateProductDto,
  ) {
    try {
      const product = await this.productService.update(id, form, 'file/path');
      return new ProductResponseDto(product);
    } catch (e) {
      if (e instanceof RecordNotFoundError) throw new NotFoundException();

      if (e instanceof UniqueConstraintError) {
        throw new BadRequestException(e.message);
      }
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.productService.destroy(id);
    } catch (e) {
      if (e instanceof RecordNotFoundError) throw new NotFoundException();
    }
  }
}

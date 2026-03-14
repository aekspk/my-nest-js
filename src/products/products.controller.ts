import {
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

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}
  @Get()
  findAll(@Query() query: FindAllQueryDto) {
    const products = this.productService.findAll(query);
    return products.map((p) => new ProductResponseDto(p));
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const product = this.productService.findById(id);
      return new ProductResponseDto(product);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() form: CreateProductDto) {
    const product = this.productService.create(form);
    return new ProductResponseDto(product);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() form: UpdateProductDto,
  ) {
    try {
      const product = this.productService.update(id, form);
      return new ProductResponseDto(product);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.productService.remove(id);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}

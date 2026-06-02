import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryResponseDto } from './dtos/category-response.dto';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UniqueConstraintError } from 'src/core/errors/unique-constraint.error';
import { RecordNotFoundError } from 'src/core/errors/record-not-found.error';
import { Cache, CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
@UseInterceptors(CacheInterceptor)
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @ApiOperation({ summary: 'Get all categories' })
  @Get()
  async findAll() {
    const categories = await this.categoriesService.findAll();

    return categories.map((c) => new CategoryResponseDto(c));
  }

  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoriesService.findById(id);

    if (!category) throw new NotFoundException();

    return new CategoryResponseDto(category);
  }

  @ApiOperation({ summary: 'Create a new category' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() form: CreateCategoryDto) {
    try {
      const category = await this.categoriesService.create(form);

      this.cache.del('/categories');

      if (category) return new CategoryResponseDto(category);
    } catch (e) {
      if (e instanceof UniqueConstraintError) {
        throw new BadRequestException(e.message);
      }
    }
  }

  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiParam({ name: 'id', type: Number })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() form: CreateCategoryDto,
  ) {
    try {
      const category = await this.categoriesService.update(id, form);

      this.cache.del('/categories');
      this.cache.del(`/categories/${id}`);

      if (category) return new CategoryResponseDto(category);
    } catch (e) {
      if (
        e instanceof UniqueConstraintError ||
        e instanceof RecordNotFoundError
      ) {
        throw new BadRequestException(e.message);
      }
    }
  }

  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.categoriesService.destroy(id);

      this.cache.del('/categories');
      this.cache.del(`/categories/${id}`);
    } catch (e) {
      if (e instanceof RecordNotFoundError) {
        throw new BadRequestException(e.message);
      }
    }
  }
}

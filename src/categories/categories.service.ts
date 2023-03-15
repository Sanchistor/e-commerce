import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findManyByIds(arrayOfIds: Array<string>) {
    const categories = await this.categoryRepository
      .createQueryBuilder()
      .where('id IN(:...arrayOfIds)', { arrayOfIds })
      .getMany();
    return categories;
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOne(id: string) {
    return await this.categoryRepository.findOne({ where: { id } });
  }

  async update(updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryRepository.save(updateCategoryDto);
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    return await this.categoryRepository.remove(category);
  }
}

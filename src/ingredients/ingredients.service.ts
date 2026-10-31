import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from './ingredient.entity.js';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  async findAll() {
    return this.ingredientRepository.find();
  }

  async findOne(id: number) {
    const ingredient = await this.ingredientRepository.findOne({ where: { id } });

    if (!ingredient) {
      throw new NotFoundException(`Ingredient with id ${id} not found`);
    }

    return ingredient;
  }

  async create(payload: any) {
    const ingredient = this.validateIngredient(payload);
    return this.ingredientRepository.save(ingredient);
  }

  async update(id: number, payload: any) {
    const existing = await this.ingredientRepository.findOne({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Ingredient with id ${id} not found`);
    }

    const ingredient = this.validateIngredient(payload, existing);
    await this.ingredientRepository.update(id, ingredient);
    return this.findOne(id);
  }

  async remove(id: number) {
    const ingredient = await this.findOne(id);
    await this.ingredientRepository.delete(id);
    return ingredient;
  }

  private validateIngredient(payload: any, current?: Partial<Ingredient>) {
    const name = this.getString(payload?.name || current?.name, 'name');
    const description = this.getString(payload?.description || current?.description || '', 'description');
    const isAlcoholic = typeof payload?.isAlcoholic === 'boolean'
      ? payload.isAlcoholic
      : Boolean(current?.isAlcoholic);
    const imageUrl = this.getString(payload?.imageUrl || current?.imageUrl || '', 'imageUrl');

    return { name, description, isAlcoholic, imageUrl };
  }

  private getString(value: unknown, fieldName: string) {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new BadRequestException(`${fieldName} is required and must be a non-empty string`);
    }

    return value.trim();
  }
}

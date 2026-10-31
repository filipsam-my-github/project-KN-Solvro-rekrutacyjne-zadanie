import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CocktailIngredient } from './cocktail-ingredient.entity.js';
import { Cocktail } from './cocktail.entity.js';
import { Ingredient } from '../ingredients/ingredient.entity.js';

@Injectable()
export class CocktailsService {
  constructor(
    @InjectRepository(Cocktail)
    private readonly cocktailRepository: Repository<Cocktail>,
    @InjectRepository(CocktailIngredient)
    private readonly cocktailIngredientRepository: Repository<CocktailIngredient>,
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  async findAll() {
    const cocktails = await this.cocktailRepository.find();
    const cocktailIds = cocktails.map((cocktail) => cocktail.id);

    const allIngredientAplications = cocktailIds.length
      ? await this.cocktailIngredientRepository.find({ where: { cocktailId: In(cocktailIds) } })
      : [];

    const ingredientIds = allIngredientAplications.map((link) => link.ingredientId);
    const ingredients = ingredientIds.length
      ? await this.ingredientRepository.find({ where: { id: In(ingredientIds) } })
      : [];

    const ingredientsById = new Map<number, Ingredient>(
      ingredients.map((ingredient) => [ingredient.id, ingredient]),
    );

    const cocktailIngredients = new Map<number, any[]>();

    for (const link of allIngredientAplications) {
      const list = cocktailIngredients.get(link.cocktailId) || [];

      list.push({
        ingredientId: link.ingredientId,
        name: ingredientsById.get(link.ingredientId)?.name || 'Składnik',
        quantity: Number(link.quantity || 0),
        unit: link.unit || '',
      });

      cocktailIngredients.set(link.cocktailId, list);
    }

    return cocktails.map((cocktail) => {
      const ingredientsForThisCocktail = cocktailIngredients.get(cocktail.id) || [];

      return {
        ...cocktail,
        ingredients: ingredientsForThisCocktail,
        instructions: this.buildInstructions(ingredientsForThisCocktail),
      };
    });
  }

  async findOne(id: number) {
    const cocktail = await this.cocktailRepository.findOne({ where: { id } });

    if (!cocktail) {
      throw new NotFoundException(`Cocktail with id ${id} not found`);
    }

    const rows = await this.cocktailIngredientRepository.find({ where: { cocktailId: id } });
    const ingredientIds = rows.map((row) => row.ingredientId);
    const ingredients = ingredientIds.length
      ? await this.ingredientRepository.find({ where: { id: In(ingredientIds) } })
      : [];

    const byId = new Map<number, Ingredient>(ingredients.map((ingredient) => [ingredient.id, ingredient]));
    const fullIngredients = rows.map((row) => ({
      ingredientId: row.ingredientId,
      name: byId.get(row.ingredientId)?.name || 'Składnik',
      quantity: Number(row.quantity || 0),
      unit: row.unit || '',
    }));

    return {
      ...cocktail,
      ingredients: fullIngredients,
      instructions: this.buildInstructions(fullIngredients),
    };
  }

  async create(payload: any) {
    const { name, category, isAlcoholic, ingredients } = this.validatePayload(payload);

    const cocktail = this.cocktailRepository.create({
      name,
      category,
      isAlcoholic,
    });

    const savedCocktail = await this.cocktailRepository.save(cocktail);

    if (Array.isArray(ingredients) && ingredients.length > 0) {
      for (const item of ingredients) {
        await this.cocktailIngredientRepository.save({
          cocktailId: savedCocktail.id,
          ingredientId: item.ingredientId,
          quantity: String(item.quantity),
          unit: item.unit || null,
        });
      }
    }

    return this.findOne(savedCocktail.id);
  }

  async update(id: number, payload: any) {
    const currentRecord = await this.cocktailRepository.findOne({ where: { id } });

    if (!currentRecord) {
      throw new NotFoundException(`Cocktail with id ${id} not found`);
    }

    const { name, category, isAlcoholic, ingredients } = this.validatePayload(payload, currentRecord);

    await this.cocktailRepository.update(id, { name, category, isAlcoholic });

    if (Array.isArray(ingredients)) {
      await this.cocktailIngredientRepository.delete({ cocktailId: id });

      for (const item of ingredients) {
        await this.cocktailIngredientRepository.save({
          cocktailId: id,
          ingredientId: item.ingredientId,
          quantity: String(item.quantity),
          unit: item.unit || null,
        });
      }
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const cocktail = await this.findOne(id);
    await this.cocktailRepository.delete(id);
    return cocktail;
  }

  private validatePayload(payload: any, current?: Partial<Cocktail>) {
    let name = '';
    let category = '';
    let isAlcoholic = false;
    let ingredients = [];

    if (payload && payload.name) {
      name = String(payload.name);
    } else if (current && current.name) {
      name = String(current.name);
    } else {
      throw new Error('Name is required');
    }

    if (payload && payload.category) {
      category = String(payload.category);
    } else if (current && current.category) {
      category = String(current.category);
    } else {
      throw new Error('Category is required');
    }

    if (payload && typeof payload.isAlcoholic === 'boolean') {
      isAlcoholic = payload.isAlcoholic;
    } else if (current && typeof current.isAlcoholic === 'boolean') {
      isAlcoholic = current.isAlcoholic;
    }

    if (Array.isArray(payload && payload.ingredients)) {
      ingredients = payload.ingredients;
    } else if (current && Array.isArray((current as any).ingredients)) {
      ingredients = (current as any).ingredients;
    } else {
      throw new Error('Ingredients must be an array');
    }

    return { name, category, isAlcoholic, ingredients };
  }

  private buildInstructions(ingredients: Array<{ name: string; quantity: number; unit: string }>) {
    if (!ingredients.length) {
      return 'Wymieszaj i podawaj.';
    }

    return ingredients
      .map((ingredient) => {
        const unit = (ingredient.unit || '').toLowerCase();
        const verb = this.generateVerb(unit);
        const quantity = Number(ingredient.quantity || 0);
        return `${verb} ${quantity} ${ingredient.unit || 'jednostkę'} ${ingredient.name}`;
      })
      .join('. ') + '. Wymieszaj i podawaj.';
  }

  private generateVerb(unit: string) {
    if (!unit) return 'Dodaj';
    if (unit.includes('ml') || unit.includes('l')) return 'Wlej';
    if (unit.includes('g') || unit.includes('kg')) return 'Dodaj';
    if (unit.includes('pcs') || unit.includes('szt')) return 'Wrzuć';
    return 'Dodaj';
  }
}

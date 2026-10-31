import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cocktail } from './cocktail.entity.js';
import { CocktailIngredient } from './cocktail-ingredient.entity.js';
import { CocktailsController } from './cocktails.controller.js';
import { CocktailsService } from './cocktails.service.js';
import { Ingredient } from '../ingredients/ingredient.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Cocktail, CocktailIngredient, Ingredient])],
  controllers: [CocktailsController],
  providers: [CocktailsService],
  exports: [CocktailsService],
})
export class CocktailsModule {}

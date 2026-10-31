import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cocktail_ingredients' })
export class CocktailIngredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cocktail_id' })
  cocktailId: number;

  @Column({ name: 'ingredient_id' })
  ingredientId: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  quantity: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  unit: string | null;
}

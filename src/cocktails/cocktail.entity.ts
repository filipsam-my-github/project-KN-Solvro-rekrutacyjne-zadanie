import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cocktails' })
export class Cocktail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 63 })
  name: string;

  @Column({ length: 63 })
  category: string;

  @Column({ name: 'is_alcoholic', default: false })
  isAlcoholic: boolean;
}

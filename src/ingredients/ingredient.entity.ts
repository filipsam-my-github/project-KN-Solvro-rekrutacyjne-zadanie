import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ingredients' })
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 63 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_alcoholic', default: false })
  isAlcoholic: boolean;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl: string | null;
}

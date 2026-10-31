import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CocktailsModule } from './cocktails/cocktails.module.js';
import { IngredientsModule } from './ingredients/ingredients.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'sql',
      database: 'cocktails_db',
      autoLoadEntities: true,
      synchronize: false,
      logging: false,
    }),
    CocktailsModule,
    IngredientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

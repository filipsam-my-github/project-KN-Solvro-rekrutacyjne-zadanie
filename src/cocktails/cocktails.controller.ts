import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CocktailsService } from './cocktails.service.js';

@Controller('cocktails')
export class CocktailsController {
  constructor(private readonly cocktailsService: CocktailsService) {}

  @Get()
  findAll() {
    return this.cocktailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cocktailsService.findOne(id);
  }

  @Post()
  create(@Body() payload: any) {
    return this.cocktailsService.create(payload);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() payload: any) {
    return this.cocktailsService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cocktailsService.remove(id);
  }
}

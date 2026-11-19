import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ClassesService } from './classes.service';

@Controller('classes') // rutas /api/classes
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get() // GET /api/classes?activity=yoga (el filtro es opcional)
  findAll(@Query('activity') activity?: string) {
    return this.classesService.findAll(activity);
  }

  @Get(':id') // GET /api/classes/7 → 400 si no es un número
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.classesService.findOne(id);
  }
}

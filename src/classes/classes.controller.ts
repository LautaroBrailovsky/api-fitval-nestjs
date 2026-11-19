import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  Version,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { StaffGuard } from '../auth/staff.guard';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { ListClassesQueryDto } from './dto/list-classes-query.dto';

@Controller('classes') // rutas /api/classes
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get() // GET /api/v1/classes?activity=yoga → un array, como siempre
  findAll(@Query('activity') activity?: string) {
    return this.classesService.findAll(activity);
  }

  @Get()
  @Version('2') // GET /api/v2/classes → { data, total, page, limit, totalPages }
  findPage(@Query() query: ListClassesQueryDto) {
    return this.classesService.findPage(query);
  }

  @Get(':id') // GET /api/classes/7 → 400 si no es un número
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.classesService.findOne(id);
  }

  @Post() // POST /api/classes → 201 (solo staff)
  @UseGuards(AuthGuard, StaffGuard)
  create(@Body() dto: CreateClassDto) {
    return this.classesService.create(dto);
  }

  @Delete(':id') // DELETE /api/classes/8 → 200, 404 o 409 (solo staff)
  @UseGuards(AuthGuard, StaffGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.classesService.remove(id);
  }
}

import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';

@Module({
  imports: [DatabaseModule, UsersModule], // el Pool y el UsersService (StaffGuard)
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}

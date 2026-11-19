import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { TrainersController } from './trainers.controller';
import { PhotosService } from './photos.service';
import { TrainersService } from './trainers.service';

@Module({
  imports: [DatabaseModule, UsersModule], // el Pool y el UsersService (StaffGuard)
  controllers: [TrainersController],
  providers: [TrainersService, PhotosService],
})
export class TrainersModule {}

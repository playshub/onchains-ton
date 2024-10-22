import { Module } from '@nestjs/common';
import { CronsModule } from './modules/crons/crons.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ScheduleModule.forRoot(), ConfigModule.forRoot(), CronsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

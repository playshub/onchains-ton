import { Module } from '@nestjs/common';
import { CronsModule } from './modules/crons/crons.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WebhookModule } from './modules/webhook/webhook.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    CronsModule,
    WebhookModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

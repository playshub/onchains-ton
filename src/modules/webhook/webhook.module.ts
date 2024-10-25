import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookStatusEntity } from './entities/webhook-status.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([WebhookStatusEntity])],
  providers: [WebhookService],
})
export class WebhookModule {}

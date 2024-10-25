import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { ConfigModule } from '@nestjs/config';

@Module({ imports: [ConfigModule], providers: [WebhookService] })
export class WebhookModule {}

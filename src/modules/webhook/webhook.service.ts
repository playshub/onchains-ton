import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { EventChannels, PlayshubTransactionEvent } from 'src/types/events';
import { PlayshubTransaction } from 'src/types/playshub';
import { delay } from 'src/utils/helpers';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  WebhookStatusEntity,
  WebhookStatusType,
} from './entities/webhook-status.entity';

const MAX_TRIES_COUNT = 3;

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private webhookUrl: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(WebhookStatusEntity)
    private webhookStatusRepository: Repository<WebhookStatusEntity>,
  ) {
    this.webhookUrl = this.configService.get<string>(
      'ANALYTICS_SERVICE_BASE_URL',
    );
  }

  @OnEvent(EventChannels.PlayshubTransactionCreated)
  handlePlayshubTransactionCreated(args: PlayshubTransactionEvent['data']) {
    for (const transaction of args.transactions) {
      this.trySendWebhook(transaction);
    }
  }

  private async trySendWebhook(args: PlayshubTransaction, retryCount = 0) {
    const webhookUrl = `${this.webhookUrl}/Track/AddTransaction?ApiKey=R2NLCHNUN5IV`;

    try {
      await this.webhookStatusRepository
        .createQueryBuilder()
        .insert()
        .values({
          hash: args.hash,
          status: WebhookStatusType.Pending,
          attempts: retryCount + 1,
        })
        .orUpdate(['attempts'], ['hash'])
        .execute();

      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args),
      });

      await this.webhookStatusRepository
        .createQueryBuilder()
        .update()
        .set({ status: WebhookStatusType.Success })
        .where('hash = :hash', { hash: args.hash })
        .execute();
    } catch (e) {
      this.logger.error(`Webhook failed to send. Error: ${e.message}`, {
        retryCount,
        webhookUrl,
      });

      // Add a delay before retrying (using exponential backoff)
      const delayMs = Math.pow(2, retryCount) * 1000;
      this.logger.debug(
        `Retrying webhook. Attempt ${retryCount + 1} after ${delayMs}ms`,
      );
      await delay(delayMs);

      if (retryCount == MAX_TRIES_COUNT) {
        await this.webhookStatusRepository
          .createQueryBuilder()
          .update()
          .set({ status: WebhookStatusType.Failed })
          .where('hash = :hash', { hash: args.hash })
          .execute();
        this.logger.error(
          `Max retry attempts reached for webhook: ${webhookUrl}`,
        );
      }

      return this.trySendWebhook(args, retryCount + 1);
    }
  }
}

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
import { getSettings } from 'src/utils/settings';

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
    return this.trySendWebhook(args.transactions);
  }

  private async trySendWebhook(
    transactions: PlayshubTransaction[],
    retryCount = 0,
  ) {
    const webhookUrl = `${this.webhookUrl}/Track/AddTransactionArray?ApiKey=R2NLCHNUN5IV`;

    try {
      await this.webhookStatusRepository
        .createQueryBuilder()
        .insert()
        .values(
          transactions.map((transaction) => ({
            hash: transaction.hash,
            status: WebhookStatusType.Pending,
            attempts: retryCount + 1,
          })),
        )
        .orUpdate(['attempts'], ['hash'])
        .execute();

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactions),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      await this.webhookStatusRepository
        .createQueryBuilder()
        .insert()
        .values(
          transactions.map((transaction) => ({
            hash: transaction.hash,
            status: WebhookStatusType.Success,
          })),
        )
        .orUpdate(['status'], ['hash'])
        .execute();
    } catch (e) {
      this.logger.error(`Webhook failed to send. Error: ${e.message}`, {
        retryCount,
        webhookUrl,
      });
      this.logger.debug(e);
      this.logger.debug(
        `Status: ${e.status}, Message: ${e.statusText || e.message}`,
      );

      // Add a delay before retrying (using exponential backoff)
      const delayMs = Math.pow(2, retryCount) * getSettings().webhookDelayTime;
      this.logger.debug(`Retrying webhook. Attempt ${retryCount + 1}`);
      await delay(delayMs);

      if (retryCount == getSettings().maxRetryCount) {
        await this.webhookStatusRepository
          .createQueryBuilder()
          .insert()
          .values(
            transactions.map((transaction) => ({
              hash: transaction.hash,
              status: WebhookStatusType.Failed,
            })),
          )
          .orUpdate(['status'], ['hash'])
          .execute();
        this.logger.error(
          `Max retry attempts reached for webhook: ${webhookUrl}`,
        );
        return;
      }

      return this.trySendWebhook(transactions, retryCount + 1);
    }
  }
}

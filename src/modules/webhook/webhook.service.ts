import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventChannels, PlayshubTransactionEvent } from 'src/types/events';
import { PlayshubTransaction } from 'src/types/playshub';
import { delay } from 'src/utils/helpers';

const MAX_TRIES_COUNT = 3;

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private webhookUrl: string = 'https://';

  constructor() {}

  @OnEvent(EventChannels.PlayshubTransactionCreated)
  handlePlayshubTransactionCreated(args: PlayshubTransactionEvent['data']) {
    for (const transaction of args.transactions) {
      this.trySendWebhook(transaction);
    }
  }

  private async trySendWebhook(args: PlayshubTransaction, retryCount = 0) {
    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args),
      });
    } catch (e) {
      this.logger.error(`Webhook failed to send. Error: ${e.message}`, {
        retryCount,
        webhookUrl: this.webhookUrl,
      });

      // Add a delay before retrying (using exponential backoff)
      const delayMs = Math.pow(2, retryCount) * 1000;
      this.logger.debug(
        `Retrying webhook. Attempt ${retryCount + 1} after ${delayMs}ms`,
      );
      await delay(delayMs);

      if (retryCount == MAX_TRIES_COUNT) {
        throw new Error(
          `Max retry attempts reached for webhook: ${this.webhookUrl}`,
        );
      }

      return this.trySendWebhook(args, retryCount + 1);
    }
  }
}

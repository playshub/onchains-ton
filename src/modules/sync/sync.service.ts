import { Injectable, Logger } from '@nestjs/common';
import { TonApiService } from '../ton-api/ton-api.service';
import { Transaction } from '@ton/core';
import { TonTxIdentify } from 'src/types/ton';
import { ParserService } from '../parser/parser.service';
import { delay } from 'src/utils/helpers';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventChannels } from 'src/types/events';
import { getSettings } from 'src/utils/settings';
import { ObserverAccountsService } from '../observer-accounts/observer-accounts.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  constructor(
    private readonly tonApiService: TonApiService,
    private readonly parserService: ParserService,
    private readonly eventEmitter: EventEmitter2,
    private readonly observerAccountsService: ObserverAccountsService,
  ) {}

  private async processTransactions(
    transactions: Transaction[],
    backfill: boolean = false,
  ) {
    try {
      if (transactions.length === 0) {
        return;
      }

      const parsedTransactions = transactions
        .map((tx) => this.parserService.parse(tx))
        .filter((tx) => Boolean(tx));

      this.eventEmitter.emit(EventChannels.PlayshubTransactionCreated, {
        transactions: parsedTransactions,
        backfill,
      });
    } catch (e) {
      this.logger.debug(
        `Error processing transactions: from ${transactions[0].lt.toString()} to ${transactions[transactions.length - 1].lt.toString()} of account ${transactions[0]?.inMessage?.info?.src?.toString()}`,
      );
    }
  }

  async syncLatestTransactions(
    account: string,
    localTx: TonTxIdentify,
    headTx: TonTxIdentify,
  ) {
    // Get latest transactions from lt with batch size
    let latestTransactions = await this.tryGetTransactions(account, {
      limit: getSettings().realtimeTransactionsBatchSize,
      lt: headTx.lt,
      hash: headTx.hash,
    });

    if (latestTransactions.length === 0) {
      //Nothing to sync
      return;
    }

    const tailTx = latestTransactions[latestTransactions.length - 1];

    if (BigInt(localTx.lt) < BigInt(tailTx.lt)) {
      const nextTx = this.getTonTxIdentifyFromTx(tailTx);
      this.backfillSync(account, localTx, nextTx);
    } else {
      latestTransactions = latestTransactions.filter(
        (transaction) => BigInt(localTx.lt) < BigInt(transaction.lt),
      );
    }

    this.logger.debug(
      `[Realtime] Found ${latestTransactions.length} new transactions of account ${account}`,
    );
    await this.processTransactions(latestTransactions);
  }

  private async backfillSync(
    account: string,
    toTx: TonTxIdentify,
    tx: TonTxIdentify,
  ) {
    await this.observerAccountsService.setSyncedStatus(account, false);
    this.logger.debug(
      `Backfill sync transactions of account: ${account} from ${tx.lt} to ${toTx.lt}`,
    );
    // batch sync transactions
    let nextTx = tx;
    let nextTransactions = await this.tryGetTransactions(account, {
      limit: getSettings().backfillTransactionsBatchSize,
      lt: nextTx.lt,
      hash: nextTx.hash,
      to_lt: toTx.lt,
    });
    this.logger.debug(
      `Backfill sync transactions of account: ${account} from ${nextTx.lt} to ${toTx.lt}`,
    );
    this.logger.debug(
      `[Backfill] Found ${nextTransactions.length} transactions backfill transactions of account ${account}`,
    );
    await this.processTransactions(nextTransactions, true);

    while (
      nextTransactions.length === getSettings().backfillTransactionsBatchSize
    ) {
      await delay(getSettings().backfillDelayTime);
      nextTx = this.getTonTxIdentifyFromTx(
        nextTransactions[nextTransactions.length - 1],
      );
      nextTransactions = await this.tryGetTransactions(account, {
        limit: getSettings().backfillTransactionsBatchSize,
        lt: nextTx.lt,
        hash: nextTx.hash,
        to_lt: toTx.lt,
      });
      this.logger.debug(
        `Backfill sync transactions of account: ${account} from ${nextTx.lt} to ${toTx.lt}`,
      );
      this.logger.debug(
        `[Backfill] Found ${nextTransactions.length} transactions backfill transactions of account ${account}`,
      );
      await this.processTransactions(nextTransactions, true);
    }
    await this.observerAccountsService.setSyncedStatus(account, true);
  }

  private async tryGetTransactions(
    address: string,
    opts: {
      limit: number;
      lt?: string;
      to_lt?: string;
      hash?: string;
    },
    retryCount = 0,
  ): Promise<Transaction[]> {
    let transactions: Transaction[] = [];
    try {
      this.logger.log(
        `[Attempts #${retryCount + 1}}] Getting transactions address (${address}), lt: ${opts.lt}, to_lt ${opts.to_lt}, hash: ${opts.hash}`,
      );
      transactions = await this.tonApiService.getTransactions(address, opts);
      return transactions;
    } catch (e) {
      this.logger.error(e);
      if (e.code === 429) {
        this.logger.error(`Rate limit exceeded`);
      }

      if (retryCount == getSettings().maxRetryCount) {
        this.logger.error(
          `Max retry count exceeded address (${address}), lt: ${opts.lt}, to_lt ${opts.to_lt}, hash: ${opts.hash}`,
        );
        return [];
      }

      return this.tryGetTransactions(address, opts, retryCount + 1);
    }
  }

  private getTonTxIdentifyFromTx(tx: Transaction): TonTxIdentify {
    return {
      lt: tx.lt.toString(),
      hash: tx.hash().toString('base64'),
    };
  }
}

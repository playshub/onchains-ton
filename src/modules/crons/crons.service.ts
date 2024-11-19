import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SyncService } from '../sync/sync.service';
import { TonApiService } from '../ton-api/ton-api.service';
import { TonTxIdentify } from 'src/types/ton';
import { ObserverAccountsService } from '../observer-accounts/observer-accounts.service';
import { ObserverAccountsEntity } from '../observer-accounts/entities/observer-accounts.entity';
import { getSettings } from 'src/utils/settings';

@Injectable()
export class CronsService {
  private readonly logger = new Logger(CronsService.name);
  private lock = false; // Only 1 worker is working

  constructor(
    private readonly syncService: SyncService,
    private readonly tonApiService: TonApiService,
    private readonly observerAccountsService: ObserverAccountsService,
  ) {}

  @Cron(`*/${getSettings().syncInterval} * * * * *`)
  async start() {
    if (this.lock) {
      return;
    }
    this.lock = true;

    const observerAccounts = await this.observerAccountsService.getActive();
    if (observerAccounts.length === 0) {
      this.logger.debug('No observer accounts to sync');
      return;
    }

    this.logger.debug(
      `Sync latest transactions every ${getSettings().syncInterval} seconds`,
    );

    await Promise.all(observerAccounts.map((account) => this.sync(account)));
    this.lock = false;
  }

  private async sync(account: ObserverAccountsEntity) {
    try {
      const headTx = await this.tonApiService.getLastTransaction(
        account.address,
      );
      const localTx = {
        lt: account.lastTxLt,
        hash: account.lastTxHash,
      };

      if (!headTx) {
        // Nothing to sync
        return;
      }

      if (BigInt(localTx.lt) >= BigInt(headTx.lt)) {
        // Nothing to sync
        return;
      }

      await this.realTimeSync(account.address, localTx, headTx);
      await this.observerAccountsService.setLastTx(
        account.address,
        headTx.lt,
        headTx.hash,
      );
    } catch (error) {
      this.logger.error(
        `Error while syncing account: ${account.name} from ${account.lastTxLt}`,
      );
      this.logger.debug(error);
    }
  }

  private async realTimeSync(
    account: string,
    localTx: TonTxIdentify,
    headTx: TonTxIdentify,
  ) {
    this.logger.debug(
      `Realtime sync transactions of account: ${account} from ${headTx.lt} to ${localTx.lt}`,
    );
    await this.syncService.syncLatestTransactions(account, localTx, headTx);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SyncService } from '../sync/sync.service';
import { TonApiService } from '../ton-api/ton-api.service';
import { TonTxIdentify } from 'src/types/ton';

const SYNC_INTERVAL = 10; // 10 seconds per sync

@Injectable()
export class CronsService {
  private readonly logger = new Logger(CronsService.name);
  private readonly latestTxLt: Map<string, TonTxIdentify> = new Map();
  private readonly observerAccounts = [
    'EQDUE6sTN0Pg7Vtqos90nyrfO_9iVTUUYurnroEARSeo2pBg', // aao
    'UQBZ1Lzyfx81Vph2EL2jsQk9pzqo3SC5wit6OyS23ZrUO_xH', // major
    'UQBj96aEiJlFV4Si16ajonjQRHf_OOb-80WXTOOUTHxd8h0a', // catizen
  ];
  private lock = false; // Only 1 worker is working

  constructor(
    private readonly syncService: SyncService,
    private readonly tonApiService: TonApiService,
  ) {
    for (const account of this.observerAccounts) {
      this.latestTxLt.set(account, { lt: '0', hash: '' });
    }
  }

  @Cron(`*/${SYNC_INTERVAL} * * * * *`)
  async start() {
    if (this.lock) {
      return;
    }
    this.lock = true;
    this.logger.debug(
      `Sync latest transactions every ${SYNC_INTERVAL} seconds`,
    );

    await Promise.all(
      this.observerAccounts.map((account) => this.sync(account)),
    );

    this.lock = false;
  }

  private async sync(account: string) {
    const headTx = await this.tonApiService.getLastTransaction(account);
    const localTx = this.latestTxLt.get(account);

    if (!headTx) {
      // Nothing to sync
      return;
    }

    if (BigInt(localTx.lt) >= BigInt(headTx.lt)) {
      // Nothing to sync
      return;
    }

    await this.realTimeSync(account, localTx, headTx);
    this.latestTxLt.set(account, headTx);
  }

  private async realTimeSync(
    account: string,
    localTx: TonTxIdentify,
    headTx: TonTxIdentify,
  ) {
    this.logger.debug(
      `Realtime sync transactions of account: ${account} from ${headTx.lt} to  ${localTx.lt}`,
    );
    await this.syncService.syncLatestTransactions(account, localTx, headTx);
  }
}

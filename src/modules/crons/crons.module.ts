import { Module } from '@nestjs/common';
import { SyncModule } from '../sync/sync.module';
import { CronsService } from './crons.service';
import { TonApiModule } from '../ton-api/ton-api.module';
import { ObserverAccountsModule } from '../observer-accounts/observer-accounts.module';

@Module({
  imports: [SyncModule, TonApiModule, ObserverAccountsModule],
  providers: [CronsService],
})
export class CronsModule {}

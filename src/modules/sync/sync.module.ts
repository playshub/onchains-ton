import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { TonApiModule } from '../ton-api/ton-api.module';
import { ParserModule } from '../parser/parser.module';
import { ObserverAccountsModule } from '../observer-accounts/observer-accounts.module';

@Module({
  imports: [TonApiModule, ParserModule, ObserverAccountsModule],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}

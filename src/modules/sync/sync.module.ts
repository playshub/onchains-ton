import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { TonApiModule } from '../ton-api/ton-api.module';
import { ParserModule } from '../parser/parser.module';

@Module({
  imports: [TonApiModule, ParserModule],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}

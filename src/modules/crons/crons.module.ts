import { Module } from '@nestjs/common';
import { SyncModule } from '../sync/sync.module';
import { CronsService } from './crons.service';
import { TonApiModule } from '../ton-api/ton-api.module';

@Module({ imports: [SyncModule, TonApiModule], providers: [CronsService] })
export class CronsModule {}

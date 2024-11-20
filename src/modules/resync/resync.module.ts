import { Module } from '@nestjs/common';
import { ResyncService } from './resync.service';
import { ResyncController } from './resync.controller';
import { ObserverAccountsModule } from '../observer-accounts/observer-accounts.module';

@Module({
  imports: [ObserverAccountsModule],
  controllers: [ResyncController],
  providers: [ResyncService],
})
export class ResyncModule {}

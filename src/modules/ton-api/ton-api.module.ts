import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TonApiService } from './ton-api.service';

@Module({
  imports: [ConfigModule],
  providers: [TonApiService],
  exports: [TonApiService],
})
export class TonApiModule {}

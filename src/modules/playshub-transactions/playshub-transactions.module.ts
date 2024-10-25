import { Module } from '@nestjs/common';
import { PlayshubTransactionsService } from './playshub-transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayshubTransactionsEntity } from './entities/playshub-transactions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlayshubTransactionsEntity])],
  providers: [PlayshubTransactionsService],
})
export class PlayshubTransactionsModule {}

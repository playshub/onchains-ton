import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayshubTransactionsEntity } from './entities/playshub-transactions.entity';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { PlayshubTransaction } from 'src/types/playshub';
import { EventChannels, PlayshubTransactionEvent } from 'src/types/events';

@Injectable()
export class PlayshubTransactionsService {
  constructor(
    @InjectRepository(PlayshubTransactionsEntity)
    private accountTransactionRepository: Repository<PlayshubTransactionsEntity>,
  ) {}

  @OnEvent(EventChannels.PlayshubTransactionCreated)
  handlePlayshubTransactionCreated(args: PlayshubTransactionEvent['data']) {
    return this.accountTransactionRepository
      .createQueryBuilder()
      .insert()
      .values(args.transactions)
      .orIgnore()
      .execute();
  }
}

import { PlayshubTransaction } from './playshub';

export enum EventChannels {
  PlayshubTransactionCreated = 'playshub.transaction.created',
}

export interface PlayshubTransactionEvent {
  channel: EventChannels.PlayshubTransactionCreated;
  data: {
    transactions: PlayshubTransaction[];
    backfill: boolean;
  };
}

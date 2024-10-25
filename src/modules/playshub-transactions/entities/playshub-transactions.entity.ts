import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum PlayshubTransactionType {
  Unknown = 'unknown',
  CheckIn = 'check_in',
  Deposit = 'deposit',
  Withdraw = 'withdraw',
  Buy = 'buy',
}

@Entity({ name: 'playshub_transactions' })
export class PlayshubTransactionsEntity {
  @PrimaryColumn()
  hash: string;

  @Column()
  timestamp: number;

  @Column()
  source: string;

  @Column()
  destination: string;

  @Column()
  value: string;

  @Column()
  total_fees: string;

  @Column()
  payload: string;

  @Column({
    type: 'enum',
    enum: PlayshubTransactionType,
    default: PlayshubTransactionType.Unknown,
  })
  type: PlayshubTransactionType;
}

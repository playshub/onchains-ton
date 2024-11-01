export enum PlayshubTransactionType {
  Unknown = 'unknown',
  Withdraw = 'withdraw',
  Deposit = 'deposit',
}

export interface PlayshubTransaction {
  hash: string;
  timestamp: number;
  source: string;
  destination: string;
  value: string;
  total_fees: string;
  payload: string;
  type: PlayshubTransactionType;
}

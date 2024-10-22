export enum PlayshubTransactionType {
  Unknown = 'unknown',
  CheckIn = 'check_in',
  Deposit = 'deposit',
  Withdraw = 'withdraw',
  Buy = 'buy',
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

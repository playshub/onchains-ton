import { Cell } from '@ton/core';

export interface TonTxIdentify {
  lt: string;
  hash: string;
}

export type TxBody =
  | { type: 'comment'; comment: string }
  | { type: 'payload'; cell: Cell };

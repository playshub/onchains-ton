import { Injectable } from '@nestjs/common';
import { Transaction } from '@ton/core';
import {
  PlayshubTransaction,
  PlayshubTransactionType,
} from 'src/types/playshub';
import { Cell } from '@ton/core';
import { TxBody } from 'src/types/ton';

@Injectable()
export class ParserService {
  constructor() {}

  parse(tx: Transaction): PlayshubTransaction | null {
    if (this.isIncomingToncoins(tx) && tx.inMessage.info?.type == 'internal') {
      const parsedBody = this.parseBody(tx.inMessage.body);
      let type = PlayshubTransactionType.Unknown;
      let payload = '';

      if (parsedBody.type === 'comment') {
        payload = parsedBody.comment;
      }

      return {
        hash: tx.hash().toString('base64'),
        timestamp: tx.now,
        source: tx.inMessage.info.src.toString(),
        destination: tx.inMessage.info.dest.toString(),
        value: tx.inMessage.info.value.coins.toString(),
        total_fees: tx.totalFees.coins.toString(),
        payload,
        type,
      };
    }

    return null;
  }

  private parseBody(cell: Cell): TxBody | null {
    if (cell.isExotic) {
      return { type: 'payload', cell };
    }

    const slice = cell.beginParse();
    if (slice.remainingBits < 32) {
      return null;
    }

    // Comment
    if (slice.loadUint(32) === 0) {
      if (slice.remainingBits / 8 === 0) {
        return null;
      }
      let res = slice
        .loadBuffer(Math.floor(slice.remainingBits / 8))
        .toString();
      let rr = slice;
      if (rr.remainingRefs > 0) {
        rr = rr.loadRef().beginParse();
        res += rr.loadBuffer(Math.floor(rr.remainingBits / 8)).toString();
      }
      if (res.length > 0) {
        return { type: 'comment', comment: res };
      } else {
        return null;
      }
    }

    // Binary payload
    return { type: 'payload', cell };
  }

  // If incoming message source address is defined and no outgoing messages - this is incoming Toncoins.
  // ATTENTION: ALWAYS CHECK THAT THERE WERE NO OUTGOING MESSAGES.
  // It is important to check that Toncoins did not bounce back in case of an error.
  private isIncomingToncoins(tx: Transaction): boolean {
    return tx.inMessage && tx.outMessagesCount === 0;
  }
}

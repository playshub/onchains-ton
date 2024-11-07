import { Injectable, Logger } from '@nestjs/common';
import { CommonMessageInfoInternal, Transaction } from '@ton/core';
import {
  PlayshubTransaction,
  PlayshubTransactionType,
} from 'src/types/playshub';
import { Cell } from '@ton/core';
import { TxBody } from 'src/types/ton';

@Injectable()
export class ParserService {
  private readonly logger = new Logger(ParserService.name);
  parse(tx: Transaction): PlayshubTransaction | null {
    try {
      if (this.isDepositTonTx(tx)) {
        return this.parseDepositTonTx(tx);
      } else if (this.isWidthrawTonTx(tx)) {
        return this.parseWidthrawTonTx(tx);
      } else if (this.isUnknownTx(tx)) {
        return this.parseUnknownTx(tx);
      }

      this.logger.debug(
        `Unknown transaction type: ${tx.hash().toString('base64')}`,
      );
      return null;
    } catch (error) {
      this.logger.debug(error);
      this.logger.error(
        `Error parsing transaction: ${tx.hash().toString('base64')}`,
      );
      return null;
    }
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

  private isDepositTonTx(tx: Transaction): boolean {
    // If incoming message source address is defined and no outgoing messages - this is incoming Toncoins.
    // ATTENTION: ALWAYS CHECK THAT THERE WERE NO OUTGOING MESSAGES.
    // It is important to check that Toncoins did not bounce back in case of an error.
    return (
      tx.inMessage &&
      tx.outMessagesCount === 0 &&
      tx.inMessage.info?.type == 'internal'
    );
  }

  private parseDepositTonTx(tx: Transaction): PlayshubTransaction {
    const parsedBody = this.parseBody(tx.inMessage.body);
    let type = PlayshubTransactionType.Deposit;
    let payload = '';

    if (parsedBody?.type === 'comment') {
      payload = parsedBody.comment;
    }

    return {
      hash: tx.hash().toString('base64'),
      timestamp: tx.now,
      source: tx.inMessage.info.src.toString(),
      destination: tx.inMessage.info.dest.toString(),
      value: (
        tx.inMessage.info as CommonMessageInfoInternal
      ).value.coins.toString(),
      total_fees: tx.totalFees.coins.toString(),
      payload,
      type,
    };
  }

  private isWidthrawTonTx(tx: Transaction): boolean {
    return (
      tx.outMessagesCount === 1 &&
      tx.outMessages.get(0)?.info?.type === 'internal'
    );
  }

  private parseWidthrawTonTx(tx: Transaction): PlayshubTransaction {
    const outMessage = tx.outMessages.get(0);
    const parsedBody = this.parseBody(outMessage.body);
    let type = PlayshubTransactionType.Withdraw;
    let payload = '';

    if (parsedBody?.type === 'comment') {
      payload = parsedBody.comment;
    }

    return {
      hash: tx.hash().toString('base64'),
      timestamp: tx.now,
      source: outMessage.info.src.toString(),
      destination: outMessage.info.dest.toString(),
      value: (
        outMessage.info as CommonMessageInfoInternal
      ).value.coins.toString(),
      total_fees: tx.totalFees.coins.toString(),
      payload,
      type,
    };
  }

  private isUnknownTx(tx: Transaction): boolean {
    return tx.inMessage && tx.inMessage.info?.type == 'internal';
  }
  private parseUnknownTx(tx: Transaction): PlayshubTransaction {
    return {
      hash: tx.hash().toString('base64'),
      timestamp: tx.now,
      source: tx.inMessage?.info.src.toString(),
      destination: tx.inMessage?.info.dest.toString(),
      value: (
        tx.inMessage.info as CommonMessageInfoInternal
      ).value.coins.toString(),
      total_fees: tx.totalFees.coins.toString(),
      payload: '',
      type: PlayshubTransactionType.Unknown,
    };
  }
}

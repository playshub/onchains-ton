import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObserverAccountsEntity } from './entities/observer-accounts.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ObserverAccountsService {
  constructor(
    @InjectRepository(ObserverAccountsEntity)
    private observerAccountRepository: Repository<ObserverAccountsEntity>,
  ) {}

  getAll() {
    return this.observerAccountRepository.find();
  }

  getActive() {
    return this.observerAccountRepository.find({ where: { stopped: false } });
  }

  add(address: string, name: string) {
    const observerAccount = this.observerAccountRepository.create({
      address,
      name,
      lastTxHash: '',
      lastTxLt: '0',
      stopped: false,
    });

    return this.observerAccountRepository.save(observerAccount);
  }

  async setStatus(address: string, stopped: boolean) {
    const account = await this.observerAccountRepository.findOne({
      where: { address },
    });

    if (!account) {
      throw new NotFoundException(
        `Account with address ${address} does not exist`,
      );
    }

    account.stopped = stopped;

    return this.observerAccountRepository.save(account);
  }

  async setLastTx(address: string, lt: string, hash: string) {
    const account = await this.observerAccountRepository.findOne({
      where: { address },
    });

    if (!account) {
      throw new NotFoundException(
        `Account with address ${address} does not exist`,
      );
    }

    account.lastTxLt = lt;
    account.lastTxHash = hash;

    return this.observerAccountRepository.save(account);
  }
}

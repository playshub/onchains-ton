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

  add(address: string, name: string) {
    const observerAccount = this.observerAccountRepository.create({
      address,
      name,
      lastTxHash: '',
      lastTxLt: '0',
    });

    return this.observerAccountRepository.save(observerAccount);
  }

  async remove(address: string) {
    const account = await this.observerAccountRepository.findOne({
      where: { address },
    });

    if (!account) {
      throw new NotFoundException(
        `Account with address ${address} does not exist`,
      );
    }

    return this.observerAccountRepository.remove(account);
  }
}

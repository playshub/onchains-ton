import { Injectable, Logger } from '@nestjs/common';
import { ObserverAccountsService } from '../observer-accounts/observer-accounts.service';

@Injectable()
export class ResyncService {
  private readonly logger = new Logger(ResyncService.name);

  constructor(
    private readonly observerAccountsService: ObserverAccountsService,
  ) {}

  async resync() {
    this.logger.log('Starting resync apps');
    await this.observerAccountsService.resync();
    return true;
  }
}

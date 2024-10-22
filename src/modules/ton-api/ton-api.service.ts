import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Address, TonClient } from '@ton/ton';

@Injectable()
export class TonApiService {
  private tonClient: TonClient;

  constructor(private configService: ConfigService) {
    const isMainnet = this.configService.get<string>('IS_MAINNET') === 'true';
    const apiKey = this.configService.get<string>('API_KEY');

    this.tonClient = isMainnet
      ? new TonClient({
          endpoint: 'https://toncenter.com/api/v2/jsonRPC',
          apiKey,
        })
      : new TonClient({
          endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
          apiKey,
        });
  }

  getTransactions(
    address: string,
    opts: {
      limit: number;
      lt?: string;
      to_lt?: string;
      hash?: string;
    },
  ) {
    return this.tonClient.getTransactions(Address.parse(address), {
      ...opts,
      archival: true,
    });
  }

  async getLastTransaction(address: string) {
    const state = await this.tonClient.getContractState(Address.parse(address));

    return state.lastTransaction;
  }
}

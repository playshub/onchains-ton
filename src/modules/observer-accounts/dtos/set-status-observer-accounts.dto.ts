import { IsBoolean } from 'class-validator';
import { IsTonAddress } from 'src/common/validations/is-ton-address.class-validator';

export class SetStatusObserverAccountsParams {
  @IsTonAddress()
  address: string;
}

export class SetStatusObserverAccountsDto {
  @IsBoolean()
  stopped: boolean;
}

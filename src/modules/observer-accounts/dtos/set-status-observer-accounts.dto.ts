import { IsBoolean } from 'class-validator';
import { IsTonAddress } from 'src/modules/common/validations/is-ton-address.class-validator';

export class SetStatusObserverAccountsParams {
  @IsTonAddress()
  address: string;
}

export class SetStatusObserverAccountsDto {
  @IsBoolean()
  stopped: boolean;
}

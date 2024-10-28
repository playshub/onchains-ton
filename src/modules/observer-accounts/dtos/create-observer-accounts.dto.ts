import { IsString } from 'class-validator';
import { IsTonAddress } from 'src/modules/common/validations/is-ton-address.class-validator';

export class CreateObserverAccountsDto {
  @IsTonAddress()
  address: string;

  @IsString()
  name: string;
}

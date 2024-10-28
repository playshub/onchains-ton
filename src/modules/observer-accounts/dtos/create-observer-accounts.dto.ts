import { IsString } from 'class-validator';
import { IsTonAddress } from 'src/common/validations/is-ton-address.class-validator';

export class CreateObserverAccountsDto {
  @IsTonAddress()
  address: string;

  @IsString()
  name: string;
}

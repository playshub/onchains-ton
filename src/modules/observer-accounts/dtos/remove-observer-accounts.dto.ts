import { IsTonAddress } from 'src/modules/common/validations/is-ton-address.class-validator';

export class RemoveObserverAccountsDto {
  @IsTonAddress()
  address: string;
}

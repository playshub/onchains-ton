import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsTonAddress } from 'src/common/validations/is-ton-address.class-validator';

export class CreateObserverAccountsDto {
  @IsTonAddress()
  @ApiProperty()
  address: string;

  @IsString()
  @ApiProperty()
  name: string;
}

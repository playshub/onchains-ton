import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { IsTonAddress } from 'src/common/validations/is-ton-address.class-validator';

export class SetStatusObserverAccountsParams {
  @IsTonAddress()
  @ApiProperty()
  address: string;
}

export class SetStatusObserverAccountsDto {
  @IsBoolean()
  @ApiProperty()
  stopped: boolean;
}

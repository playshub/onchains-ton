import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateObserverAccountsDto } from './dtos/create-observer-accounts.dto';
import { ObserverAccountsService } from './observer-accounts.service';
import {
  SetStatusObserverAccountsDto,
  SetStatusObserverAccountsParams,
} from './dtos/set-status-observer-accounts.dto';

@Controller('observer-accounts')
export class ObserverAccountsController {
  constructor(
    private readonly observerAccountsService: ObserverAccountsService,
  ) {}
  @Get()
  getObserverAccounts() {
    return this.observerAccountsService.getAll();
  }

  @Post()
  addObserverAccount(@Body() dto: CreateObserverAccountsDto) {
    return this.observerAccountsService.add(dto.address, dto.name);
  }

  @Post('/status/:address')
  setStatusObserverAccount(
    @Param() params: SetStatusObserverAccountsParams,
    @Body() dto: SetStatusObserverAccountsDto,
  ) {
    return this.observerAccountsService.setStatus(params.address, dto.stopped);
  }
}

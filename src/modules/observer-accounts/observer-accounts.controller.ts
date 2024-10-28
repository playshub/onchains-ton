import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateObserverAccountsDto } from './dtos/create-observer-accounts.dto';
import { ObserverAccountsService } from './observer-accounts.service';
import { RemoveObserverAccountsDto } from './dtos/remove-observer-accounts.dto';

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

  @Post(':address')
  removeObserverAccount(@Param() dto: RemoveObserverAccountsDto) {
    return this.observerAccountsService.remove(dto.address);
  }
}

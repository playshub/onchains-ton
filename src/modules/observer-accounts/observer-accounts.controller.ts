import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateObserverAccountsDto } from './dtos/create-observer-accounts.dto';
import { ObserverAccountsService } from './observer-accounts.service';
import {
  SetStatusObserverAccountsDto,
  SetStatusObserverAccountsParams,
} from './dtos/set-status-observer-accounts.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('observer-accounts')
@Controller('observer-accounts')
export class ObserverAccountsController {
  constructor(
    private readonly observerAccountsService: ObserverAccountsService,
  ) {}
  @Get()
  @ApiOperation({ summary: 'Get all observer accounts' })
  getObserverAccounts() {
    return this.observerAccountsService.getAll();
  }

  @Post()
  @ApiOperation({ summary: 'Add new observer account' })
  addObserverAccount(@Body() dto: CreateObserverAccountsDto) {
    return this.observerAccountsService.add(dto.address, dto.name);
  }

  @Post('/status/:address')
  @ApiOperation({ summary: 'Set status active/inactive observer account' })
  setStatusObserverAccount(
    @Param() params: SetStatusObserverAccountsParams,
    @Body() dto: SetStatusObserverAccountsDto,
  ) {
    return this.observerAccountsService.setStatus(params.address, dto.stopped);
  }
}

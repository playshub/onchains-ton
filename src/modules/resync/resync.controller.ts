import { Controller, Post } from '@nestjs/common';
import { ResyncService } from './resync.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('resync')
export class ResyncController {
  constructor(private readonly resyncService: ResyncService) {}

  @Post()
  @ApiOperation({ summary: 'Resync apps' })
  async resync() {
    return this.resyncService.resync();
  }
}

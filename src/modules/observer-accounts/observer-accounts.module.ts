import { Module } from '@nestjs/common';
import { ObserverAccountsController } from './observer-accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObserverAccountsEntity } from './entities/observer-accounts.entity';
import { ObserverAccountsService } from './observer-accounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([ObserverAccountsEntity])],
  controllers: [ObserverAccountsController],
  providers: [ObserverAccountsService],
  exports: [ObserverAccountsService],
})
export class ObserverAccountsModule {}

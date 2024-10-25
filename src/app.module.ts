import { Module } from '@nestjs/common';
import { CronsModule } from './modules/crons/crons.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WebhookModule } from './modules/webhook/webhook.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayshubTransactionsModule } from './modules/playshub-transactions/playshub-transactions.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        url: configService.get('POSTGRES_URL'),
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),

    CronsModule,
    WebhookModule,
    PlayshubTransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

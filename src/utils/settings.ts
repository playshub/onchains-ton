import { configDotenv } from 'dotenv';
configDotenv();

export const getSettings = () => {
  return {
    syncInterval: Number(process.env.SYNC_INTERVAL), // seconds
    maxRetryCount: Number(process.env.MAX_RETRY_COUNT),
    realtimeTransactionsBatchSize: Number(
      process.env.REALTIME_TRANSACTIONS_BATCH_SIZE,
    ),
    backfillTransactionsBatchSize: Number(
      process.env.BACKFILL_TRANSACTIONS_BATCH_SIZE,
    ),
    backfillDelayTime: Number(process.env.BACKFILL_TRANSACTIONS_BATCH_SIZE), // ms
    webhookDelayTime: Number(process.env.WEBHOOK_DELAY_TIME), // ms
    startTimestamp: Number(process.env.START_TIMESTAMP), // unix
  };
};

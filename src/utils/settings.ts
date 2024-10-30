export const getSettings = () => {
  return {
    syncInterval: 10, // seconds
    maxRetryCount: 5,
    realtimeTransactionsBatchSize: 20,
    backfillTransactionsBatchSize: 100,
    backfillDelayTime: 1000, // ms
    webhookDelayTime: 1000, // ms
  };
};

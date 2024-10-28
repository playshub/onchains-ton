export const getSettings = () => {
  return {
    syncInterval: 10, // seconds
    maxRetryCount: 5,
    realtimeTransactionsBatchSize: 20,
    backfillTransactionsBatchSize: 50,
    backfillDelayTime: 15000, // ms
    webhookDelayTime: 1000, // ms
  };
};

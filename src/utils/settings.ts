export const getSettings = () => {
  return {
    syncInterval: 5, // seconds
    maxRetryCount: 5,
    realtimeTransactionsBatchSize: 20,
    backfillTransactionsBatchSize: 50,
    backfillDelayTime: 5000, // ms
    webhookDelayTime: 1000, // ms
  };
};

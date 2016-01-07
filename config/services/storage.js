import path from 'path';

export default {
  services: {
    storage: {
      amazon: {
        provider: {
          accessKeyId: 'AKIAIASRV25TIJNRVQEQ',
          secretAccessKey: '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'
        }
      },
      local: {
        provider: {
          uploads: path.resolve(__dirname, '../uploads')
        }
      }
    }
  }
}

import path from 'path';

export default {
  services: {
    storage: {
      amazon: {
        provider: {
          accessKeyId: 'AKIAIGOPEU23H4Z3Y2AA',
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

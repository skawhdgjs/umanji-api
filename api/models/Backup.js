
/**
 * Backup
 * @description :: Model for storing backup data
 */

export default {
  schema: false,

  attributes: {

    toJSON() {
      return this.toObject();
    }
  },

  beforeUpdate: (values, next) => next(),
  beforeCreate: (values, next) => next()
};

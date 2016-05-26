
/**
 * System
 * @description :: Model for storing system data
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

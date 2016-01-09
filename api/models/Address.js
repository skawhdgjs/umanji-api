
/**
 * Address
 * @description :: Model for storing Channel records
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

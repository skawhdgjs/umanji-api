import policy from '../../config/services/policy';

/**
 * Noty
 * @description :: Model for storing Noty records
 */

export default {
  schema: true,

  attributes: {
    from         : { model: 'Channel' },
    to           : { model: 'Channel' },
    channel      : { model: 'Channel' },
    read         : { type: 'boolean', defaultsTo: false },

    toJSON() {
      return this.toObject();
    }
  },


  beforeUpdate: (values, next) => next(),
  beforeCreate: (values, next) => next()
};

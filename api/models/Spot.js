/**
 * Spot
 * @description :: Model for storing Channel records
 */

export default {
  schema: true,

  attributes: {
    type     : { type: 'string', defaultsTo: 'SPOT' },
    owner    : { type: 'string' },
    name     : { type: 'string', defaultsTo: '' },
    desc     : { type: 'string', defaultsTo: '' },
    level    : { type: 'integer' },

    photos   : { type: 'array', defaultsTo: [] },
    roles    : { type: 'array', defaultsTo: [] },
    keywords : { type: 'array', defaultsTo: [] },
    links    : { type: 'array', defaultsTo: [] },
    actions  : { type: 'array', defaultsTo: [] },

    address      : { type: 'string', defaultsTo: '' },
    countryCode  : { type: 'string', defaultsTo: '' },
    countryName  : { type: 'string', defaultsTo: '' },
    adminArea    : { type: 'string', defaultsTo: '' },
    locality     : { type: 'string', defaultsTo: '' },
    thoroughfare : { type: 'string', defaultsTo: '' },
    featureName  : { type: 'string', defaultsTo: '' },
    latitude     : { type: 'float', defaultsTo : 0.0 },
    longitude    : { type: 'float', defaultsTo : 0.0 },


    toJSON() {
      return this.toObject();
    }
  },

  beforeUpdate: (values, next) => next(),
  beforeCreate: (values, next) => next()
};

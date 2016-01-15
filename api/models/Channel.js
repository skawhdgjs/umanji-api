import policy from '../../config/services/policy';

/**
 * Channel
 * @description :: Model for storing Channel records
 */

export default {
  schema: true,

  attributes: {
    owner    : { model: 'User' },
    type     : { type: 'string' },
    name     : { type: 'string', defaultsTo: '' },
    desc     : { type: 'string', defaultsTo: '' },
    level    : { type: 'integer', defaultsTo: policy.level.LOCAL },

    point    : { type: 'integer', defaultsTo: policy.point.DEFAULT },

    photos   : { type: 'array', defaultsTo: [] },
    roles    : { type: 'array', defaultsTo: [] },
    keywords : { type: 'array', defaultsTo: [] },
    followers: { type: 'array', defaultsTo: [] },

    subLinks : { type: 'array', defaultsTo: [] },
    link     : { model: 'Channel' },
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

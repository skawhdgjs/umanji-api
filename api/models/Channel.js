import policy from '../../config/services/policy';

/**
 * Channel
 * @description :: Model for storing Channel records
 */

export default {
  schema: true,

  attributes: {
    email     : { type: 'email'},
    password  : { type: 'string' },

    owner    : { model: 'Channel' },
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
    gcmTokens    : { type: 'array', defaultsTo: [] },

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
      let obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },

  beforeUpdate(values, next) {
    if (false === values.hasOwnProperty('password')) return next();
    if (/^\$2[aby]\$[0-9]{2}\$.{53}$/.test(values.password)) return next();

    return HashService.bcrypt.hash(values.password)
      .then(hash => {
        values.password = hash;
        next();
      })
      .catch(next);
  },

  beforeCreate(values, next) {
    if (false === values.hasOwnProperty('password')) return next();

    return HashService.bcrypt.hash(values.password)
      .then(hash => {
        values.password = hash;
        next();
      })
      .catch(next);
  }
};

/**
 * User
 * @description :: Model for storing users
 */

export default {
  schema: true,

  attributes: {
    email    : { type: 'email', required   : true, unique: true },
    password : { type: 'string' },
    name     : { type: 'string', defaultsTo: '' },
    desc     : { type: 'string', defaultsTo: '' },
    level    : { type: 'integer' },

    link     : { model: 'Channel' },

    photos   : { type: 'array', defaultsTo: [] },
    roles    : { type: 'array', defaultsTo: [] },
    keywords : { type: 'array', defaultsTo: [] },
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
      obj.name = this.email.split('@')[0];
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

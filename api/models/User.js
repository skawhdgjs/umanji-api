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

    photos   : { type: 'array', defaultsTo: [] },
    roles    : { type: 'array', defaultsTo: [] },
    keywords : { type: 'array', defaultsTo: [] },
    links    : { type: 'array', defaultsTo: [] },
    actions  : { type: 'array', defaultsTo: [] },
    devices  : { type: 'array', defaultsTo: [] },

    address  : {
      model: 'Address'
    },

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

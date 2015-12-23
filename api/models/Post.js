/**
 * Post
 * @description :: Model for storing Post records
 */

export default {
  schema: true,

  attributes: {
    owner    : { type: 'string', required   : true, unique: true },
    type     : { type: 'string' },
    name     : { type: 'string', defaultsTo: '' },
    desc     : { type: 'string', defaultsTo: '' },
    level    : { type: 'integer' },

    photos   : { type: 'array', defaultsTo: [] },
    roles    : { type: 'array', defaultsTo: [] },
    keywords : { type: 'array', defaultsTo: [] },
    links    : { type: 'array', defaultsTo: [] },
    actions  : { type: 'array', defaultsTo: [] },

    address  : {
      model: 'Address'
    },
    
    toJSON() {
      return this.toObject();
    }
  },

  beforeUpdate: (values, next) => next(),
  beforeCreate: (values, next) => next()
};

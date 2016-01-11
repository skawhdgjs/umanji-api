
/**
 * Address
 * @description :: Model for storing Channel records
 */

/**
    "0" : "경찰",
    "1" : "고용",
    "2" : "관세",
    "3" : "보훈",
    "4" : "국세",
    "5" : "검찰",
    "6" : "법원",
    "7" : "우정",
    "8" : "법무",
    "9" : "병무",
    "10" : "지자체"
**/

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

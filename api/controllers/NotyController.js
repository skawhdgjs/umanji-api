import actionUtil from 'sails/lib/hooks/blueprints/actionUtil';

/**
 * PhotoController
 * @description :: Server-side logic for Noty
 */

export default {
  find() {
    Noty
      .find()
      .then()
  },
}

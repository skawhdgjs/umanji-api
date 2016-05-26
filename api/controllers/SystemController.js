import _ from 'lodash';

import actionUtil from 'sails/lib/hooks/blueprints/actionUtil';

/**
 * PhotoController
 * @description :: Server-side logic for Noty
 */

export default {
  version(req, res) {

    System
      .findOne({key: 'version'})
      .then(res.ok)
      .catch(res.negotiate);
  },

}

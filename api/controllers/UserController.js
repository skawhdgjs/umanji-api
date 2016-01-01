import _ from 'lodash';

import actionUtil from 'sails/lib/hooks/blueprints/actionUtil';
import location from '../services/LocationService';
import jsonService from '../services/JsonService';

/**
 * UserController
 * @description :: Server-side logic for manage users
 */

export default {

  getLinks (req, res) {
    let pk = actionUtil.requirePk(req);
    let params = actionUtil.parseValues(req);

    console.log('params', params);

    Channel
      .find({
        or: [{owner: pk}, {followers: pk}],
        type: params.type
      })
      .populate('owner')
      .then(res.ok)
      .catch(res.negotiate);
  },

};

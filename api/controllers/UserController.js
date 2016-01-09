import _ from 'lodash';

import actionUtil from 'sails/lib/hooks/blueprints/actionUtil';
import location from '../services/LocationService';
import jsonService from '../services/JsonService';

/**
 * UserController
 * @description :: Server-side logic for manage users
 */

export default {
  update (req, res) {
    let params = actionUtil.parseValues(req);
    console.log('params', params);

    User
      .update(params.id, _.omit(params, 'id'))
      .then(records => records[0] ? res.ok(records[0]) : res.notFound())
      .catch(res.negotiate);

  },

  get(req, res) {
    let params = actionUtil.parseValues(req);
    console.log('user.get.params', params);

    User
      .findOne(params.id)
      .then(res.ok)
      .catch(res.negotiate);
  },

  getLinks (req, res) {
    let pk = actionUtil.requirePk(req);
    let params = actionUtil.parseValues(req);

    Channel
      .find({
        or: [{owner: pk}, {followers: pk}],
        type: params.type
      })
      .populate('owner')
      .then(res.ok)
      .catch(res.negotiate);
  },

  gcm (req, res) {
    let params = actionUtil.parseValues(req);
    let user = req.user;
    let token = params.token;

    if(_.findWhere(user.gcmTokens, token) == null){
      user.gcmTokens.push(token);
      user.save(error => {
        if(error) console.log('error', error);
        else
          console.log('user update success');
          res.ok(req.user);
      });
    }



    // User
    //   .findOne(req.user.id)
    //   .then(user => {
    //     console.log('user.gcmTokens', user)
    //     // user.gcmTokens.push(params.token);
    //     // console.log('user.gcmTokens', user.gcmTokens)
    //     // user.save();
    //   })
    //   .catch(res.negotiate)
  }

};

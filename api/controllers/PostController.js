import _ from 'lodash';

import actionUtil from 'sails/lib/hooks/blueprints/actionUtil';
import location from '../services/LocationService';
import jsonService from '../services/JsonService';

/**
 * PostController
 * @description :: Server-side logic for manage posts
 */

export function create(req, res) {
  let values = actionUtil.parseValues(req);
  const channel = values.channel

  Spot
    .findOne(channel)
    .then(record => {
      let post = jsonService.getAddressFrom(record);
      post.owner = req.user.id;
      post.name = values.name;
      post.channel = channel;

      Post
        .create(_.omit(post, 'id'))
        .then((record, config) => {
          record.owner = jsonService.getUserSimple(req.user);
          res.created(record, config);
        })
        .catch(res.negotiate)

    })
    .catch(res.negotiate)

}

import _ from 'lodash';

import actionUtil from 'sails/lib/hooks/blueprints/actionUtil';

/**
 * PhotoController
 * @description :: Server-side logic for Noty
 */

export default {
  find(req, res) {
    let params = actionUtil.parseValues(req);
    let query = parseQuery(params);
    query.to = req.user.id

    Noty
      .find(query)
      .sort('createdAt DESC')
      .populateAll()
      .then(res.ok)
      .catch(res.negotiate);
  },

  count(req, res) {
    let params = actionUtil.parseValues(req);
    let query = parseQuery(params);
    query.to = req.user.id

    Noty
      .count(query)
      .then(res.ok)
      .catch(res.negotiate);
  },

  read(req, res) {
    let params = actionUtil.parseValues(req);
    let query = parseQuery(params);
    query.to = req.user.id;
    query.read = false;

    console.log('api_noites_read query: ', query);
    Noty
      .update(query, {read: true})
      .then(res.ok)
      .catch(res.negotiate);
  }
}


function parseQuery(params) {
  let query = _.clone(params);
  query = _.omit(query, 'access_token')
  query = _.omit(query, 'page');
  query = _.omit(query, 'limit');

  return query;
}

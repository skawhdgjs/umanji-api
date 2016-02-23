import _ from 'lodash';

import actionUtil from 'sails/lib/hooks/blueprints/actionUtil';

/**
 * PhotoController
 * @description :: Server-side logic for Noty
 */

export default {
  find(req, res) {
    let params = actionUtil.parseValues(req);

    let limit = parseLimit(params);
    let skip = parseSkip(params);
    let sort = parseSort(params);
    let query = parseQuery(params);
    query.to = req.user.id

    Noty
      .find(query)
      .limit(limit)
      .skip(skip)
      .sort(sort)
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

function parseLimit(params) {
  return params.limit || 15;
}

function parseSkip(params) {
  let limit = params.limit || 15;
  return params.page * limit || 0;
}

function parseSort(params) {
  return params.sort || 'createdAt DESC';
}

function parseDistinct(params) {
  return params.distinct;
}

function parseQuery(params) {
  let query = _.clone(params);
  query = _.omit(query, 'access_token')
  query = _.omit(query, 'page');
  query = _.omit(query, 'limit');
  query = _.omit(query, 'sort');

  return query;
}

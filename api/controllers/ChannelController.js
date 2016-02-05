import _ from 'lodash';

import policy from '../../config/services/policy';

import actionUtil from 'sails/lib/hooks/blueprints/actionUtil';
import location from '../services/LocationService';
import jsonService from '../services/JsonService';
import pusherService from '../services/PusherService';

let pusher = pusherService.android;

/**
 * ChannelController
 * @description :: Server-side logic for ...
 */

export default {
  update(req, res) {
    let params = actionUtil.parseValues(req);

    Channel
      .update(params.id, _.omit(params, 'id'))
      .then(records => records[0] ? res.ok(records[0]) : res.notFound())
      .catch(res.negotiate);
  },

  delete(req, res) {
    let params = actionUtil.parseValues(req);
    let parent = params.parent;

    Channel
      .destroy({id: params.id})
      .then(channel => {
        Channel
          .findOne({id: parent})
          .then(parent => {
            _.remove(parent.subLinks, {
                id: params.id
            });
            parent.save();
            res.ok(channel[0], {parent: params.parent || null});
          })
      })
  },

  create(req, res) {
    let params = actionUtil.parseValues(req);
    params.owner = req.user.id;

    console.log('params', params);

    Channel
      .create(params)
      .then(channel => {
        return Channel
                .findOne(channel.id)
                .populateAll()
      })
      .then(channel => {
        return isSubChannelCreation(req, channel);
      })
      .then(isCommunityCreation)
      .then(channel => {
        res.created(channel, {parent: params.parent || null});
      })
      .catch(res.negotiate);
  },

  find(req, res) {
    let params = actionUtil.parseValues(req);
    let limit = parseLimit(params);
    let skip = parseSkip(params);
    let sort = parseSort(params);
    let query = parseQuery(params);

    console.log('find query ', query);
    console.log('limit ', limit);
    console.log('skip ', skip);
    console.log('sort ', sort);
    Channel
      .find(query)
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .populateAll()
      .then(channels => {
        res.ok(channels, {parent: params.parent || params.owner || null});
      })
      .catch(res.negotiate);
  },

  get(req, res) {
    let params = actionUtil.parseValues(req);

    Channel
      .findOne(params.id)
      .populateAll()
      .then(res.ok)
      .catch(res.negotiate);
  },

  getByPoint(req, res) {
    let params = actionUtil.parseValues(req);
    location.getAddress(params)
      .then(address => {
        let query = {
          type: 'SPOT',
          address: address.address
        }

        Channel
          .findOne(query)
          .then(channel => {
            if(!channel) {
              channel = {};
              jsonService.copyAddress(channel, address);
            }
            res.ok(channel);
          })
          .catch(res.negotiate);
      })
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
  }
}

function parseLimit(params) {
  return params.limit || 100;
}

function parseSkip(params) {
  return params.page * 10 || 0;
}

function parseSort(params) {
  if(params.type == 'SPOT_INNER') {
    params.sort = 'desc.floor ASC';
  }

  return params.sort || 'createdAt DESC';
}

function parseQuery(params) {
  let query = _.clone(params);
  query = _.omit(query, 'access_token')
  query = _.omit(query, 'page');
  query = _.omit(query, 'limit');
  query = _.omit(query, 'sort');

  if(query.type == 'SPOTS')        query.type = ['SPOT', 'SPOT_INNER'];
  if(query.type == 'MAIN_MARKER')  query.type = ['SPOT', 'INFO_CENTER'];
  if(query.type == 'COMMUNITY')  query.type = ['COMMUNITY', 'KEYWORD'];


  if(query.name) query.name = {'contains': query.name};
  if(query.minLatitude) {
    query.latitude = { '>=': query.minLatitude, '<=': query.maxLatitude };
    query.longitude = { '>=': query.minLongitude, '<=': query.maxLongitude };
    query = _.omit(query, ['minLatitude', 'maxLatitude', 'minLongitude', 'maxLongitude']);
  }

  if(query.level < policy.level.LOCAL) {
    query = _.omit(query, ['parent']);

    if(query.type != 'COMMUNITY') {
      query = _.omit(query, ['level']);
    }
  }

  if(query.zoom) {
    query.level = { '<=': query.zoom};
    query = _.omit(query, ['zoom']);
  }

  return query;
}

function isSubChannelCreation(req, subChannel) {
  if(!subChannel.parent) return subChannel;
  Channel
    .findOne(subChannel.parent.id)
    .populateAll()
    .then(parentChannel => {
      parentChannel.subLinks.push({
        owner: req.user.id,
        id: subChannel.id,
        type: subChannel.type,
        name: subChannel.name
      });

      parentChannel.save();
      pusherService.channelCreated(req, parentChannel, subChannel);
    });

  return subChannel;
}

function isCommunityCreation(channel) {
  if(channel.type != 'COMMUNITY' && channel.type != 'KEYWORD') return channel;
  let CommunityChannel = _.clone(channel);

  createLevelCommunity(CommunityChannel, policy.level.DONG, {thoroughfare: CommunityChannel.thoroughfare});
  createLevelCommunity(CommunityChannel, policy.level.GUGUN, {locality: CommunityChannel.locality})
  createLevelCommunity(CommunityChannel, policy.level.DOSI, {adminArea: CommunityChannel.adminArea})

  return channel;
}

function createLevelCommunity(CommunityChannel, level, scope) {

  let query = {
    type: 'COMMUNITY',
    name: CommunityChannel.name,
    level: level
  }
  _.merge(query, scope);

  Channel.findOne(query)
  .then(community => {
    if(!community) {
      let infoQuery = {
        type: 'INFO_CENTER',
        level: level
      }
      _.merge(infoQuery, scope);

      Channel.findOne(infoQuery)
      .then(infoCenter => {
        if(infoCenter) {
          CommunityChannel.level = level
          jsonService.copyAddress(CommunityChannel, infoCenter);

          CommunityChannel.type = 'COMMUNITY';
          Channel
            .create(_.omit(CommunityChannel, 'id'))
            .catch(console.log.bind(console));
        }
      })
    }
  })
}

function isAction(type) {
  const actions = ['MEMBER'];
  return ( _.indexOf(actions, type) > -1 );
}

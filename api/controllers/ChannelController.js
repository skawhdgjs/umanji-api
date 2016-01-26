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

  create(req, res) {
    let params = actionUtil.parseValues(req);
    params.owner = req.user.id;

    Channel
      .create(params)
      .then(channel => {
        return isSubChannelCreation(req, channel);
      })
      .then(isCommunityCreation)
      .then(channel => {
        Channel
          .findOne(channel.id)
          .populateAll()
          .then(channel => {
            res.created(channel, {link: params.link || null});
          })
      })
      .catch(res.negotiate);
  },

  find(req, res) {
    let params = actionUtil.parseValues(req);
    let query = parseQuery(params);

    Channel
      .find(query)
      .populateAll()
      .sort('createdAt DESC')
      .then(channels => {
        res.ok(channels, {link: params.link || params.owner || null});
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

    console.log('token', token);
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

function parseQuery(params) {
  let query = _.clone(params);
  query = _.omit(query, 'access_token')

  if(query.type == 'SPOTS')        query.type = ['SPOT', 'SPOT_INNER'];
  if(query.type == 'MAIN_MARKER')  query.type = ['SPOT', 'INFO_CENTER'];

  if(query.name) query.name = {'contains': query.name};
  if(query.minLatitude) {
    query.latitude = { '>=': query.minLatitude, '<=': query.maxLatitude };
    query.longitude = { '>=': query.minLongitude, '<=': query.maxLongitude };
    query = _.omit(query, ['minLatitude', 'maxLatitude', 'minLongitude', 'maxLongitude']);
  }

  if(query.level < policy.level.LOCAL) {
    query = _.omit(query, ['link']);

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

function isSubChannelCreation(req, channel) {
  if(!channel.link) return channel;
  Channel
    .findOne(channel.link)
    .then(linkedChannel => {
      linkedChannel.subLinks.push({
        owner: req.user.id,
        id: channel.id,
        type: channel.type
      });

      linkedChannel.save();
      pusherService.channelCreated(req, linkedChannel, channel);
    });

  return channel;
}

function isCommunityCreation(channel) {
  if(channel.type != 'COMMUNITY') return channel;
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

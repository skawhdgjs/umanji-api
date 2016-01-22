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
  create(req, res) {
    let params = actionUtil.parseValues(req);
    params.owner = req.user.id;

    Channel
      .create(params)
      .then(isSubChannelCreation)
      .then(isCommunityCreation)
      .then(res.created)
      .catch(res.negotiate);
  },

  findMarkers(req, res) {
    let params = actionUtil.parseValues(req);
    if(!params.type) params.type = ['SPOT', 'INFO_CENTER'];
    find(req, res, params);
  },

  findPosts(req, res) {
    let params = actionUtil.parseValues(req);
    if(!params.type) params.type = ['POST'];
    find(req, res, params);
  },

  find(req, res) {
    let params = actionUtil.parseValues(req);
    console.log('params', params);
    find(req, res, params);
  },

  get(req, res) {
    let params = actionUtil.parseValues(req);

    Channel
      .findOne(params.id)
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
}

function find(req, res, params) {
  let query = parseQuery(params);
  console.log('query:', query);

  Channel
    .find(query)
    .populateAll()
    .sort('updatedAt DESC')
    .then(channels => {
      console.log('channels count:', channels.length);
      res.ok(channels, {link: query.link || query.owner || null});
    })
    .catch(res.negotiate);
}
function parseQuery(params) {
  params = _.omit(params, 'access_token')

  if(params.type == 'SPOTS') params.type = ['SPOT', 'SPOT_INNER'];
  if(params.name) params.name = {'contains': params.name};
  if(params.minLatitude) {
    params.latitude = { '>=': params.minLatitude, '<=': params.maxLatitude };
    params.longitude = { '>=': params.minLongitude, '<=': params.maxLongitude };
    params = _.omit(params, ['minLatitude', 'maxLatitude', 'minLongitude', 'maxLongitude']);
  }

  if(params.zoom) {
    params.level = { '<=': params.zoom};
    params = _.omit(params, ['zoom']);
  }

  return params;
}

function isSubChannelCreation(channel) {
  if(!channel.link) return channel;

  Channel
    .findOne(channel.link)
    .then(linkedChannel => {
      linkedChannel.subLinks.push({
        id: channel.id,
        type: channel.type
      });

      linkedChannel.save();
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
      // 정보센터 주소 얻어오기
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

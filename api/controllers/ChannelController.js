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
 * server coder : Paul Hwang for Git test
 */

export default {

  findComplexSpots(req, res) {
    let params = actionUtil.parseValues(req);
    params = _.omit(params, 'access_token')

    Channel
      .findOne(params.id)
      .then(channel => {
        let subChannelIds = _.pluck(channel.subLinks, 'id');
        console.log('subChannelIds', subChannelIds);

        Channel
          .find({id: subChannelIds})
          .populateAll()
          .then(res.ok)
      })

  },

  link(req, res) {
    let params = actionUtil.parseValues(req);

    Channel
      .findOne(params.parent)
      .populateAll()
      .then(parentChannel => {
        parentChannel.subLinks.push({
          owner: params.owner,
          id: params.id,
          type: params.type,
          name: params.name
        });

        parentChannel.point = parentChannel.point + policy.point.LINK;
        return parentChannel.save();
      })
      .then(res.ok)
  },

  home(req, res) {
    let params = actionUtil.parseValues(req);
    if(!params.id) {
      res.badRequest();
      return;
    }
  },

  update(req, res) {
    let params = actionUtil.parseValues(req);
    if(!params.id) {
      res.badRequest();
      return;
    }

    Channel
      .update(params.id, _.omit(params, 'id'))
      .then(records => records[0] ? res.ok(records[0]) : res.notFound())
      .catch(res.negotiate);
  },

  delete(req, res) {
    let params = actionUtil.parseValues(req);
    let parentId = params.parent;

    if(!params.id) {
      res.badRequest();
      return;
    }

    Channel
      .destroy({id: params.id})
      .then(channel => {

        Channel
          .update({id: req.user.id}, {point: req.user.point - policy.point.DELETE_CHANNEL})
          .catch(console.log.bind(console));


        if(parentId) {
          Channel
            .findOne({id: parentId})
            .then(parent => {
              _.remove(parent.subLinks, {
                  id: params.id
              });

              parent.point = parent.point - policy.point.DELETE_CHANNEL;
              parent.save();
              res.ok(parent, {parent: params.parent || null});
            })
        }else {
          res.ok(channel[0]);
        }
      })
  },

  vote(req, res) {
    let params = actionUtil.parseValues(req);
    console.log('vote params', params);
    this.create(req, res, params);
  },

  createCommunity(req, res) {
    let params = actionUtil.parseValues(req);
    const level = params.level;

    console.log('level', level);

    if(level == policy.level.LOCAL) {
      this.create(req, res, params);
    } else {
      let communityChannel = {}
      jsonService.copyAddress(communityChannel, params);
      communityChannel.owner = req.user.id;
      communityChannel.level = params.level;
      communityChannel.name = params.name;
      communityChannel.type = 'COMMUNITY';

      switch (communityChannel.level) {
        case policy.level.DONG:
          createLevelCommunity(communityChannel, policy.level.DONG, {thoroughfare: communityChannel.thoroughfare})
            .then(channel => {

              if(channel) {
                  Channel
                    .findOne(channel.id)
                    .populateAll()
                    .then(channel => {
                        res.created(channel, {parent: params.parent || null});
                    })
              }else {
                res.ok({}, {parent: params.parent || null});
              }

            });

          createLevelCommunity(communityChannel, policy.level.GUGUN, {locality: communityChannel.locality})
          createLevelCommunity(communityChannel, policy.level.DOSI, {adminArea: communityChannel.adminArea})
          createLevelCommunity(communityChannel, policy.level.CONTRY, {countryCode: communityChannel.countryCode})
          break;

        case policy.level.GUGUN:
          createLevelCommunity(communityChannel, policy.level.GUGUN, {locality: communityChannel.locality})
            .then(channel => {

              if(channel) {
                  Channel
                    .findOne(channel.id)
                    .populateAll()
                    .then(channel => {
                        res.created(channel, {parent: params.parent || null});
                    })
              }else {
                res.ok({}, {parent: params.parent || null});
              }

            });

          createLevelCommunity(communityChannel, policy.level.DOSI, {adminArea: communityChannel.adminArea})
          createLevelCommunity(communityChannel, policy.level.CONTRY, {countryCode: communityChannel.countryCode})
          break;

        case policy.level.DOSI:
          createLevelCommunity(communityChannel, policy.level.DOSI, {adminArea: communityChannel.adminArea})
            .then(channel => {

              if(channel) {
                  Channel
                    .findOne(channel.id)
                    .populateAll()
                    .then(channel => {
                      res.created(channel, {parent: params.parent || null});
                    })
              }else {
                res.ok({}, {parent: params.parent || null});
              }

            });
          createLevelCommunity(communityChannel, policy.level.CONTRY, {countryCode: communityChannel.countryCode})
          break;

        case policy.level.CONTRY:
          createLevelCommunity(communityChannel, policy.level.CONTRY, {countryCode: communityChannel.countryCode})
            .then(channel => {

              if(channel) {
                  Channel
                    .findOne(channel.id)
                    .populateAll()
                    .then(channel => {
                        res.created(channel, {parent: params.parent || null});
                    })
              }else {
                res.ok({}, {parent: params.parent || null});
              }

            });
          break;
      }
    }
  },



  createChannel(req, res) {
    let params = actionUtil.parseValues(req);
    this.create(req, res, params);
  },

  create(req, res) {
    let params = actionUtil.parseValues(req);
    params.owner = req.user.id;

    Channel
      .create(params)
      .then(channel => {

        Channel
          .update({id: req.user.id}, {point: req.user.point + policy.point.CREATE_CHANNEL})
          .catch(console.log.bind(console));

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

  findProfilePosts(req, res) {
    let params = actionUtil.parseValues(req);
    params.type = 'POST';
    this.find(req, res, params);
  },

  findMainMarkers(req, res) {
    let params = actionUtil.parseValues(req);
    params.type = ['SPOT', 'INFO_CENTER', 'COMPLEX'];

    this.find(req, res, params);
  },

  findMainPosts(req, res) {
    let params = actionUtil.parseValues(req);
    params.type = 'POST';
    this.find(req, res, params);
  },

  findPosts(req, res) {
    let params = actionUtil.parseValues(req);
    params.type = 'POST';

    this.find(req, res, params);
  },

  findSpots(req, res) {
    let params = actionUtil.parseValues(req);
    this.find(req, res, params);
  },

  findMembers(req, res) {
    let params = actionUtil.parseValues(req);
    this.find(req, res, params);
  },

  findChannels(req, res) {
    let params = actionUtil.parseValues(req);
    this.find(req, res, params);
  },

  search(req, res) {
    let params = actionUtil.parseValues(req);
    this.find(req, res, params);
  },

  find(req, res, params) {
    let limit = parseLimit(params);
    let skip = parseSkip(params);
    let sort = parseSort(params);
    let distinct = parseDistinct(params);
    let query = parseQuery(params);

    console.log('find query', query);

    Channel
      .find(query)
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .populateAll()
      .then(channels => {
        if(distinct) {
          channels = _.uniq(channels, distinct);
        }
        console.log('channels length', channels.length);
        res.ok(channels, {parent: params.parent || params.owner || null});
      })
      .catch(res.negotiate);
  },

  findOne(req, res) {
    let params = actionUtil.parseValues(req);
    let query = _.omit(params, 'access_token');

    console.log('findOne query', query);

    Channel
      .findOne(query)
      .populateAll()
      .then(res.ok)
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
  return params.limit || 15;
}

function parseSkip(params) {
  let limit = params.limit || 15;
  return params.page * limit || 0;
}

function parseSort(params) {
  if(params.type == 'SPOT_INNER') {
    params.sort = 'desc.floor ASC';
  }

  return params.sort || 'updatedAt DESC';
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
  query = _.omit(query, 'distinct');

  if(query.name) query.name = {'contains': query.name};
  if(query.minLatitude) {
    query.latitude = { '>=': query.minLatitude, '<=': query.maxLatitude };
    query.longitude = { '>=': query.minLongitude, '<=': query.maxLongitude };
    query = _.omit(query, ['minLatitude', 'maxLatitude', 'minLongitude', 'maxLongitude']);
  }

  if(query.level < policy.level.LOCAL) {
    if(query.type != 'COMMUNITY') {
      query = _.omit(query, ['level']);
    }
  }

  if(query.zoom) {
    query.level = { '<=': query.zoom};
    query = _.omit(query, ['zoom']);
  }

  if(query.parentType == 'INFO_CENTER' || query .parentType == 'SPOT') {
    query = _.omit(query, ['parentType']);
    query = _.omit(query, ['parent']);
  }

  if(query.type == 'SPOTS')        query.type = ['SPOT', 'SPOT_INNER'];
  if(query.type == 'MAIN_MARKER')  query.type = ['SPOT', 'INFO_CENTER', 'COMPLEX'];

  return query;
}

function isSubChannelCreation(req, subChannel) {
  if(!subChannel.parent) return subChannel;

  return Channel
    .findOne(subChannel.parent.id)
    .populateAll()
    .then(parentChannel => {
      parentChannel.subLinks.push({
        owner: req.user.id,
        id: subChannel.id,
        type: subChannel.type,
        name: subChannel.name
      });

      parentChannel.point = parentChannel.point + policy.point.CREATE_CHANNEL;
      parentChannel.save();
      pusherService.channelCreated(req, parentChannel, subChannel);

      subChannel.parent = parentChannel;
      return subChannel;
    });
}

function isCommunityCreation(channel) {
  if(channel.type != 'COMMUNITY' && channel.type != 'KEYWORD') return channel;
  let communityChannel = _.clone(channel);

  switch (communityChannel.level) {
    case policy.level.LOCAL:
    case policy.level.DONG:
      createLevelCommunity(communityChannel, policy.level.DONG, {thoroughfare: communityChannel.thoroughfare});
    case policy.level.GUGUN:
      createLevelCommunity(communityChannel, policy.level.GUGUN, {locality: communityChannel.locality})
    case policy.level.DOSI:
      createLevelCommunity(communityChannel, policy.level.DOSI, {adminArea: communityChannel.adminArea})
    case policy.level.CONTRY:
      createLevelCommunity(communityChannel, policy.level.CONTRY, {countryCode: communityChannel.countryCode})
      break;
  }

  return channel;
}

function createLevelCommunity(communityChannel, level, scope) {
  let query = {
    type: 'COMMUNITY',
    name: communityChannel.name,
    level: level
  }
  _.merge(query, scope);


  return Channel.findOne(query)
    .then(community => {
      if(!community) {
        let infoQuery = {
          type: 'INFO_CENTER',
          level: level
        }
        _.merge(infoQuery, scope);

        return Channel.findOne(infoQuery)
        .then(infoCenter => {
          if(infoCenter) {

            communityChannel.level = level
            jsonService.copyAddress(communityChannel, infoCenter);
            communityChannel.type = 'COMMUNITY';
            return Channel
              .create(_.omit(communityChannel, 'id'))
              .catch(console.log.bind(console));
          }
        })
      } else {
        return null;
      }
    })
}

function isAction(type) {
  const actions = ['MEMBER'];
  return ( _.indexOf(actions, type) > -1 );
}

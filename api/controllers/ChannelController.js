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
  find(req, res) {
    let params = actionUtil.parseValues(req);
    let query = getMainQuery(params);

    Channel
      .find(query)
      .populate('owner')
      .sort('updatedAt DESC')
      .then(res.ok)
      .catch(res.negotiate);
  },

  get(req, res) {
    let params = actionUtil.parseValues(req);

    Channel
      .findOne(params.id)
      .populate('owner')
      .then(res.ok)
      .catch(res.negotiate);
  },

  findMarkers(req, res) {
    let params = actionUtil.parseValues(req);

    if(!params.type) {
      params.type = ['SPOT', 'INFO_CENTER'];
    }
    let query = getMainQuery(params);

    Channel
      .find(query)
      .populate('owner')
      .sort('updatedAt DESC')
      .then(res.ok)
      .catch(res.negotiate);
  },

  findPosts(req, res) {
    let params = actionUtil.parseValues(req);

    if(!params.type) {
      params.type = ['POST'];
    }

    let query = getMainQuery(params);

    Channel
      .find(query)
      .populateAll()
      .sort('updatedAt DESC')
      .then(res.ok)
      .catch(res.negotiate);
  },

  getByPoint(req, res) {
    let params = actionUtil.parseValues(req);
    getAddress(params)
      .then(address => {
        let query = {
          type: 'SPOT',
          address: address.address
        }

        Channel
          .findOne(query)
          .then(res.ok)
          .catch(res.negotiate);
      })
      .catch(res.negotiate);
  },

  createSpot(req, res) {
    let params = actionUtil.parseValues(req);

    getAddress(params)
      .then(address => {
        let query = {
          type: 'SPOT',
          address: address.address
        }

        Channel
          .findOne(query)
          .then(record => {
            if(record) res.ok(record);
            else {
              let spot = {
                type: 'SPOT',
                owner: req.user.id,
                name: params.name
              };

              jsonService.copyAddress(spot, address);

              Channel
                .create(spot)
                .then(res.created)
                .catch(res.negotiate);
            }
          })
          .catch(res.negotiate);
      })
      .catch(res.negotiate);
  },

  createCommunity(req, res) {
    let params = actionUtil.parseValues(req);

    Channel
      .findOne(params.id)
      .populate('owner')
      .then(channelRecord => {

        let linkData = {
          owner: req.user.id,
          type: params.type,
          name: params.name,
          link: params.id,
          photos: params.photos
        };

        jsonService.copyAddress(linkData, channelRecord);

        Channel
          .create(linkData)
          .then((linkRecord, config) => {
            linkRecord.owner = jsonService.getUserSimple(req.user);
            pusherService.channelCreated(req, pusher, channelRecord, linkRecord);
            res.created(linkRecord, config);

            let query = {}
            // 동단위 커뮤니티
            Channel.findOne({
              name: linkRecord.name,
              type: 'COMMUNITY',
              level: policy.level.DONG,
              thoroughfare: linkRecord.thoroughfare
            })
            .then(dongCommunity => {
              if(!dongCommunity) {
                // 동단위 정보센터 주소 얻어오기
                Channel.findOne({
                  type: 'INFO_CENTER',
                  level: policy.level.DONG,
                  thoroughfare: linkRecord.thoroughfare
                })
                .then(dongInfoCenter => {
                  linkData.level = policy.level.DONG
                  jsonService.copyAddress(linkData, dongInfoCenter);

                  Channel
                    .create(linkData)
                    .catch(console.log.bind(console));
                })
              }
            })

            // 구군단위 커뮤니티
            Channel.findOne({
              name: linkRecord.name,
              type: 'COMMUNITY',
              level: policy.level.GUGUN,
              locality: linkRecord.locality
            })
            .then(gugunCommunity => {

              if(!gugunCommunity) {
                // 동단위 정보센터 주소 얻어오기
                Channel.findOne({
                  type: 'INFO_CENTER',
                  level: policy.level.GUGUN,
                  locality: linkRecord.locality
                })
                .then(gugunInfoCenter => {
                  linkData.level = policy.level.GUGUN
                  jsonService.copyAddress(linkData, gugunInfoCenter);

                  Channel
                    .create(linkData)
                    .catch(console.log.bind(console));
                })
              }
            })

            // 시도단위 커뮤니티
            Channel.findOne({
              name: linkRecord.name,
              type: 'COMMUNITY',
              level: policy.level.DOSI,
              thoroughfare: linkRecord.adminArea
            })
            .then(dosiCommunity => {
              if(!dosiCommunity) {
                // 동단위 정보센터 주소 얻어오기
                Channel.findOne({
                  type: 'INFO_CENTER',
                  level: policy.level.DOSI,
                  adminArea: linkRecord.adminArea
                })
                .then(dosiInfoCenter => {
                  linkData.level = policy.level.DOSI
                  jsonService.copyAddress(linkData, dosiInfoCenter);

                  Channel
                    .create(linkData)
                    .catch(console.log.bind(console));
                })
              }

            })
          })
          .catch(res.negotiate)

      })
      .catch(res.negotiate)
  },

  createLink(req, res) {
    let params = actionUtil.parseValues(req);

    Channel
      .findOne(params.id)
      .populate('owner')
      .then(channelRecord => {

        let linkData = {
          owner: req.user.id,
          type: params.type,
          name: params.name,
          link: params.id,
          photos: params.photos
        };

        jsonService.copyAddress(linkData, channelRecord);

        Channel
          .create(linkData)
          .then((linkRecord, config) => {
            linkRecord.owner = jsonService.getUserSimple(req.user);

            pusherService.channelCreated(req, pusher, channelRecord, linkRecord);

            res.created(linkRecord, config);
          })
          .catch(res.negotiate)

      })
      .catch(res.negotiate)
  },

  isJoined(req, res) {
    let params = actionUtil.parseValues(req);
    let channelId = params.id

    let query = {
      owner: req.user.id,
      link: channelId
    }

    Channel
      .findOne(query)
      .then(record => {
        if(record != null) {
          res.ok({});
        }else {
          res.notFound();
        }
      })
      .catch(res.negotiate)
  },

  join(req, res) {
    let params = actionUtil.parseValues(req);
    let channelId = params.id


    let query = {
      owner: req.user.id,
      link: channelId
    }

    Channel
      .findOne(query)
      .then(record => {
        if(record == null) {
          this.createLink(req, res);
        }
      })
      .catch(res.negotiate)
  },

  getLinks(req, res) {
    let params = actionUtil.parseValues(req);
    let level = params.level;

    if(level == policy.level.LOCAL) {
      let query = {
        link: params.id,
        type: params.type
      }

      if(params.type == 'COMMUNITY') {
        query.level = policy.level.LOCAL
      }

      console.log('params', params);

      Channel
        .find(query)
        .populate('owner')
        .sort('updatedAt DESC')
        .then(records => {
          console.log('records', records);
          if(records.length > 0) res.ok(records);
          else res.ok([])
        })
        .catch(res.negotiate);
    }
    else if(level == policy.level.DONG) {
      Channel
        .findOne(params.id)
        .then(record => {
          if(record) {

            let query = {
              countryName: record.countryName,
              adminArea: record.adminArea,
              locality: record.locality,
              thoroughfare: record.thoroughfare,
              type: params.type
            }
            if(params.type == 'COMMUNITY') {
              query.level = policy.level.DONG
            }

            if(params.type == 'SPOT') {
              query.type = ['SPOT', 'SPOT_INNER'];
            }

            Channel
              .find(query)
              .populate('owner')
              .sort('updatedAt DESC')
              .then(records => {
                if(records.length > 0) res.ok(records);
                else res.ok([])
              })
              .catch(res.negotiate);
          }
        })
        .catch(res.negotiate);
    }
    else if(level == policy.level.GUGUN) {

      Channel
        .findOne(params.id)
        .then(record => {
          if(record) {

            let query = {
              countryName: record.countryName,
              adminArea: record.adminArea,
              locality: record.locality,
              type: params.type
            }

            if(params.type == 'COMMUNITY') {
              query.level = policy.level.GUGUN
            }

            if(params.type == 'SPOT') {
              query.type = ['SPOT', 'SPOT_INNER'];
            }

            Channel
              .find(query)
              .populate('owner')
              .sort('updatedAt DESC')
              .then(records => {
                if(records.length > 0) res.ok(records);
                else res.ok([])
              })
              .catch(res.negotiate);
          }
        })
        .catch(res.negotiate);
    }
    else if(level == policy.level.DOSI) {
      Channel
        .findOne(params.id)
        .then(record => {
          if(record) {

            let query = {
              countryName: record.countryName,
              adminArea: record.adminArea,
              type: params.type
            }

            if(params.type == 'COMMUNITY') {
              query.level = policy.level.DOSI
            }

            if(params.type == 'SPOT') {
              query.type = ['SPOT', 'SPOT_INNER'];
            }

            console.log('params', params);
            Channel
              .find(query)
              .populate('owner')
              .sort('updatedAt DESC')
              .then(records => {
                if(records.length > 0) res.ok(records);
                else res.ok([])
              })
              .catch(res.negotiate);
          } else res.ok([])
        })
        .catch(res.negotiate);
    }

  },

  getLevelLinks(req, res) {
    let pk = actionUtil.requirePk(req);
    let params = actionUtil.parseValues(req);

    level = params.level;

    Channel
      .find({
        type: params.type
      })
      .populate('owner')
      .then(res.ok)
      .catch(res.negotiate);
  },

}

function getAddress(point) {
  return location
    .getAddressByTmap(point)
    .then(address => {
      if(address) {
        return new Promise((resolve, reject) => {
          resolve(address);
        })

      }else {
        return location.getAddressByGmap(point)
      }
    })
}

function getMainQuery(params) {
  let query = {}
  if(params.id) query.id = params.id;
  if(params.type) query.type = params.type;
  if(params.name) query.name = {'contains': params.name};
  if(params.minLatitude) {
    query.latitude = { '>=': params.minLatitude, '<=': params.maxLatitude };
    query.longitude = { '>=': params.minLongitude, '<=': params.maxLongitude };
  }
  if(params.zoom) query.level = { '<=': params.zoom};

  return query;
}

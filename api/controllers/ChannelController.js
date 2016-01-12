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
    params.type = ['SPOT', 'SPOT_INNER', 'INFO_CENTER'];

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
    params.type = ['POST']

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
    console.log('createSpot');
    let params = actionUtil.parseValues(req);
    console.log('params', params);

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

  createLink(req, res) {
    let params = actionUtil.parseValues(req);
    console.log('createLink: params', params);

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
    console.log('params', params);
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

// countryName
// adminArea
// locality
// thoroughfare
// featureName

// level: {
//   SPOT:     18,
//   COMPLEX:  15,
//   DONG:     13,
//   GUGUN:    11,
//   DOSI:     8,
//   CONTRY:   4
// },

  getLinks(req, res) {
    let params = actionUtil.parseValues(req);
    let level = params.level;


    if(level == policy.level.SPOT) {
      Channel
        .find({
          link: params.id,
          type: params.type
        })
        .populate('owner')
        .sort('updatedAt DESC')
        .then(records => {
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

            Channel
              .find({
                countryName: record.countryName,
                adminArea: record.adminArea,
                locality: record.locality,
                thoroughfare: record.thoroughfare
              })
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

            Channel
              .find({
                countryName: record.countryName,
                adminArea: record.adminArea,
                locality: record.locality,
              })
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
            Channel
              .find({
                countryName: record.countryName,
                adminArea: record.adminArea,
                type: params.type
              })
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
  if(params.id) query.id = params.id
  if(params.type) query.type = query.type = params.type;
  if(params.minLatitude) {
    query.latitude = { '>=': params.minLatitude, '<=': params.maxLatitude };
    query.longitude = { '>=': params.minLongitude, '<=': params.maxLongitude };
  }
  if(params.zoom) query.level = { '<=': params.zoom};

  return query;
}

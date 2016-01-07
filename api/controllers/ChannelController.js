import _ from 'lodash';

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
    params.type = ['SPOT', 'SPOT_INNER'];

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

  create(req, res) {
    let params = actionUtil.parseValues(req);

    Channel
      .findOne(params.id)
      .populate('owner')
      .then(channelRecord => {

        let post = {
          owner: req.user.id,
          type: params.type,
          name: params.name,
          link: params.id,
          photos: params.photos
        };

        jsonService.copyAddress(post, channelRecord);

        Channel
          .create(post)
          .then((postRecord, config) => {
            postRecord.owner = jsonService.getUserSimple(req.user);

            pusherService.channelCreated(pusher, channelRecord, postRecord);

            res.created(postRecord, config);
          })
          .catch(res.negotiate)

      })
      .catch(res.negotiate)
  },

  getLinks(req, res) {
    let params = actionUtil.parseValues(req);

    Channel
      .find({
        link: params.id,
        type: params.type
      })
      .populate('owner')
      .sort('updatedAt DESC')
      .then(res.ok)
      .catch(res.negotiate);

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

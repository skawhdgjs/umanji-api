import _ from 'lodash';

import actionUtil from 'sails/lib/hooks/blueprints/actionUtil';
import location from '../services/LocationService';
import jsonService from '../services/JsonService';

/**
 * ChannelController
 * @description :: Server-side logic for ...
 */

export default {
  find(req, res) {
    let params = actionUtil.parseValues(req);
    find(req, res, params);
  },

  findMarkers(req, res) {
    let params = actionUtil.parseValues(req);
    params.type = ['SPOT', 'SPOT_INNER'];
    find(req, res, params);
  },

  findPosts(req, res) {
    let params = actionUtil.parseValues(req);
    params.type = ['SPOT']
    find(req, res, params);
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
    let pk = actionUtil.requirePk(req);
    let params = actionUtil.parseValues(req);

    console.log('pk', pk);
    console.log('params', params);

    Channel
      .findOne(pk)
      .then(record => {

        let post = {
          owner: req.user.id,
          type: params.type,
          name: params.name,
          link: pk,
        };

        jsonService.copyAddress(post, record);

        Channel
          .create(post)
          .then((record, config) => {
            record.owner = jsonService.getUserSimple(req.user);
            res.created(record, config);
          })
          .catch(res.negotiate)

      })
      .catch(res.negotiate)
  },

  getLinks(req, res) {
    let params = actionUtil.parseValues(req);
    console.log('getLinks: params', params);
    
    Channel
      .find({
        link: params.id,
        type: params.type
      })
      .populate('owner')
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

function find(req, res, params) {
  let query = {}

  if(params.id) query.id = params.id
  if(params.type) query.type = query.type = params.type;
  if(params.minLatitude) {
    query.latitude = { '>=': params.minLatitude, '<=': params.maxLatitude };
    query.longitude = { '>=': params.minLongitude, '<=': params.maxLongitude };
  }
  if(params.zoom) query.level = params.zoom;

  Channel
    .find(query)
    .populate('owner')
    .then((records, config) => {
      if(records.length == 1){
        res.ok(records[0], config);
      } else {
        res.ok(records, config);
      }
    })
    .catch(res.negotiate);
}

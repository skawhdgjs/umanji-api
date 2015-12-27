import _ from 'lodash';

import actionUtil from 'sails/lib/hooks/blueprints/actionUtil';
import location from '../services/LocationService';


export function get(req, res) {
  let pk = actionUtil.requirePk(req);
  let values = actionUtil.parseValues(req);

  Spot
    .findOne(pk)
    .then(record => record ? res.ok(record) : res.notFound())
    .catch(res.negotiate);
}

export function getMainChannels(req, res) {
  let values = actionUtil.parseValues(req);

  Spot
    .find({
      type: ['SPOT', 'INFO_CENTER'],
      latitude: { '>=': values.minLatitude, '<=': values.maxLatitude },
      longitude: { '>=': values.minLongitude, '<=': values.maxLongitude },
      level: { '<=': values.zoom}
    })
    .then(records => {
      res.ok(records)
    })
    .catch(res.negotiate);

}

export function getByPoint(req, res) {
  let values = actionUtil.parseValues(req);

  const point = {
    'latitude': req.param('latitude'),
    'longitude': req.param('longitude')
  }

  getAddress(point)
    .then(address => {
      let query = {
        type: 'SPOT',
        address: address.address
      }

      Spot
        .findOne(query)
        .then(record => record ? res.ok(record) : res.ok(address))
        .catch(res.negotiate);
    })
    .catch(res.negotiate);
}

export function create(req, res) {
  let values = actionUtil.parseValues(req);
  const point = {
    'latitude': req.param('latitude'),
    'longitude': req.param('longitude')
  }

  getAddress(point)
    .then(address => {
      let query = {
        type: 'SPOT',
        address: address.address
      }

      address.latitude = point.latitude;
      address.longitude = point.longitude;

      Spot
        .findOne(query)
        .then(record => record ? res.ok(record) : createSpot(res, address))
        .catch(res.negotiate);
    })
    .catch(res.negotiate);
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

function createSpot(res, address) {

  Spot
    .create(address)
    .then(record => record ? res.ok(record) : createSpot(address))
    .catch(res.negotiate);
}

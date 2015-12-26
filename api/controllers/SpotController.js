import _ from 'lodash';

import actionUtil from 'sails/lib/hooks/blueprints/actionUtil';
import location from '../services/LocationService';


export function get(req, res) {
  let values = actionUtil.parseValues(req);

  const point = {
    'latitude': req.param('latitude'),
    'longitude': req.param('longitude')
  }

  location
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
    .then(address => {

      let query = {
        type: 'SPOT',
        address: address.address
      }

      Spot
        .findOne(query)
        .then(record => record ? res.ok(record) : createSpot(res, address))
        .catch(res.negotiate);
    })
    .catch(res.negotiate);
}

function createSpot(res, address) {
  console.log('create spot');

  Spot
    .create(address)
    .then(record => record ? res.ok(record) : createSpot(address))
    .catch(res.negotiate);
}

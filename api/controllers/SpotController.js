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
      res.ok(address);

    })
    .catch(res.negotiate);



  // Spot
  //   .findOne(query)
  //   .then(record => record ? res.ok(record) : res.notFound())
  //   .catch(res.negotiate);
}





// getAddressByTmap = (latitude, longitude) ->
//   options =
//     headers: {
//       'Content-Type': 'application/json'
//       'access_token': '68b558b6-a032-4c07-846b-ec0379fdd229'
//     }
//
//   result = Meteor.http.get("https://apis.skplanetx.com/tmap/geo/reversegeocoding?lon=" + longitude + "&lat=" + latitude + "&version=1&appKey=260efe0d-c6ab-3d4b-a97a-efdb7a4528a5&coordType=WGS84GEO&addressType=A10", options)
//   return JSON.parse(result.content).addressInfo
//
// getAddressByGmap = (latitude, longitude) ->
//   options =
//     headers: {
//       'Content-Type': 'application/json'
//     }
//
//   result = Meteor.http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude+ "&key=AIzaSyCQCJnG4VyPK-kJy4-84xBGCRobhtKMQFE")
//   return JSON.parse(result.content).results[0]

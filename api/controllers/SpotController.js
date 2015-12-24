import _ from 'lodash';
import https from 'https';
import actionUtil from 'sails/lib/hooks/blueprints/actionUtil';





export function get(req, res) {
  let values = actionUtil.parseValues(req);

  const query = {
    'latitude': req.param('latitude'),
    'longitude': req.param('longitude')
  }

  let options = {
          host : 'apis.skplanetx.com',
          port: 443,
          path : "/tmap/geo/reversegeocoding?lon="+ query.longitude + "&lat=" + query.latitude + "&version=1&appKey=260efe0d-c6ab-3d4b-a97a-efdb7a4528a5&coordType=WGS84GEO&addressType=A10",
          method : 'GET',
          headers : {
            'Content-Type': 'application/json',
            'access_token': '68b558b6-a032-4c07-846b-ec0379fdd229'
          }
      };

  https.request(options, function(response) {

    //http://stackoverflow.com/questions/11826384/calling-a-json-api-with-node-js
    response.on('error', e => { console.log('error', e.message) });
    response.on('data', data => {
      res.ok(JSON.parse(data));
    });

  }).end();

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

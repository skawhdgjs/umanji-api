import config from '../../config/services/location';
import https from 'https';
import Promise from 'bluebird';

export default {
  getAddressByGmap: (point) => {
    return new Promise((resolve, reject) => {
      let options = {
              host : 'maps.googleapis.com',
              port: 443,
              path : "/maps/api/geocode/json?latlng=" + point.latitude + "," + point.longitude+ "&key=AIzaSyCQCJnG4VyPK-kJy4-84xBGCRobhtKMQFE",
              method : 'GET',
              headers : {
                'Content-Type': 'application/json'
              }
          };

      https.request(options, function(response) {
        let body = '';
        response.on('error', e => { reject(e); });
        response.on('data', (chunk) => { body += chunk; });

        response.on('end', () => {
          if(body) {
            let address = JSON.parse(body);
            resolve(address);
          } else {
            resolve('');
          }
        });

      }).end();
    })
  },
  getAddressByTmap: (point) => {
    return new Promise( (resolve, reject) => {
      let options = {
              host : 'apis.skplanetx.com',
              port: 443,
              path : "/tmap/geo/reversegeocoding?lon="+ point.longitude + "&lat=" + point.latitude + "&version=1&appKey=260efe0d-c6ab-3d4b-a97a-efdb7a4528a5&coordType=WGS84GEO&addressType=A10",
              method : 'GET',
              headers : {
                'Content-Type': 'application/json',
                'access_token': '68b558b6-a032-4c07-846b-ec0379fdd229'
              }
          };

      https.request(options, function(response) {
        let body = '';
        response.on('error', e => { reject(e); });
        response.on('data', (chunk) => {
          body += chunk;
        });

        response.on('end', () => {
          if(body) {
            let address = JSON.parse(body);
            resolve(address);
          } else {
            resolve('');
          }
        });

      }).end();
    })
  }

};

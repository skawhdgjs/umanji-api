import _ from 'lodash';

import http from 'http';
import Promise from 'bluebird';

/**
 * MigrationController
 * @description :: Server-side logic for ...
 */

export default {
  importData(req, res) {
      // http://zeitgeistmove.cafe24.com/j/push.php
      var options = {
        host: 'zeitgeistmove.cafe24.com',
        port: 80,
        path: '/j/push.php',
        method: 'GET'
      };

      var request = http.request(options, (response) => {

        let body = '';
        response.on('data', (chunk) => {
          body += chunk;
        });
        response.on('end', (error) => {
          let addresses = JSON.parse(body);

          _.forEach(addresses, (address) => {
            Address
              .create(address)
              .catch((error) =>{
                console.log('error', error);
              })
          });

          res.ok({body: addresses});

        // "code": "1324306",
        // "type": "경찰",
        // "type2": "경찰청_파출소",
        // "delegate": "경찰청",
        // "full_name": "경찰청 강원도지방경찰청 평창경찰서 진부파출소",
        // "name": "진부파출소",
        // "zip_code": "25325",
        // "road_address": "강원도 평창군 진부면 청송로 103",
        // "latitude": "37.6368776265626",
        // "longitude": "128.557821877919"



        })
      });
      request.end();
  }
}

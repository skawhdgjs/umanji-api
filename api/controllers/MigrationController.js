import policy from '../../config/services/policy';

import _ from 'lodash';

import http from 'http';
import Promise from 'bluebird';

/**
 * MigrationController
 * @description :: Server-side logic for ...
 */


/**
    "66" : "1시도_시",
    "50" : "2시도_도",
    "52" : "3시군구_시",
    "59" : "4시군구_군",
    "63" : "5시군구_구",
    "58" : "6읍면동_읍",
    "54" : "7읍면동_면",
    "53" : "8읍면동_동",
*/

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

export default {

  toChannel_03(req, res) {
    Address
      .find({type2: ['6읍면동_읍', '7읍면동_면', '8읍면동_동']})
      .then(addresses => {
        _.forEach(addresses, (address) => {

          let addressSet = address.road_address.split(' ');

          address.name = address.name.replace(/사무소$/, '')
          address.name = address.name.replace(/주민센터$/, '')

          let channel = {
            type: 'INFO_CENTER',
            name: address.name.replace(/사무소$/, '') + ' 정보센터',
            address: address.road_address,
            countryCode: 'KR',
            countryName: '대한민국',
            adminArea: address.delegate.replace(/청$/, ''),
            locality: addressSet[1],
            thoroughfare: address.name,
            featureName: addressSet[3] + ' ' + addressSet[4]? addressSet[4]: '',
            latitude: address.latitude,
            longitude: address.longitude,
            level: policy.level.DONG
          }

          Channel
            .create(channel)
            .then(console.log.bind(console))
            .catch(console.log.bind(console));
        })

        res.ok(addresses);
      })
  },

  toChannel_02(req, res) {
    Address
      .find({type2: ['3시군구_시', '4시군구_군', '5시군구_구']})
      .then(addresses => {
        _.forEach(addresses, (address) => {
          let channel = {
            type: 'INFO_CENTER',
            name: address.name + ' 정보센터',
            address: address.road_address,
            countryCode: 'KR',
            countryName: '대한민국',
            adminArea: address.delegate.replace(/청$/, ''),
            locality: address.name.replace(/청$/, ''),
            latitude: address.latitude,
            longitude: address.longitude,
            level: policy.level.GUGUN
          }

          Channel
            .create(channel)
            .then(console.log.bind(console))
            .catch(console.log.bind(console));
        })

        res.ok(addresses);
      })
  },

  toChannel_01(req, res) {
    Address
      .find({type2: ['1시도_시', '2시도_도']})
      .then(addresses => {

        _.forEach(addresses, (address) => {
          let channel = {
            type: 'INFO_CENTER',
            name: address.name.replace(/청$/, '') + ' 정보센터',
            address: address.road_address,
            countryCode: 'KR',
            countryName: '대한민국',
            adminArea: address.delegate.replace(/청$/, ''),
            latitude: address.latitude,
            longitude: address.longitude,
            level: policy.level.DOSI
          }

          Channel
            .create(channel)
            .then(console.log.bind(console))
            .catch(console.log.bind(console));
        })

        res.ok(addresses);
      })
  },

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


        })
      });
      request.end();
  },

  deleteData(req, res) {
    Channel
      .find()
      .then(channels => {
        let deletedPostCountByEmptyUser = 0;
        let deletedPostCountByEmptyParent = 0;

        _.forEach(channels, (channel) => {
          if(channel.type == 'POST' || channel.type == 'MEMBER') {
            console.log('channel.type', channel.type);
            console.log('channel.owner', channel.owner);

            Channel
              .findOne(channel.owner)
              .then(user => {
                if(user == null) {
                  deletedPostCountByEmptyUser = deletedPostCountByEmptyUser + 1;
                  console.log('deletedPostCountByEmptyUser :', deletedPostCountByEmptyUser);
                  Channel
                    .destroy({id: channel.id})
                }

                Channel
                  .findOne(channel.parent)
                  .then(parent => {
                    if(parent == null) {
                      deletedPostCountByEmptyParent = deletedPostCountByEmptyParent + 1;
                      console.log('deletedPostCountByEmptyParent :', deletedPostCountByEmptyParent);
                      Channel
                        .destroy({id: channel.id})
                    }
                  })
              });
          }
        })
      })
  }
}

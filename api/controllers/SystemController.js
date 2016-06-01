import _ from 'lodash';

import actionUtil from 'sails/lib/hooks/blueprints/actionUtil';

/**
 * PhotoController
 * @description :: Server-side logic for Noty
 */

export default {
  version(req, res) {

    System
      .findOne({key: 'version'})
      .then(res.ok)
      .catch(res.negotiate);
  },

  channelCounts(req, res) {
    var result = {};
    Channel.count({}).exec(function countCB(error, total) {
      result.total = total;

      Channel.count({type: 'USER'}).exec(function countCB(error, users) {
        result.users = users;

        Channel.count({type: 'SPOT'}).exec(function countCB(error, spots) {
          result.spots = spots;

          Channel.count({type: 'COMMUNITY'}).exec(function countCB(error, communities) {
            result.communities = communities;

            Channel.count({type: 'COMPLEX'}).exec(function countCB(error, complexes) {
              result.complexes = complexes;

              Channel.count({type: 'INFO_CENTER'}).exec(function countCB(error, centers) {
                result.centers = centers;

                Channel.count({type: 'KEYWORD_COMMUNITY'}).exec(function countCB(error, keywords) {
                  result.keywords = keywords;

                  Channel.count({type: 'POST'}).exec(function countCB(error, posts) {
                    result.posts = posts;
                    res.ok(result);
                  });
                });
              });
            });
          });
        });
      });
    });
  }
}

import _ from 'lodash';

import pusher from 'sails-service-pusher';
import config from '../../config/services/pusher';

export default {
  android: pusher('android', config.services.pusher.android),
  ios: pusher('ios', config.services.pusher.ios),

  channelCreated (pusher, channelRecord, postRecord) {
    Channel
      .find({
        link: channelRecord.id,
        type: 'USER'
      })
      .populate('owner')
      .then(channels => {
        let tokens = channelRecord.owner.gcmTokens;

        let usersToken = _.pluck(channels, 'owner.gcmTokens');
        _.forEach(usersToken, (userToken) => {
          tokens = tokens.concat(userToken)
        })

        pusher
          .send(tokens,{
            payload: {
              id: channelRecord.id,
              type: channelRecord.type,
              title: channelRecord.type + ':'+ (channelRecord.name? channelRecord.name : '이름없음'),
              text: '@' + postRecord.owner.name + ' ' + postRecord.name,
            }
          });
      })
  }
}

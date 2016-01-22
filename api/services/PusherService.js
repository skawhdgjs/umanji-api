import _ from 'lodash';

import pusher from 'sails-service-pusher';
import config from '../../config/services/pusher';


export default {
  android: pusher('android', config.services.pusher.android),
  ios: pusher('ios', config.services.pusher.ios),

  channelCreated (req, channelRecord, postRecord) {
    Channel
      .find({
        link: channelRecord.id,
        type: 'MEMBER'
      })
      .populate('owner')
      .then(memberChannels => {
        console.log('memberChannels count: ', memberChannels.length);
        let tokens = getGcmTokensFromChannel(channelRecord, memberChannels);
        tokens = removeMyTokenFrom(tokens, req.user.gcmTokens);
        console.log('tokens: ', tokens);

        this.android
          .send(tokens,{
            payload: {
              id: channelRecord.id,
              type: channelRecord.type,
              level: channelRecord.level,
              title: channelRecord.type + ':'+ (channelRecord.name? channelRecord.name : '이름없음'),
              text: '@' + postRecord.owner.name + ' ' + postRecord.name,
            }
          });
      })
  }
}


let getGcmTokensFromChannel = (channelRecord, memberChannels) => {
  let tokens = channelRecord.owner.gcmTokens? channelRecord.owner.gcmTokens: [];
  let usersToken = _.pluck(memberChannels, 'owner.gcmTokens');
  if(usersToken.length > 0) {
    _.forEach(usersToken, (userToken) => {
      tokens = tokens.concat(userToken)
    })
  }
  tokens = _.uniq(tokens);
  return tokens;
}


let removeMyTokenFrom = (tokens, myTokens) => {
  _.forEach(myTokens, (userToken) => {
    _.pull(tokens, userToken);
  });
  return tokens;
}

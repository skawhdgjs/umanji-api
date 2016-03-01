import _ from 'lodash';

import pusher from 'sails-service-pusher';
import config from '../../config/services/pusher';
import policy from '../../config/services/policy';

export default {
  android: pusher('android', config.services.pusher.android),
  ios: pusher('ios', config.services.pusher.ios),

  channelCreated (req, channelRecord, subChannel) {
    let query = {};
    if(channelRecord.type == 'INFO_CENTER') {
      switch(channelRecord.level) {
        case policy.level.DONG:
          query.thoroughfare = channelRecord.thoroughfare;
        case policy.level.GUGUN:
          query.locality = channelRecord.locality;
        case policy.level.DOSI:
          query.adminArea = channelRecord.adminArea;
        case policy.level.COUNTRY:
          query.countryCode = channelRecord.countryCode;
          break;
      }
      query.type = 'USER';
    } else {
      query = {
        parent: channelRecord.id,
        type: 'MEMBER'
      }
    }

    Channel
      .find(query)
      .populate('owner')
      .then(memberChannels => {
        console.log('memberChannels.length : ', memberChannels.length);
        
        let tokens = getGcmTokensFromChannel(channelRecord, memberChannels);
        if(req.user) {
          tokens = removeMyTokenFrom(tokens, req.user.gcmTokens);
        }

        this.android
          .send(tokens,{
            payload: {
              id: channelRecord.id,
              type: channelRecord.type,
              level: channelRecord.level,
              title: channelRecord.type + ':'+ (channelRecord.name? channelRecord.name : '이름없음'),
              text: '@' + subChannel.owner.name + ' ' + subChannel.name,
            }
          });

        saveNoty(req, channelRecord, subChannel, memberChannels);
      })
  }
}


let getGcmTokensFromChannel = (channelRecord, memberChannels) => {
  let tokens = [];

  if(channelRecord.owner) {
    tokens = channelRecord.owner.gcmTokens? channelRecord.owner.gcmTokens: [];
  }

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

let saveNoty = (req, channelRecord, subChannel, memberChannels) => {
  let recievers = [];
  if(channelRecord.owner != null && req.user.id != channelRecord.owner.id) {
    recievers = [channelRecord.owner.id];
  }

  let memberIds = _.pluck(memberChannels, 'owner.id');
  recievers = recievers.concat(memberIds);
  recievers = _.uniq(recievers);

  _.pull(recievers, req.user.id);
  _.forEach(recievers, (receiverId) => {

    let noty = {
      from: req.user.id,
      to: receiverId,
      channel: subChannel.id,
      parent: channelRecord.id
    }

    Noty
      .create(noty)
      .catch(console.log.bind(console));
  })
}

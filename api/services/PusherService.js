import _ from 'lodash';

import pusher from 'sails-service-pusher';
import config from '../../config/services/pusher';


export default {
  android: pusher('android', config.services.pusher.android),
  ios: pusher('ios', config.services.pusher.ios),

  channelCreated (req, channelRecord, subChannel) {
    Channel
      .find({
        parent: channelRecord.id,
        type: 'MEMBER'
      })
      .populate('owner')
      .then(memberChannels => {
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

let saveNoty = (req, channelRecord, subChannel, memberChannels) => {
  let recievers = [];
  if(req.user.id != channelRecord.owner.id) {
    recievers = [channelRecord.owner.id];
  }

  let memberIds = _.pluck(memberChannels, 'owner.id');

  console.log('memberIds', memberIds);

  recievers = recievers.concat(memberIds);
  recievers = _.uniq(recievers);

  console.log('recievers', recievers);
  console.log('recievers length', recievers.length);
  _.forEach(recievers, (receiver) => {

    let noty = {
      from: req.user.id,
      to: receiver.id,
      channel: subChannel.id,
    }

    Noty
      .create(noty)
      .catch(console.log.bind(console));
  })
}

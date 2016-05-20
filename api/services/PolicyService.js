import _ from 'lodash';

export default {

  /*************************************************/
  point(channel) {
    console.log('PolicyService:channel.type:' + channel.type);
    console.log('PolicyService:channel.action:' + channel.action);

    if(!channel.type || !channel.action) return;
    const actionName = channel.action;

    console.log('PolicyService:actionName:' + actionName);
    switch (actionName) {
      case 'CREATE':
        break;
      case 'DELETE':
        break;
      case 'LINK':
        break;
      case 'VOTE':
        break;
      case 'LIKE':
        break;
      case 'JOIN':
        break;
      case 'UN_LIKE':
        break;
      case 'UN_JOIN':
        break;

      default:
        break;

    }
  },


  /*************************************************/
  event(channel) {
  },
}

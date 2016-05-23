import _ from 'lodash';

export default {

  /*************************************************/
  point(channel) {

    if(!channel.type || !channel.action) return;
    const actionName = channel.action;

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

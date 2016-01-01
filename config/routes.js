/**
 * Route Mappings
 *
 * Your routes map URLs to views and controllers
 */

export default {
  routes: {
    'POST /v1/signup'             : 'AuthController.signup',
    'POST /v1/signin'             : 'AuthController.signin',

    'POST /v1/channels/spot'      : 'ChannelController.createSpot',
    'POST /v1/channels/:id'       : 'ChannelController.create',

    'GET /v1/channels'            : 'ChannelController.find',
    'GET /v1/channels/point'      : 'ChannelController.getByPoint',
    'GET /v1/channels/links'      : 'ChannelController.getLevelLinks',
    'GET /v1/channels/:id/links'  : 'ChannelController.getLinks',

    'GET /v1/users/:id/links'     : 'UserController.getLinks',
  }
}

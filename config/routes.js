/**
 * Route Mappings
 *
 * Your routes map URLs to views and controllers
 */

export default {
  routes: {
    'POST /v1/signup'                 : 'AuthController.signup',
    'POST /v1/signin'                 : 'AuthController.signin',

    'POST /v1/photo'                  : 'PhotoController.photo',
    'GET /v1/photo/id'                : 'PhotoController.get',

    'POST /v1/channels/spot'          : 'ChannelController.createSpot',

    'GET /v1/channels'                : 'ChannelController.find',
    'GET /v1/channels/id'             : 'ChannelController.get',
    'GET /v1/channels/markers'        : 'ChannelController.findMarkers',
    'GET /v1/channels/posts'          : 'ChannelController.findPosts',

    'GET /v1/channels/point'          : 'ChannelController.getByPoint',


    'GET /v1/channels/links'          : 'ChannelController.getLevelLinks',
    'GET /v1/channels/id/links'       : 'ChannelController.getLinks',
    'GET /v1/channels/id/posts'       : 'ChannelController.getLinks',
    'GET /v1/channels/id/members'     : 'ChannelController.getLinks',
    'GET /v1/channels/id/communities' : 'ChannelController.getLinks',

    'POST /v1/channels/id/link'       : 'ChannelController.create',
    'POST /v1/channels/id/post'       : 'ChannelController.create',
    'POST /v1/channels/id/member'     : 'ChannelController.create',
    'POST /v1/channels/id/community'  : 'ChannelController.create',

    'GET /v1/users/id/links'          : 'UserController.getLinks',
  }
}

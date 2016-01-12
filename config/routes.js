/**
 * Route Mappings
 *
 * Your routes map URLs to views and controllers
 */

export default {
  routes: {
    'POST /v1/token/check'            : 'AuthController.checkToken',

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
    'GET /v1/channels/id/spots'       : 'ChannelController.getLinks',
    'GET /v1/channels/id/members'     : 'ChannelController.getLinks',
    'GET /v1/channels/id/communities' : 'ChannelController.getLinks',
    'GET /v1/channels/id/keywords'    : 'ChannelController.getLinks',

    'POST /v1/channels/id/link'       : 'ChannelController.createLink',
    'POST /v1/channels/id/community'  : 'ChannelController.createCommunity',

    'POST /v1/channels/id/join'       : 'ChannelController.join',

    'GET /v1/users/id'                : 'UserController.get',
    'GET /v1/users/id/links'          : 'UserController.getLinks',
    'GET /v1/users/id/posts'          : 'UserController.getLinks',
    'GET /v1/users/id/spots'          : 'UserController.getLinks',
    'GET /v1/users/id/communities'    : 'UserController.getLinks',
    'GET /v1/users/id/keywords'       : 'UserController.getLinks',

    'PUT /v1/users/id'                : 'UserController.update',
    'POST /v1/users/id/gcm'           : 'UserController.gcm',



    'GET /v1/migration'               : 'MigrationController.importData',

    'GET /v1/migration/to/01'         : 'MigrationController.toChannel_01',
    'GET /v1/migration/to/02'         : 'MigrationController.toChannel_02',
    'GET /v1/migration/to/03'         : 'MigrationController.toChannel_03',
  }
}

/**
 * Route Mappings
 *
 * Your routes map URLs to views and controllers
 */

export default {
  routes: {

    'PUT /v1/channels/id/gcm'         : 'ChannelController.gcm',

    'POST /v1/token/check'            : 'AuthController.checkToken',

    'POST /v1/signup'                 : 'AuthController.signup',
    'POST /v1/signin'                 : 'AuthController.signin',
    'DELETE  /v1/logout'              : 'AuthController.logout',

    'GET /v1/channels/sign/point'     : 'ChannelController.getByPoint',
    'GET /v1/channels/point'          : 'ChannelController.getByPoint',
    'GET /v1/channels/id'             : 'ChannelController.get',

    'POST /v1/channels'               : 'ChannelController.create',
    'POST /v1/channels/spot'          : 'ChannelController.create',
    'POST /v1/channels/complex'       : 'ChannelController.create',

    'POST /v1/channels/id/link'       : 'ChannelController.create',
    'POST /v1/channels/id/post'       : 'ChannelController.create',
    'POST /v1/channels/id/spot'       : 'ChannelController.create',
    'POST /v1/channels/id/member'     : 'ChannelController.create',
    'POST /v1/channels/id/community'  : 'ChannelController.create',
    'POST /v1/channels/id/keyword'    : 'ChannelController.create',

    'POST /v1/channels/id/join'       : 'ChannelController.create',
    'POST /v1/channels/id/like'       : 'ChannelController.create',

    'POST /v1/channels/id/link'       : 'ChannelController.link',

    'DELETE /v1/channels/id'          : 'ChannelController.delete',
    'DELETE /v1/channels/id/join'     : 'ChannelController.delete',
    'DELETE /v1/channels/id/like'     : 'ChannelController.delete',


    'GET /v1/channels'                : 'ChannelController.findChannels',
    'GET /v1/profile/id/posts'        : 'ChannelController.findProfilePosts',
    'GET /v1/main/markers'            : 'ChannelController.findMainMarkers',
    'GET /v1/main/posts'              : 'ChannelController.findMainPosts',

    'GET /v1/complex/id/spots'        : 'ChannelController.findComplexSpots',



    'GET /v1/channels/id/posts'       : 'ChannelController.findPosts',
    'GET /v1/channels/id/spots'       : 'ChannelController.findSpots',

    'GET /v1/channels/id/members'     : 'ChannelController.findMembers',
    'GET /v1/channels/id/likes'       : 'ChannelController.findChannels',
    'GET /v1/channels/id/communities' : 'ChannelController.findChannels',
    'GET /v1/channels/id/keywords'    : 'ChannelController.findChannels',
    'GET /v1/channels/markers'        : 'ChannelController.findChannels',
    'GET /v1/channels/posts'          : 'ChannelController.findChannels',


    'PUT /v1/channels/id'             : 'ChannelController.update',
    'PUT /v1/channels/id/profile'     : 'ChannelController.update',

    'PUT /v1/channels/id/spots'       : 'ChannelController.update',

    'GET /v1/noties'                  : 'NotyController.find',
    'GET /v1/noties/new/count'        : 'NotyController.count',
    'PUT /v1/noties/read'             : 'NotyController.read',

    // *********  /channels/id/spots


    'POST /v1/photo'                  : 'PhotoController.photo',
    'GET /v1/photo/id'                : 'PhotoController.get',





    'GET /v1/channels/links'          : 'ChannelController.getLevelLinks',
    'GET /v1/channels/id/links'       : 'ChannelController.getLinks',




    'GET /v1/users/id'                : 'UserController.get',
    'GET /v1/users/id/links'          : 'UserController.getLinks',
    'GET /v1/users/id/posts'          : 'UserController.getLinks',
    'GET /v1/users/id/spots'          : 'UserController.getLinks',
    'GET /v1/users/id/communities'    : 'UserController.getLinks',
    'GET /v1/users/id/keywords'       : 'UserController.getLinks',

    'PUT /v1/channels/id/action'      : 'ChannelController.action',




    'POST /v1/users/id/gcm'           : 'UserController.gcm',



    'GET /v1/migration'               : 'MigrationController.importData',

    'GET /v1/migration/to/01'         : 'MigrationController.toChannel_01',
    'GET /v1/migration/to/02'         : 'MigrationController.toChannel_02',
    'GET /v1/migration/to/03'         : 'MigrationController.toChannel_03',
  }
}

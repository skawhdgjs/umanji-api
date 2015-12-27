/**
 * Route Mappings
 *
 * Your routes map URLs to views and controllers
 */

export default {
  routes: {
    'POST /v1/signup' : 'AuthController.signup',
    'POST /v1/signin' : 'AuthController.signin',

    'GET /v1/spots/main' : 'SpotController.getMainChannels',
    'GET /v1/spots/:id'  : 'SpotController.get',
    'GET /v1/spot/point' : 'SpotController.getByPoint',

  }
}

/**
 * Route Mappings
 *
 * Your routes map URLs to views and controllers
 */

export default {
  routes: {
    'POST /v1/signup' : 'AuthController.signup',
    'POST /v1/signin' : 'AuthController.signin',

    'GET /v1/spot'    : 'SpotController.get'
  }
}

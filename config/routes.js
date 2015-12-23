/**
 * Route Mappings
 *
 * Your routes map URLs to views and controllers
 */

export default {
  routes: {
    'get /v1/search': 'SearchController',
    'get /v1/users' : 'UserController.list',
    'post /v1/signup' : 'AuthController.signup',
    'post /v1/signin' : 'AuthController.signin'
  }
}

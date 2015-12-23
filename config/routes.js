/**
 * Route Mappings
 *
 * Your routes map URLs to views and controllers
 */

export default {
  routes: {
    'get /v1/search': 'SearchController',
    'get /v1/users' : 'UserController.list'
  }
}

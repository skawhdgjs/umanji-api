/**
 * Policy Mappings
 *
 * Policies are simple functions which run before your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 */

export default {
  policies: {

    '*': true,
    // '*': ['isAuthenticated'],

    PostController: {
      create: ['isAuthenticated']
    },
    SpotController: {
      create: ['isAuthenticated']
    },

    create: ['isAuthenticated'],
    AuthController: {
      '*': true
    }
  }
}

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

    ChannelController: {
      join: ['isAuthenticated'],
      like: ['isAuthenticated'],
      delete:  ['isAuthenticated'],

      create: ['isAuthenticated'],
      createPost: ['isAuthenticated'],
      createSpot: ['isAuthenticated'],
      createLink: ['isAuthenticated'],
      createCommunity: ['isAuthenticated'],
      action: ['isAuthenticated'],
      home: ['isAuthenticated'],
      gcm: ['isAuthenticated'],

      findProfilePosts: ['isAuthenticated'],

    },

    AuthController: {
      '*': true,
      checkToken: ['isAuthenticated']
    },

    UserController: {
      update: ['isAuthenticated']
    },

    NotyController: {
      find: ['isAuthenticated'],
      count: ['isAuthenticated'],
      read: ['isAuthenticated'],
    }
  }
}

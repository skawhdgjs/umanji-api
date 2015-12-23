/**
 * UserController
 * @description :: Server-side logic for manage users
 */

export function list(req, res) {
  User
    .find()
    .populate('address')
    .then(res.ok)
    .catch(res.negotiate);
}

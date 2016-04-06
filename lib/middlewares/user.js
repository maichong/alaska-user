/**
 * user.js
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-04-06
 * @author Liang <liang@maichong.it>
 */

'use strict';

module.exports = function () {
  return function userMiddleware(ctx, next) {
    let userId = ctx.session.userId;
    const alaska = ctx.alaska;
    ctx.user = null;

    ctx.checkAbility = id => {
      if (!ctx.user) {
        ctx.status = 403;
        alaska.error('Access Denied', 403);
      }
      return ctx.user.hasAbility(id).then(has => {
        if (has) {
          return true;
        }
        ctx.status = 403;
        return Promise.reject(new alaska.PanicError('Access Denied', 403));
      });
    };
    if (userId) {
      let User = alaska.service('alaska-user').model('User');
      return User.findCache(userId).then(user => {
        ctx.user = user;
        return next();
      });
    }
    return next();
  };
};
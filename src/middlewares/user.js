/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-04-06
 * @author Liang <liang@maichong.it>
 */

import alaska from 'alaska';
import User from '../models/User';
import Encryption from '../lib/encryption';

module.exports = function () {
  let key = alaska.main.config('autoLogin.key');
  let secret = alaska.main.config('autoLogin.secret');
  let encryption;
  if (key && secret) {
    encryption = new Encryption(secret);
  }

  return async function userMiddleware(ctx, next) {
    if (!ctx.session) return next();
    let userId = ctx.session.userId;
    ctx.user = null;

    ctx.checkAbility = (id) => {
      if (!ctx.user) {
        ctx.status = 403;
        alaska.error('Access Denied', 403);
      }
      return ctx.user.hasAbility(id).then(has => {
        if (has) {
          return true;
        }
        ctx.status = 403;
        return Promise.reject(new alaska.NormalError('Access Denied', 403));
      });
    };
    if (userId) {
      try {
        ctx.user = await User.findCache(userId);
      } catch (e) {
        console.error(e.stack)
      }
    }

    if (!ctx.user && encryption) {
      let cookie = ctx.cookies.get(key);
      if (cookie) {
        try {
          let data = encryption.decrypt(new Buffer(cookie, 'base64')).toString();
          if (data) {
            data = data.split(':').filter(d => d);
            if (data.length >= 2) {
              let user = await User.findCache(data[0]);
              if (!user) {
                throw new Error('user not found');
              }
              if (data[1] == encryption.hash(user.password)) {
                //ok
                ctx.user = user;
                ctx.session.userId = user.id;
              } else {
                ctx.cookies.set(key)
              }
            }
          } else {
            ctx.cookies.set(key)
          }
        } catch (error) {
          console.error(error.stack);
          ctx.cookies.set(key)
        }
      }
    }
    await next();
  };
};

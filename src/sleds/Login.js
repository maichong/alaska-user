/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-28
 * @author Liang <liang@maichong.it>
 */

import alaska from 'alaska';
import service from '../';
import User from '../models/User';
import Encryption from '../lib/encryption';

const autoLogin = alaska.main.config('autoLogin');
let encryption;
if (autoLogin.key && autoLogin.secret) {
  encryption = new Encryption(autoLogin.secret);
}

/**
 * 登录
 */
export default class Login extends alaska.Sled {
  /**
   * 登录失败将抛出异常
   * @param {Object} data
   *                 data.ctx
   *                 [data.user]
   *                 data.username
   *                 data.password
   *                 [data.remember]
   * @returns {User}
   */
  async exec(data) {
    let user = data.user;
    if (!user) {
      user = await User.findOne({
        username: new RegExp('^' + alaska.util.escapeRegExp(data.username) + '$', 'i')
      });
      if (!user) {
        service.error('Incorrect username or password', 1101);
      }
    }

    //data中指定了user 并且密码为空
    //免密码登录
    if (!data.user || data.password) {
      let success = await user.auth(data.password);
      if (!success) {
        service.error('Incorrect username or password', 1101);
      }
    }

    data.ctx.session.userId = user.id;

    if (data.remember !== false && encryption) {
      let encryption = new Encryption(autoLogin.secret);
      let cookie = user.id + ':' + encryption.hash(user.password) + ':' + Date.now().toString(36);
      cookie = encryption.encrypt(cookie).toString('base64');
      data.ctx.cookies.set(autoLogin.key, cookie, autoLogin);
    }

    return user;
  }
}

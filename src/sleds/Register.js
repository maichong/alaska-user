/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-28
 * @author Liang <liang@maichong.it>
 */

import _ from 'lodash';
import alaska from 'alaska';
import service from '../';
import User from '../models/User';
import SETTINGS from 'alaska-settings';

/**
 * 用户注册
 */
export default class Register extends alaska.Sled {
  /**
   * @param {Object} data
   *                 [data.ctx]
   *                 [data.user]
   *                 data.username
   *                 data.password
   *                 ...
   * @returns {User}
   */
  async exec(data) {
    let closeRegister = await SETTINGS.get('user.closeRegister');
    if (closeRegister) {
      let closeRegisterReason = await SETTINGS.get('user.closeRegisterReason');
      service.error(closeRegisterReason || 'Register closed');
    }
    let user = data.user;
    if (!user) {
      let count = await User.count({
        username: new RegExp('^' + alaska.util.escapeRegExp(data.username) + '$', 'i')
      });
      if (count) {
        service.error('Username is exists');
      }
      if (data.email) {
        let emailCount = await User.count({
          email: new RegExp('^' + alaska.util.escapeRegExp(data.email) + '$', 'i')
        });
        if (emailCount) {
          service.error('Email is exists');
        }
      }
      user = new User(_.omit(data, 'ctx', 'user'));
    }
    await user.save();

    if (data.ctx) {
      data.ctx.session.userId = user.id;
    }
    return user;
  }
}

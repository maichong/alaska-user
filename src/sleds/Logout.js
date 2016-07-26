/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-04-13
 * @author Liang <liang@maichong.it>
 */

import alaska from 'alaska';

/**
 * 注销
 */
export default class Logout extends alaska.Sled {
  /**
   * @param {Object} data
   *                 data.ctx
   */
  async exec(data) {
    let key = alaska.main.config('autoLogin.key');
    if (key) {
      data.ctx.cookies.set(key);
    }
    delete data.ctx.session.userId;
  }
}

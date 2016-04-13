/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-04-13
 * @author Liang <liang@maichong.it>
 */

/**
 * 注销
 */
export default class Logout extends service.Sled {
  /**
   * @param {Object} data
   *                 data.ctx
   */
  async exec(data) {
    delete data.ctx.session.userId;
  }
}

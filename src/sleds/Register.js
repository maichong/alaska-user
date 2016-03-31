/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-28
 * @author Liang <liang@maichong.it>
 */

/**
 * 用户注册
 */
export default class Register extends service.Sled {
  /**
   * @param {Object} data
   *                 data.username
   *                 data.password
   *                 ...
   * @returns {User}
   */
  async exec(data) {
    const User = service.model('User');
    let user = new User(data);
    await user.save();
    return user;
  }
}

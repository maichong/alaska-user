/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-28
 * @author Liang <liang@maichong.it>
 */

const User = service.model('User');

/**
 * 用户注册
 */
export default class Register extends service.Sled {
  /**
   * @param {Object} data
   *                 [data.user]
   *                 data.username
   *                 data.password
   *                 ...
   * @returns {User}
   */
  async exec(data) {
    let user = data.user;
    if (!user) {
      user = new User(data);
    }
    await user.save();
    return user;
  }
}

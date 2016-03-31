/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-28
 * @author Liang <liang@maichong.it>
 */

/**
 * 登录
 */
export default class Login extends service.Sled {
  /**
   * 登录失败将抛出异常
   * @param {Object} data
   *                 data.ctx
   *                 data.username
   *                 data.password
   * @returns {User}
   */
  async exec(data) {
    const User = service.model('User');
    let user = await User.findOne({ username: data.username });
    if (!user) {
      service.error(service.t('Account is not exists', data.ctx.locale), 1);
    }
    let success = await user.auth(data.password);
    if (!success) {
      service.error(service.t('Password is not matched', data.ctx.locale), 2);
    }
    return user;
  }
}

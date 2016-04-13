/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-28
 * @author Liang <liang@maichong.it>
 */

const User = service.model('User');

/**
 * 登录
 */
export default class Login extends service.Sled {
  /**
   * 登录失败将抛出异常
   * @param {Object} data
   *                 data.ctx
   *                 [data.user]
   *                 data.username
   *                 data.password
   * @returns {User}
   */
  async exec(data) {
    let user = data.user;
    if (!user) {
      user = await User.findOne({ username: data.username });
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
    return user;
  }
}

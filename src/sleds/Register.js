/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-28
 * @author Liang <liang@maichong.it>
 */

'use strict';

/**
 * 用户注册
 */
export default class Register extends __service.Sled {
  async exec() {
    const User = this.model('User');
    let user = new User(this.data);
    await user.save();
    return user;
  }
}

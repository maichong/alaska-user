/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-28
 * @author Liang <liang@maichong.it>
 */

'use strict';

export default class Login extends __service.Sled {
  async exec() {
    const service = this.service;
    const User = service.model('User');
    const data = this.data;
    let user = await User.findOne({ username: data.username });
    if (!user) {
      service.error('Account not found', 1);
    }
    let success = await user.auth(data.password);
    if (!success) {
      service.error('Password is not matched', 2);
    }
    return user;
  }
}

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-28
 * @author Liang <liang@maichong.it>
 */

/**
 * 登录
 */
class Login extends service.Sled {
  /**
   * 登录失败将抛出异常
   * @param {Object} data
   *                 data.ctx
   *                 data.username
   *                 data.password
   * @returns {User}
   */
  exec(data) {
    return _asyncToGenerator(function* () {
      const User = service.model('User');
      let user = yield User.findOne({ username: data.username });
      if (!user) {
        service.error(service.t('Account is not exists', data.ctx.locale), 1);
      }
      let success = yield user.auth(data.password);
      if (!success) {
        service.error(service.t('Password is not matched', data.ctx.locale), 2);
      }
      return user;
    })();
  }
}
exports.default = Login;
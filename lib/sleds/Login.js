/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-28
 * @author Liang <liang@maichong.it>
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

class Login extends __service.Sled {
  exec() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const service = _this.service;
      const User = service.model('User');
      const data = _this.data;
      let user = yield User.findOne({ username: data.username });
      if (!user) {
        service.error('Account not found', 1);
      }
      let success = yield user.auth(data.password);
      if (!success) {
        service.error('Password is not matched', 2);
      }
      return user;
    })();
  }
}
exports.default = Login;
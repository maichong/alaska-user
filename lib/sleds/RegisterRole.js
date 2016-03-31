'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @copyright Maichong Software Ltd. 2016 http://maichong.it
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @date 2016-03-28
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @author Liang <liang@maichong.it>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

/**
 * 注册角色
 */
class RegisterRole extends service.Sled {
  /**
   * @param data
   *        data.id
   *        data.title
   *        data.sort
   *        data.abilities 角色默认权限id列表
   * @returns {Role}
   */
  exec(data) {
    return _asyncToGenerator(function* () {
      let id = data._id || data.id;
      let roles = yield service.roles();
      let role = _lodash2.default.find(roles, function (r) {
        return r._id == id;
      });
      if (role) {
        //角色已经存在
        return role;
      }
      console.log(`Register role : ${ id }`);
      const Role = service.model('Role');
      role = new Role(data);
      role._id = id;
      yield role.save();
      return role;
    })();
  }

}
exports.default = RegisterRole;
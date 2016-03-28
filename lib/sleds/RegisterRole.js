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

const _ = require('lodash');

/**
 * 注册角色
 * @param data
 *        data.abilities 角色默认权限id列表
 */
class RegisterRole extends __service.Sled {

  exec() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const service = _this.service;
      const data = _this.data;
      let id = data._id || data.id;
      let roles = yield service.roles();
      let role = _.find(roles, function (r) {
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
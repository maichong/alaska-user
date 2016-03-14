'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

var _Ability = require('./Ability');

var _Ability2 = _interopRequireDefault(_Ability);

var _Role = require('./Role');

var _Role2 = _interopRequireDefault(_Role);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-22
 * @author LuLu <LuLu@maichong.it>
 */

const service = __service;
class User extends service.Model {

  preSave() {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (!_this.createdAt) {
        _this.createdAt = new Date();
      }
    })();
  }

  /**
   * 验证密码
   * @param password
   * @returns {boolean}
   */
  auth(password) {
    return this.password === (0, _md2.default)(password);
  }

  /**
   * 判断用户是否有指定权限
   * @param id
   * @returns {boolean}
   */
  hasAbility(id) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let superUser = service.alaska.config(true, 'superUser');
      if (superUser && _this2.id === superUser) {
        return true;
      }

      //查找用户特殊权限
      if (_this2.abilities) {
        for (let aid of _this2.abilities) {
          //如果abilities属性中储存的是Ability对象
          if (aid._id && aid._id == id) {
            return true;
          }
          if (aid == id) {
            return true;
          }
        }
      }

      //查找用户组权限
      if (_this2.roles) {
        for (let rid of _this2.roles) {
          let role = rid;
          if (!role.hasAbility) {
            role = yield _Role2.default.getCache(rid);
          }
          if (yield role.hasAbility(id)) {
            return true;
          }
        }
      }

      return false;
    })();
  }
}
exports.default = User;
User.label = '用户';
User.title = 'username';
User.defaultColumns = 'username,email,createdAt';
User.noremove = true;
User.fields = {
  username: {
    label: '用户名',
    type: String,
    index: true,
    required: true
  },
  email: {
    label: 'Email',
    type: String,
    index: true
  },
  password: {
    label: '密码',
    type: 'password',
    default: 1,
    private: true
  },
  avatar: {
    label: '头像',
    type: 'image'
  },
  roles: {
    label: '角色',
    type: [_Role2.default],
    multi: true,
    private: true
  },
  abilities: {
    label: '权限',
    type: [_Ability2.default],
    multi: true,
    private: true
  },
  createdAt: {
    label: '注册时间',
    type: Date
  }
};
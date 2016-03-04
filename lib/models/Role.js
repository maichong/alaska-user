'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Ability = require('./Ability');

var _Ability2 = _interopRequireDefault(_Ability);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-23
 * @author LuLu <LuLu@maichong.it>
 */

const service = __service;

class Role extends service.Model {

  preSave() {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (!_this.createdAt) {
        _this.createdAt = new Date();
      }
    })();
  }

  postSave() {
    return _asyncToGenerator(function* () {
      yield service.clearCache();
    })();
  }

  postRemove() {
    return _asyncToGenerator(function* () {
      yield service.clearCache();
    })();
  }

  /**
   * 判断角色是否具有某权限
   * @param id
   * @returns {boolean}
   */
  hasAbility(id) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
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
      return false;
    })();
  }
}
exports.default = Role;
Role.label = '角色';
Role.defaultSort = '-sort';
Role.defaultColumns = '_id,title,service,sort,createdAt';
Role.fields = {
  _id: String,
  title: {
    label: '标题',
    type: String
  },
  service: {
    label: '所属模块',
    type: String
  },
  abilities: {
    label: '权限',
    type: [_Ability2.default],
    many: true
  },
  sort: {
    label: '排序',
    type: Number
  },
  createdAt: {
    label: '创建时间',
    type: Date
  }
};
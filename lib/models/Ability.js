'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-23
 * @author LuLu <LuLu@maichong.it>
 */

const service = __service;

class Ability extends service.Model {

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
}
exports.default = Ability;
Ability.label = '权限';
Ability.defaultColumns = '_id,title,service,createdAt';
Ability.searchFields = 'title';
Ability.fields = {
  _id: String,
  title: {
    label: '标题',
    type: String
  },
  service: {
    label: '所属模块',
    type: String
  },
  createdAt: {
    label: '创建时间',
    type: Date
  }
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-01-28
 * @author Liang <liang@maichong.it>
 */

const service = __service;

class User extends service.Model {

  constructor(doc) {
    super(doc);
  }

  preSave() {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (!_this.createdAt) {
        _this.createdAt = new Date();
      }
    })();
  }
}
exports.default = User;
User.fields = {
  email: {
    label: 'EMail',
    type: String,
    index: true,
    sort: 1
  },
  username: {
    label: '用户名',
    type: Number,
    sort: 2,
    default: 1
  },
  createdAt: {
    label: '注册时间',
    type: Date
  }
};
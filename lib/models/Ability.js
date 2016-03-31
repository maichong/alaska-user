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
Ability.label = 'Ability';
Ability.defaultColumns = '_id,title,service,createdAt';
Ability.searchFields = 'title';
Ability.fields = {
  _id: String,
  title: {
    label: 'Title',
    type: String
  },
  service: {
    label: 'Service',
    type: String
  },
  createdAt: {
    label: 'Created At',
    type: Date
  }
};
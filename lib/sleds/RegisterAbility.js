/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-28
 * @author Liang <liang@maichong.it>
 */

'use strict';

/**
 * 注册权限
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

class RegisterAbility extends __service.Sled {

  exec() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const Ability = _this.model('Ability');
      const data = _this.data;

      let id = data._id || data.id;
      let ability = yield Ability.findCache(id);
      if (ability) {
        //权限已经存在
        return ability;
      }

      console.log(`Register ability : ${ id }`);
      ability = new Ability(data);
      ability._id = id;
      yield ability.save();
      return ability;
    })();
  }

}
exports.default = RegisterAbility;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _alaska = require('alaska');

var _alaska2 = _interopRequireDefault(_alaska);

var _collie = require('collie');

var _collie2 = _interopRequireDefault(_collie);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @copyright Maichong Software Ltd. 2016 http://maichong.it
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @date 2016-01-28
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @author Liang <liang@maichong.it>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

/**
 * @class UserService
 * @event UserService#create-user
 */
class UserService extends _alaska2.default.Service {
  constructor(options, alaska) {
    options = options || {};
    options.id = 'alaska-user';
    options.dir = __dirname;
    super(options, alaska);
    (0, _collie2.default)(this, 'create');
    (0, _collie2.default)(this, 'login');
  }

  postInit() {
    let service = this;
    let alaska = this.alaska;
    //在App载入session中间件后/载入其他中间件之前
    alaska.main.pre('loadAppMiddlewares', function () {
      //用户信息中间件
      alaska.app.use((() => {
        var ref = _asyncToGenerator(function* (ctx, next) {
          let userId = ctx.session.userId;
          if (userId) {
            let Model = service.model('User');
            ctx.user = yield Model.findCache(userId);
          }
          ctx.checkAbility = (() => {
            var ref = _asyncToGenerator(function* (id) {
              if (ctx.user && (yield ctx.user.hasAbility(id))) {
                return true;
              }
              ctx.status = 403;
              alaska.error('Access Denied', 403);
            });

            return function (_x3) {
              return ref.apply(this, arguments);
            };
          })();
          yield next();
        });

        return function (_x, _x2) {
          return ref.apply(this, arguments);
        };
      })());
    });
  }

  /**
   * [async] 新建用户
   * @param data
   */
  create(data) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let User = _this.model('User');
      let user = new User(data);
      yield user.save();
    })();
  }

  /**
   * [async] 登录,若登录失败,则抛出异常
   * @param ctx koa请求上下文
   * @param username 用户名
   * @param password 密码
   * @returns {User}
   */
  login(ctx, username, password) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let User = _this2.model('User');
      let user = yield User.findOne({ username });
      if (!user) {
        _alaska2.default.error('Account not found', 1);
      }
      let success = yield user.auth(password);
      if (!success) {
        _alaska2.default.error('Password is not matched', 2);
      }

      ctx.session.userId = user.id;
      return user;
    })();
  }

  /**
   * [async] 注销登录
   * @param ctx
   */
  logout(ctx) {
    return _asyncToGenerator(function* () {
      delete ctx.session.userId;
    })();
  }

  /**
   * [async] 获取所有权限列表
   * @returns {Ability[]}
   */
  abilities() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      let Ability = _this3.model('Ability');
      let cache = _this3.cache;
      let data = yield cache.get('abilities_list');
      if (data) {
        return Ability.castCacheArray(data);
      }
      data = yield Ability.find().sort('-sort');
      if (data.length) {
        //缓存10分钟
        yield cache.set('abilities_list', Ability.castModelArray(data), 600);
      }
      return data;
    })();
  }

  /**
   * [async] 获取角色列表
   * @returns {Role[]}
   */
  roles() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      let Role = _this4.model('Role');
      let cache = _this4.cache;
      let data = yield cache.get('roles_list');
      if (data) {
        return Role.castCacheArray(data);
      }
      data = yield Role.find().sort('-sort');
      if (data.length) {
        //缓存10分钟
        yield cache.set('abilities_list', Role.castModelArray(data), 600);
      }
      return data;
    })();
  }

  /**
   * [async] 注册权限,如果已经存在则返回false
   * @param data
   * @returns {boolean|Ability}
   */
  registerAbility(data) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      let id = data._id || data.id;
      let Ability = _this5.model('Ability');
      let ability = yield Ability.findCache(id);
      if (ability) {
        //权限已经存在
        return false;
      }
      console.log(`Register ability : ${ id }`);
      ability = new Ability(data);
      ability._id = id;
      yield ability.save();
      return ability;
    })();
  }

  /**
   * [async] 注册角色,如果已经存在则返回false
   * @param data
   *        data.abilities 角色默认权限id列表
   * @returns {boolean|Role}
   */
  registerRole(data) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      let id = data._id || data.id;
      let roles = yield _this6.roles();
      if (_.find(roles, function (role) {
        return role._id == id;
      })) {
        //角色已经存在
        return false;
      }
      console.log(`Register role : ${ id }`);
      let Role = _this6.model('Role');
      let abilities = [];
      let abilitiesMap = {};
      let allAbilities = yield _this6.abilities();
      allAbilities.forEach(function (a) {
        abilitiesMap[a._id] = a._id;
      });
      if (data.abilities) {
        for (let abilityId of data.abilities) {
          if (!abilitiesMap[abilityId]) {
            throw new Error(`Ability ${ abilityId } not found when register role ${ data.id }`);
          }
          abilities.push(abilityId);
        }
      }
      data.abilities = abilities;
      let role = new Role(data);
      role._id = id;
      yield role.save();
      return role;
    })();
  }

  /**
   * [async] 清空本模块缓存
   */
  clearCache() {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      let cache = _this7.cache;
      yield cache.del('abilities_list');
      yield cache.del('roles_list');
    })();
  }

}
exports.default = UserService;
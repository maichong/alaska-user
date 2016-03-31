'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _alaska = require('alaska');

var _alaska2 = _interopRequireDefault(_alaska);

var _collie = require('collie');

var _collie2 = _interopRequireDefault(_collie);

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
    (0, _collie2.default)(this, 'login');
    (0, _collie2.default)(this, 'logout');
  }

  postInit() {
    let service = this;
    let alaska = this.alaska;
    //在App载入session中间件后/载入其他中间件之前
    alaska.main.pre('loadAppMiddlewares', () => {
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
   * [async] 注册
   * @param {Object} data
   * @returns {User}
   */
  register(data) {
    return this.run('Register', data);
  }

  /**
   * [async] 登录,若登录失败,则抛出异常
   * @param ctx koa请求上下文
   * @param username 用户名
   * @param password 密码
   * @returns {User}
   */
  login(ctx, username, password) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let user = yield _this.run('Login', { ctx, username, password });
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
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let Ability = _this2.model('Ability');
      let cache = _this2.cache;
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
    var _this3 = this;

    return _asyncToGenerator(function* () {
      let Role = _this3.model('Role');
      let cache = _this3.cache;
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
   * [async] 清空本模块缓存
   */
  clearCache() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      let cache = _this4.cache;
      yield cache.del('abilities_list');
      yield cache.del('roles_list');
    })();
  }

}
exports.default = UserService;
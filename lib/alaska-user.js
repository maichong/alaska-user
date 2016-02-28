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
    (0, _collie2.default)(this, 'create');
    (0, _collie2.default)(this, 'login');
  }

  postInit() {
    let service = this;
    let alaska = this.alaska;
    //在App载入session中间件后/载入其他中间件之前
    alaska.mainService().pre('loadAppMiddlewares', function () {
      let app = alaska.app();
      //用户信息中间件
      app.use(function () {
        var ref = _asyncToGenerator(function* (ctx, next) {
          let userId = ctx.session.userId;
          if (userId) {
            let Model = service.model('User');
            ctx.user = yield Model.getCache(userId);
          }
          yield next();
        });

        return function (_x, _x2) {
          return ref.apply(this, arguments);
        };
      }());
    });
  }

  /**
   * 新建用户
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
   * 登录,若登录失败,则抛出异常
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
        _alaska2.default.panic('Account not found', 1);
      }
      if (!user.auth(password)) {
        _alaska2.default.panic('Account not found', 2);
      }

      ctx.session.userId = user.id;
      return user;
    })();
  }

  logout(ctx) {
    return _asyncToGenerator(function* () {
      delete ctx.session.userId;
    })();
  }
}
exports.default = UserService;
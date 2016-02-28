/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-01-28
 * @author Liang <liang@maichong.it>
 */

import alaska from 'alaska';
import collie from 'collie';

/**
 * @class UserService
 * @event UserService#create-user
 */
export default class UserService extends alaska.Service {
  constructor(options, alaska) {
    options = options || {};
    options.id = 'alaska-user';
    options.dir = __dirname;
    super(options, alaska);
    collie(this, 'create');
    collie(this, 'login');
  }

  postInit() {
    let service = this;
    let alaska = this.alaska;
    //在App载入session中间件后/载入其他中间件之前
    alaska.mainService().pre('loadAppMiddlewares', function () {
      let app = alaska.app();
      //用户信息中间件
      app.use(async function (ctx, next) {
        let userId = ctx.session.userId;
        if (userId) {
          let Model = service.model('User');
          ctx.user = await Model.getCache(userId);
        }
        await next();
      });
    });
  }

  /**
   * 新建用户
   * @param data
   */
  async create(data) {
    let User = this.model('User');
    let user = new User(data);
    await user.save();
  }

  /**
   * 登录,若登录失败,则抛出异常
   * @param ctx koa请求上下文
   * @param username 用户名
   * @param password 密码
   * @returns {User}
   */
  async login(ctx, username, password) {
    let User = this.model('User');
    let user = await User.findOne({ username });
    if (!user) {
      alaska.panic('Account not found', 1);
    }
    if (!user.auth(password)) {
      alaska.panic('Account not found', 2);
    }

    ctx.session.userId = user.id;
    return user;
  }

  async logout(ctx) {
    delete ctx.session.userId;
  }
}


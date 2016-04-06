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
    collie(this, 'login');
    collie(this, 'logout');
  }

  postInit() {
    const MAIN = this.alaska.main;
    MAIN.applyConfig({
      '+appMiddlewares': [{
        id: 'alaska-session',
        sort: 800,
        options: MAIN.config('session')
      }, {
        id: __dirname + '/middlewares/user.js',
        sort: 700
      }]
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
  async login(ctx, username, password) {
    let user = await this.run('Login', { ctx, username, password });
    ctx.session.userId = user.id;
    return user;
  }

  /**
   * [async] 注销登录
   * @param ctx
   */
  async logout(ctx) {
    delete ctx.session.userId;
  }

  /**
   * [async] 获取所有权限列表
   * @returns {Ability[]}
   */
  async abilities() {
    let Ability = this.model('Ability');
    let cache = this.cache;
    let data = await cache.get('abilities_list');
    if (data) {
      return Ability.castCacheArray(data);
    }
    data = await Ability.find().sort('-sort');
    if (data.length) {
      //缓存10分钟
      await cache.set('abilities_list', Ability.castModelArray(data), 600);
    }
    return data;
  }

  /**
   * [async] 获取角色列表
   * @returns {Role[]}
   */
  async roles() {
    let Role = this.model('Role');
    let cache = this.cache;
    let data = await cache.get('roles_list');
    if (data) {
      return Role.castCacheArray(data);
    }
    data = await Role.find().sort('-sort');
    if (data.length) {
      //缓存10分钟
      await cache.set('abilities_list', Role.castModelArray(data), 600);
    }
    return data;
  }

  /**
   * [async] 清空本模块缓存
   */
  async clearCache() {
    let cache = this.cache;
    await cache.del('abilities_list');
    await cache.del('roles_list');
  }

}


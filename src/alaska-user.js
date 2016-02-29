/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-01-28
 * @author Liang <liang@maichong.it>
 */

import alaska from 'alaska';
import collie from 'collie';
import * as _ from 'lodash';

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
      alaska.error('Account not found', 1);
    }
    if (!user.auth(password)) {
      alaska.error('Account not found', 2);
    }

    ctx.session.userId = user.id;
    return user;
  }

  /**
   * 注销登录
   * @param ctx
   */
  async logout(ctx) {
    delete ctx.session.userId;
  }

  /**
   * 获取所有能力列表
   * @returns {Ability[]}
   */
  async getAbilities() {
    let Ability = this.model('Ability');
    let cache = this.cache();
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
   * 获取角色列表
   * @returns {Role[]}
   */
  async getRoles() {
    let Role = this.model('Role');
    let cache = this.cache();
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
   * 注册能力,如果已经存在则返回false
   * @param data
   * @returns {boolean|Ability}
   */
  async registerAbility(data) {
    let abilities = await this.getAbilities();
    if (_.find(abilities, ability => ability.name == data.name)) {
      //权限已经存在
      return false;
    }
    console.log(`Register ability : ${data.name}`);
    let Ability = this.model('Ability');
    let ability = new Ability(data);
    await ability.save();
    return ability;
  }

  /**
   * 注册角色,如果已经存在则返回false
   * @param data
   *        data.abilities 角色默认能力名称列表,不是id列表
   * @returns {boolean|Role}
   */
  async registerRole(data) {
    let roles = await this.getRoles();
    if (_.find(roles, role => role.name == data.name)) {
      //角色已经存在
      return false;
    }
    console.log(`Register role : ${data.name}`);
    let Role = this.model('Role');
    let abilities = [];
    let abilitiesMap = {};
    let allAbilities = await this.getAbilities();
    allAbilities.forEach(a => {
      abilitiesMap[a.name] = a._id;
    });
    if (data.abilities) {
      for (let abilityName of data.abilities) {
        if (!abilitiesMap[abilityName]) {
          throw new Error(`Ability ${abilityName} not found when register role ${data.name}`);
        }
        abilities.push(abilitiesMap[abilityName]);
      }
    }
    data.abilities = abilities;
    let role = new Role(data);
    await role.save();
    return role;
  }

  /**
   * 依据名称获取指定权限
   * @param name
   * @returns {Ability}
   */
  async getAbilityByName(name) {
    let abilities = await this.getAbilities();
    return _.find(abilities, ability => ability.name === name);
  }

  /**
   * 依据名称获取指定角色
   * @param name
   * @returns {Role}
   */
  async getRoleByName(name) {
    let roles = await this.getRoles();
    return _.find(roles, role => role.name === name);
  }

  /**
   * 清空本模块缓存
   */
  async clearCache() {
    await this.cache().del('abilities_list');
    await this.cache().del('roles_list');
  }

}


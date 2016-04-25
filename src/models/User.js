/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-22
 * @author LuLu <LuLu@maichong.it>
 */

import Ability from './Ability';
import Role from './Role';

export default class User extends service.Model {

  static label = 'User';
  static title = 'username';
  static defaultColumns = 'avatar username email roles createdAt';
  static searchFields = 'username email';
  static defaultSort = '-createdAt';
  static noremove = true;

  static scopes = {
    tiny: 'displayName avatar _username',
    info: '*'
  };

  static fields = {
    username: {
      label: 'Username',
      type: String,
      index: {
        unique: true
      },
      required: true
    },
    email: {
      label: 'Email',
      type: String,
      index: true
    },
    password: {
      label: 'Password',
      type: 'password',
      default: 1,
      private: true
    },
    avatar: {
      label: 'Avatar',
      type: 'image'
    },
    roles: {
      label: 'Roles',
      type: [Role],
      multi: true,
      private: true
    },
    abilities: {
      label: 'Abilities',
      type: [Ability],
      multi: true,
      private: true
    },
    createdAt: {
      label: 'Registered At',
      type: Date
    }
  };

  static virtuals = {
    get displayName() {
      return this.username;
    }
  };

  async preSave() {
    if (!this.createdAt) {
      this.createdAt = new Date;
    }
  }

  /**
   * [async] 验证密码
   * @param candidate 待检测密码
   * @returns {boolean}
   */
  auth(candidate) {
    return this._.password.compare(candidate);
  }

  /**
   * [async] 判断用户是否有指定权限
   * @param id
   * @returns {boolean}
   */
  async hasAbility(id) {
    let superUser = service.alaska.config(true, 'superUser');
    if (superUser && this.id === superUser) {
      return true;
    }

    //查找用户特殊权限
    if (this.abilities) {
      for (let aid of this.abilities) {
        //如果abilities属性中储存的是Ability对象
        if (aid._id && aid._id == id) {
          return true;
        }
        if (aid == id) {
          return true;
        }
      }
    }

    //查找用户组权限
    if (this.roles) {
      for (let rid of this.roles) {
        let role = rid;
        if (!role.hasAbility) {
          role = await Role.findCache(rid);
        }
        if (await role.hasAbility(id)) {
          return true;
        }
      }
    }

    return false;
  }
}

/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-22
 * @author LuLu <LuLu@maichong.it>
 */

const service = __service;
import _ from 'lodash';
import md5 from 'md5';

import Ability from './Ability';
import Role from './Role';

export default class User extends service.Model {

  static fields = {
    username: {
      label: '用户名',
      type: String,
      sort: 2,
      index: true,
      default: 1
    },
    email: {
      label: 'Email',
      type: String,
      index: true,
      sort: 1
    },
    password: {
      label: '密码',
      type: 'password',
      sort: 2,
      default: 1,
      private: true
    },
    roles: {
      label: '角色',
      type: [Role],
      many: true,
      private: true
    },
    abilities: {
      label: '能力',
      type: [Ability],
      many: true,
      private: true
    },
    createdAt: {
      label: '注册时间',
      type: Date
    }
  };

  async preSave() {
    if (!this.createdAt) {
      this.createdAt = new Date;
    }
  }

  /**
   * 验证密码
   * @param password
   * @returns {boolean}
   */
  auth(password) {
    return this.password === md5(password);
  }

  /**
   * 判断用户是否有指定权限
   * @param id
   * @returns {boolean}
   */
  async hasAbility(id) {
    let superUser = service.config('superUser');
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
          role = await Role.getCache(rid);
        }
        if (await role.hasAbility(id)) {
          return true;
        }
      }
    }

    return false;
  }
}

/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-23
 * @author LuLu <LuLu@maichong.it>
 */

const service = __service;

import Ability from './Ability';

export default class Role extends service.Model {

  static defaultSort = '-sort';

  static fields = {
    _id: String,
    service: {
      label: '所属模块',
      type: String
    },
    desc: {
      label: '角色描述',
      type: String
    },
    abilities: {
      label: '权限',
      type: [Ability],
      many: true
    },
    sort: {
      label: '排序',
      type: Number
    },
    createdAt: {
      label: '创建时间',
      type: Date
    }
  };

  async preSave() {
    if (!this.createdAt) {
      this.createdAt = new Date;
    }
  }

  async postSave() {
    await service.clearCache();
  }

  async postRemove() {
    await service.clearCache();
  }

  /**
   * 判断角色是否具有某权限
   * @param name
   * @returns {boolean}
   */
  async hasAbility(name) {
    if (this.abilities) {
      for (let aid of this.abilities) {
        //如果abilities属性中储存的是Ability对象
        if (aid.name && aid.name == name) {
          return true;
        }
        let ability = await Ability.getCache(aid);
        if (ability && ability.name == name) {
          return true;
        }
      }
    }
    return false;
  }
}
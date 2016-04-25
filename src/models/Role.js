/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-23
 * @author LuLu <LuLu@maichong.it>
 */

import Ability from './Ability';

export default class Role extends service.Model {

  static label = 'Role';

  static defaultSort = '-sort';

  static defaultColumns = '_id title sort createdAt';

  static searchFields = 'title';

  static fields = {
    _id: {
      type: String,
      required: true
    },
    title: {
      label: 'Title',
      type: String
    },
    abilities: {
      label: 'Abilities',
      type: [Ability],
      multi: true
    },
    sort: {
      label: 'Sort',
      type: Number
    },
    createdAt: {
      label: 'Created At',
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
   * @param id
   * @returns {boolean}
   */
  async hasAbility(id) {
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
    return false;
  }
}

/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-23
 * @author LuLu <LuLu@maichong.it>
 */

const service = __service;

export default class Ability extends service.Model {
  static fields = {
    name: {
      label: '权限',
      type: String,
      index: true,
      required: true
    },
    service: {
      label: '所属模块',
      type: String
    },
    desc: {
      label: '描述',
      type: String
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
}

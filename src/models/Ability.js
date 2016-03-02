/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-23
 * @author LuLu <LuLu@maichong.it>
 */

const service = __service;

export default class Ability extends service.Model {

  static fields = {
    _id: String,
    service: {
      label: '所属模块',
      type: String
    },
    desc: {
      label: '描述',
      type: String
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

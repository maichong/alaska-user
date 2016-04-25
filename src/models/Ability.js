/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-23
 * @author LuLu <LuLu@maichong.it>
 */

export default class Ability extends service.Model {

  static label = 'Ability';

  static defaultColumns = '_id title service createdAt';

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
    service: {
      label: 'Service',
      type: String
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
}

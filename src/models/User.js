/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-01-28
 * @author Liang <liang@maichong.it>
 */

const service = __service;

export default class User extends service.Model {

  static fields = {
    email: {
      label: 'EMail',
      type: String,
      index: true,
      sort: 1
    },
    username: {
      label: '用户名',
      type: Number,
      sort: 2,
      default: 1
    },
    createdAt: {
      label: '注册时间',
      type: Date
    }
  };

  constructor(doc) {
    super(doc);
  }

  async preSave() {
    if (!this.createdAt) {
      this.createdAt = new Date;
    }
  }
}

/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-28
 * @author Liang <liang@maichong.it>
 */

'use strict';

const _ = require('lodash');

/**
 * 注册角色
 * @param data
 *        data.abilities 角色默认权限id列表
 */
export default class RegisterRole extends __service.Sled {

  async exec() {
    const service = this.service;
    const data = this.data;
    let id = data._id || data.id;
    let roles = await service.roles();
    let role = _.find(roles, r => r._id == id)
    if (role) {
      //角色已经存在
      return role;
    }
    console.log(`Register role : ${id}`);
    const Role = service.model('Role');
    role = new Role(data);
    role._id = id;
    await role.save();
    return role;
  }

}

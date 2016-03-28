/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-28
 * @author Liang <liang@maichong.it>
 */

'use strict';

/**
 * 注册权限
 */
export default class RegisterAbility extends __service.Sled {

  async exec() {
    const Ability = this.model('Ability');
    const data = this.data;

    let id = data._id || data.id;
    let ability = await Ability.findCache(id);
    if (ability) {
      //权限已经存在
      return ability;
    }

    console.log(`Register ability : ${id}`);
    ability = new Ability(data);
    ability._id = id;
    await ability.save();
    return ability;
  }

}

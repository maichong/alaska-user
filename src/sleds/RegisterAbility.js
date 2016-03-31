/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-03-28
 * @author Liang <liang@maichong.it>
 */

/**
 * 注册权限
 */
export default class RegisterAbility extends service.Sled {
  /**
   * @param data
   *        data.id
   *        data.title
   *        data.sort
   *        data.service
   * @returns {Ability}
   */
  async exec(data) {
    const Ability = service.model('Ability');

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

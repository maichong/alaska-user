/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-04-12
 * @author Liang <liang@maichong.it>
 */

import service from '../';

export default async function (ctx) {
  await service.run('Logout', { ctx });
  ctx.body = {};
}

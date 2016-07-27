/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-04-12
 * @author Liang <liang@maichong.it>
 */

import service from '../';

//用户信息
export default async function (ctx) {
  if (!ctx.user) {
    service.error(403);
  }
  ctx.body = ctx.user.data('info');
}

//修改密码
export async function chpass(ctx) {
  if (!ctx.user) {
    service.error(403);
  }
  if (ctx.method !== 'POST') {
    service.error(400);
  }

  let password = ctx.request.body.password;

  if (!password) {
    service.error('New password is required');
  }

  ctx.user.password = password;

  await ctx.user.save();

  ctx.body = {};
}

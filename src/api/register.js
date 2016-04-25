/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-04-12
 * @author Liang <liang@maichong.it>
 */

export default async function (ctx) {
  if (ctx.method !== 'POST') {
    service.error(400);
  }

  let username = ctx.request.body.username;
  let password = ctx.request.body.password;

  if (!username) {
    service.error('Username is required');
  }

  if (!password) {
    service.error('Password is required');
  }

  let user = await service.run('Register', { username, password, ctx });
  ctx.body = user.data('info');
}

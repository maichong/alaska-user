/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-01-28
 * @author Liang <liang@maichong.it>
 */

export default {
  prefix: '/user',
  middlewares: false,
  controllers: false,
  services: [
    { id: 'alaska-settings', alias: 'settings' }
  ]
};

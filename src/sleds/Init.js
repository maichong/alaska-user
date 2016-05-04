/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-05-04
 * @author Liang <liang@maichong.it>
 */

const SETTINGS = service.service('settings');

export default class Init extends service.Sled {
  async exec() {
    SETTINGS.register({
      id: 'user.closeRegister',
      title: 'Close Register',
      service: 'alaska-user',
      type: 'CheckboxFieldView'
    });

    SETTINGS.register({
      id: 'user.closeRegisterReason',
      title: 'Close Register Reason',
      service: 'alaska-user',
      type: 'TextFieldView'
    });
  }
}

/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-07-25
 * @author Liang <liang@maichong.it>
 */

import crypto from 'crypto';

export default function Encryption(password) {

  let encryption = {};

  let key = crypto.createHash('sha256').update(password).digest();

  let iv = key.slice(0, 16);

  encryption.encrypt = function encrypt(buf) {
    let cipher = crypto.createCipheriv('aes-256-cfb', key, iv);
    return Buffer.concat([cipher.update(buf), cipher.final()]);
  };

  encryption.decrypt = function decrypt(buf) {
    let cipher = crypto.createDecipheriv('aes-256-cfb', key, iv);
    return Buffer.concat([cipher.update(buf), cipher.final()]);
  };

  encryption.hash = function (input) {
    return crypto.createHash('sha256').update(password).digest('base64');
  };

  return encryption;
}

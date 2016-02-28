/**
 * index.js
 * @copyright Maichong Software Ltd. 2015 http://maichong.it
 * @date 2015-11-19
 * @author Liang <liang@maichong.it>
 */

'use strict';

exports.index = function(ctx) {
	ctx.body = '<h1>user home page</h1> <br/> <pre>' + JSON.stringify(ctx.toJSON(), null, ' ') + '</pre>';
};

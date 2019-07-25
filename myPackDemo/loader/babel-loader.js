const babel = require('@babel/core');
const loaderUtils = require('loader-utils');

/**
 * 简易babel-loader
 * @param  {[type]} source [源码]
 */
function loader(source) {
	// 拿到loader的options
	let options = loaderUtils.getOptions(this);
	let cb = this.async(); // 异步回调函数

	babel.transform(source, {
		...options,
		sourceMap: true,
		filename: this.resourcePath.split('/').pop()
	}, function(err, res) {
		cb(err, res.code, res.map); // 异步
	})
}

module.exports = loader;
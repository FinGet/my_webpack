const path = require('path');

class P {
	apply(compiler) {
		// compiler 指向Compiler (this)
		// 发布的时候
		compiler.hooks.emit.tap('emit', function() {
			console.log('emit');
		})
	}
}

module.exports = {
	entry: './src/index.js', 
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'main.js'
	},
	module: {
		rules: [
			{
				test: /\.less$/,
				use: [
					path.resolve(__dirname, 'loader','style-loader'),
					path.resolve(__dirname, 'loader','less-loader')
				]
			}
		]
	},
	plugins: [
		new P()
	]
}
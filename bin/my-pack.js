#! /usr/bin/env node
const path = require('path');
const Compiler = require('../lib/Compiler.js');
// 1） 需要找到当前执行命令的路径 拿到webpack.config.js

// config配置文件
const config = require(path.resolve('webpack.config.js'));
const compiler = new Compiler(config);

compiler.hooks.entryOption.call();
// 运行编译
compiler.run();
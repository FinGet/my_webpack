const fs = require('fs');
const path = require('path');
const babylon = require('babylon');
const traverse = require('@babel/traverse').default;
const types = require('@babel/types');
const generator = require('@babel/generator').default;
const ejs = require('ejs');
// babylon 主要就是把源码 转换成ast
// @babel/traverse 遍历到对应的节点，因为babylon解析的ast很长
// @babel/types 替换遍历的节点
// @babel/generator 节点生成

class Compiler {
  constructor(config) {
    this.config = config;
    // 需要保存入口文件的路径
    this.entryId;
    // 需要保存所有模块的依赖
    this.modules = {};
    // 入口路径
    this.entry = config.entry;
    // 工作路径 process.cwd() - 获得当前执行node命令时候的文件夹目录名 
    this.root = process.cwd();
  }
  /**
   * 获取文件内容
   * @param  {[type]} modulePath [文件路径]
   * @return {[type]}            [文件内容]
   */
  getSource(modulePath) {
    let rules = this.config.module.rules;
    let content = fs.readFileSync(modulePath, 'utf8');

    // 匹配规则
    for (let i = 0; i < rules.length; i++) {
       let rule = rules[i];
       let {test, use} = rule;
       let len = use.length - 1;
       if(test.test(modulePath)) {
          function normalLoader() {
            let loader = require(use[len--]);

            content = loader(content);
            if(len>=0) {
              normalLoader();
            }
          }
        normalLoader()
       }
    }

    return content;
  }
  /**
   * 解析源码
   * @param  {[type]} source     [源码]
   * @param  {[type]} parentPath [父路径]
   * @return {[type]}            [description]
   */
  parse(source, parentPath) { // AST 解析语法树
    // console.log(source, parentPath);
    
    // 1）把源码编译成ast
    let ast = babylon.parse(source);
    let dependencies = []; // 依赖数组

    // 2）编译替换
    traverse(ast, {
      CallExpression(p) {
        // console.log(p.node);
        let node = p.node; // 对应节点
        if (node.callee.name === 'require') {
          // 把'require'替换成'__webpack_require__'
          node.callee.name = '__webpack_require__';
          // 取到引用模块的名字
          let moduleName = node.arguments[0].value;

          moduleName = moduleName + (path.extname(moduleName) ? '' : '.js'); // 如果没有后缀名就补上
          moduleName = './' + path.join(parentPath, moduleName); // ./src/a.js
          
          dependencies.push(moduleName); // 存入依赖数组

          node.arguments = [types.stringLiteral(moduleName)];
        }
      }
    })

    // 3）生成新的code
    let sourceCode = generator(ast).code;

    return { sourceCode, dependencies }
  }
  /**
   * [构建模块]
   * @param  {[type]}  modulePath [模块路径]
   * @param  {Boolean} isEntry    [是否是入口]
   */
  buildModule(modulePath, isEntry) {
    // 拿到模块内容
    let source = this.getSource(modulePath);
    // 模块id modulePath = modulePath - this.root =  src/index.js
    // modulePath = /Users/finget/Desktop/mywebpack/myPackDemo/src/index.js
    // this.root = /Users/finget/Desktop/mywebpack/myPackDemo
    let moduleName = './' + path.relative(this.root, modulePath); // ./src/index.js

    // console.log(source, moduleName);
    if (isEntry) {
      this.entryId = moduleName;
    }
    // 解析需要把source源码进行改造 返回一个依赖列表
    let { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName)); // ./src
    // console.log(sourceCode, dependencies);
    /*
      let a = __webpack_require__("./src/a.js");
      console.log('demo'); [ './src/a.js' ]
     */

    this.modules[moduleName] = sourceCode;

    // 递归依赖模块的解析
    dependencies.forEach(dep => {
      this.buildModule(path.join(this.root, dep), false)
    })

  }
  /**
   * 打包文件
   * @return {[type]} [description]
   */
  emitFile() {
    // 输出到哪个目录下
    let main = path.join(this.config.output.path, this.config.output.filename);
    let templateStr = this.getSource(path.join(__dirname, 'main.ejs'));
    let code = ejs.render(templateStr, { entryId: this.entryId, modules: this.modules });

    this.assets = {}
    this.assets[main] = code;
    // console.log(main);

    // fs.writeFileSync path必须已经存在
    fs.writeFileSync(main, this.assets[main]);
  }
  run() {
    // 执行 并创建模块的依赖关系
    this.buildModule(path.resolve(this.root, this.entry), true);
    // console.log(this.modules, this.entryId);
    /**
     * 这就长得很像 webpack了
     * { './src/index.js':
       'let a = __webpack_require__("./src/a.js");\n\nconsole.log(\'demo\');',
      './src/a.js':
       'let b = __webpack_require__("./src/b.js");\n\nconsole.log(\'a.js\');',
      './src/b.js': 'console.log(\'b.js\');' } './src/index.js'
     */

    // 生成一个文件 打包后的文件
    this.emitFile();
  }
}

module.exports = Compiler;
(function(modules) { // webpackBootstrap
  // The module cache 先定义一个缓存
  var installedModules = {};
  // The require function 配置了一个require方法
  function __webpack_require__(moduleId) {

    // Check if module is in cache 检查这个模块是否在缓存中
    if (installedModules[moduleId]) {
        return installedModules[moduleId].exports;
    }
    // Create a new module (and put it into the cache) 创建一个新的模块，并存入缓存
    var module = installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {}
    };

    // Execute the module function
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    // Flag the module as loaded
    module.l = true;

    // Return the exports of the module
    return module.exports;
  }
  // Load entry module and return exports 加载入口模块
  return __webpack_require__(__webpack_require__.s = "./src/index.js");
})({
		
      "./src/index.js": (function(module, exports, __webpack_require__) {
        eval(`let a = __webpack_require__("./src/a.js");

__webpack_require__("./src/index.less");

console.log('demo');`);
      }),
    
      "./src/a.js": (function(module, exports, __webpack_require__) {
        eval(`let b = __webpack_require__("./src/b.js");

console.log('a.js');`);
      }),
    
      "./src/b.js": (function(module, exports, __webpack_require__) {
        eval(`console.log('b.js');`);
      }),
    
      "./src/index.less": (function(module, exports, __webpack_require__) {
        eval(`let style = document.createElement('style');
style.innerHTML = "body {\\n  background: red;\\n}\\n";
document.head.appendChild(style);`);
      }),
    
});
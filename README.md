**自己写一个webpack**

## 初始化

<pre>
├── bin 
│   └── my-pack.js       # my-pack 主文件    
├── lib 
│   └── Compiler.js      # 编译文件       
├── myPackDemo           # 测试demo 
│   └── src   
│   		└── index.js  
│   └── wepack.config.js    
</pre>


```javascript
// package.json
{
	"bin": {
  	"my-pack": "./bin/my-pack.js"
  }
}
```

```javascript
// bin/my-pack.js
#! /usr/bin/env node 

console.log('start');
```

```
// 在全局下生成my-pack这个命令
npm link 
```

![](http://ww4.sinaimg.cn/large/006tNc79gy1g5ayzm1mtwj30v208qdlc.jpg)

在myPackDemo中执行：`npm link my-pack` 就会在`node_modules`中下载`my-pack`。
然后执行 `npx my-pack` 就会打印`start`。


![](http://ww1.sinaimg.cn/large/006tNc79gy1g5bu65kdxfj31ie0mkhdt.jpg)

整个打包过程可以简述为：找到`入口文件` -> 找到`依赖关系` -> 构建`AST`->编译`新的code`->写入`目标文件夹和文件`



# 开发命令插件

## 安装

如果没有安装，需要先安装

```shell
npm install jyb_jfet -g
```

## 开发

新增一个入口文件`index.js`

其中`command`,`describe`,`builder`,`handler`字段对应[文档](https://github.com/yargs/yargs/blob/master/docs/advanced.md#providing-a-command-module)中相应的字段

```javascript
const command = {
  name: 'build', // 插件名称
  version: '0.1.2', // 插件版本，可以从package.json获取
  command: 'build', // 
  describe: 'build command for jfet',
  builder: {
    watch: {
      type: 'boolean',
      alias: 'w',
      describe: 'Watch file changes and rebuild',
      default: false
    }
  },
  handler: (configFunc, argv) => {
    // 设置jfet.config.js配置中的命令函数的参数
    configFunc.setParameter(context);
    // 获取用户插件配置，如果配置是Object类型，则返回该对象；如果是Function类型，则为该函数的返回值
    const cfgs = configFunc.getConfig();
    // argv为参数的值
    if (argv.watch) {
      console.log('watch mode');
    }
  }
};

module.exports = command;
```

新增配置文件`jfet.config.js`，用户插件配置支持`Object`,`Function`类型

```javascript
// Function类型
module.exports = {
  build(abc, context) {
    // 假如插件名为build，abc应该为abc.json文件中的build字段的值
    // context为configFunc.setParameter设置的值
  }
};

// Object类型
module.exports = {
  build: {}
};
```

## 调试

如果当前目录下的`package.json`中有`jfetOptions`字段，会优先使用`jfetOptions`中的设置，`jfetOptions`有两个字段：

- `commandPlugin`，优先查找`jfetOptions.commandPlugin`作为插件入口
- `configFilePath`，优先查找`jfetOptions.configFilePath`作为配置文件路径

```javascript
"jfetOptions": {
  "commandPlugin": "./lib/index.js",
  "configFilePath": "demo"
}
```

接着执行

```shell
jfet build -w
```



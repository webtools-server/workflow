# 开发一个命令插件

## 安装

```shell
npm install @jyb/jfet -g
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
        // configFunc对应于jfet.config.js配置中的命令函数
        // argv为参数的值
    }
};

module.exports = command;
```

新增配置文件`jfet.config.js`

```javascript
module.exports = {
    build(context) {
        
    }
};
```

## 调试

如果当前目录下的`package.json`中有`jfetOptions`字段，并且存在`commandPlugin`，则优先查找`jfetOptions.commandPlugin`作为插件入口

```javascript
"jfetOptions": {
    "commandPlugin": "./index.js"
}
```

接着执行

```shell
jfet build -w
```



# jfet-image

图片处理插件

## 功能

- 内置webp方案（待完善）
- png,jpg,gif,svg图片压缩

## 安装

需要全局安装，如果已经安装过，可以跳过

```shell
$ npm i @jyb/jfet -g
$ npm i @jyb/jfet-image -g
```

## 使用

```shell
$ jfet image --min // 图片压缩
$ jfet image --webp // webp方案（待完善）
```

## 配置文件

```javascript
module.exports = {
  image() {
    const minOptions = {
      input: [path.join(__dirname, 'img/*.{jpg,png,gif}')], // 输入
      output: path.join(__dirname, 'min'), // 输出目录
      options: { // 插件配置
        gifsicle: {},
        optipng: {},
        jpegtran: {},
        svgo: false // svg默认不开启
      },
      plugins: [] // 自定义插件
    };

    return {
      min: minOptions
    };
  }
};
```

## 插件文档

- [imagemin-gifsicle](https://github.com/imagemin/imagemin-gifsicle)
- [imagemin-optipng](https://github.com/imagemin/imagemin-optipng)
- [imagemin-jpegtran](https://github.com/imagemin/imagemin-jpegtran)
- [imagemin-svgo](https://github.com/imagemin/imagemin-svgo)

# jfet-image

图片处理插件

## 功能

- 内置webp方案
- png,jpg,gif,svg图片压缩

## 安装

需要全局安装，如果已经安装过，可以跳过

```shell
$ npm i jyb_jfet -g
$ npm i jyb_jfet-image -g
```

## 使用

```shell
$ jfet image --min // 图片压缩
$ jfet image --webp // webp方案
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

    const webpOptions = {
      img: { // webp图片设置
        // 需要转换为webp格式的图片
        pattern: path.join(__dirname, 'img/*.{jpg,png,jpeg}'),
        // 转换后webp图片输出目录，为空则输出到图片目录，命名后缀为.webp.xxx
        output: path.join(__dirname, '_webp/img')
      },
      css: { // webp样式
        // 需要处理的css
        pattern: path.join(__dirname, 'css/!(*.webp).css'),
        // 处理后的css输出目录，为空则输出到样式目录，命名后缀为.webp.css
        output: path.join(__dirname, '_webp/css')
      },
      tpl: { // 模板
        // 需要处理的模板
        pattern: path.join(__dirname, 'pages/*.html'),
        // 处理后的模板输出目录，为空则输出到模板目录
        output: path.join(__dirname, '_webp/tpl')
      },
      webpOptions: {} // webp配置，see:https://github.com/imagemin/imagemin-webp
    };

    return {
      min: minOptions,
      webp: webpOptions
    };
  }
};
```

## 插件文档

- [imagemin-gifsicle](https://github.com/imagemin/imagemin-gifsicle)
- [imagemin-optipng](https://github.com/imagemin/imagemin-optipng)
- [imagemin-jpegtran](https://github.com/imagemin/imagemin-jpegtran)
- [imagemin-svgo](https://github.com/imagemin/imagemin-svgo)
- [imagemin-webp](https://github.com/imagemin/imagemin-webp)

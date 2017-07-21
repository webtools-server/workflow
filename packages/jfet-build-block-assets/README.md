# assets构建功能块

内置[css-loader](https://github.com/webpack-contrib/css-loader),[file-loader](https://github.com/webpack-contrib/file-loader),[image-webpack-loader](https://github.com/tcoopman/image-webpack-loader),[url-loader](https://github.com/webpack-contrib/url-loader)

## 安装

```shell
npm i @jyb/jfet-build-block-assets --save
```

## 使用

```javascript
const assets = require('@jyb/jfet-build-block-assets');

// preset
createConfig(context, [
    core.match(/\.png$/, [assets.url(options)])
]);
```

## 默认选项

因为`image-webpack-loader`对构建性能影响比较大，所以建议本地开发的时候可以关闭

### image

```javascript
{
    optipng: {
        optimizationLevel: 7
    },
    mozjpeg: {
        quality: 65
    },
    pngquant: {
        quality: '65-90',
        speed: 4
    }
}
```
# jfet-init

初始化命令插件

## 功能

- 支持初始化模板
- 支持显示所有模板

## 安装

需要全局安装，如果已经安装过，可以跳过

```shell
npm i @jyb/jfet -g
npm i @jyb/jfet-init -g
```

## 使用

```shell
jfet init --config/-c
jfet init --template/-t <url>
jfet init --ls

jfet init --force/-f
jfet init --output/-o <path>
jfet init --version
jfet init --help
```

### 配置

内置有一个公共账号的privateToken，可以根据需要修改

根据提示输入privateToken，[查看privateToken](http://git.jtjr.com/profile/account)

```shell
jfet init -c
```

### 选择创建项目

如果需要修改输出路径，可以增加参数`-o <path>`，默认输出路径为当前目录

如果需要先清空输出路径，可以增加参数`-f`

```shell
jfet init --ls
```

### 通过URL创建项目

如果需要修改输出路径，可以增加参数`-o <path>`，默认输出路径为当前目录

如果需要先清空输出路径，可以增加参数`-f`

```shell
jfet init -t http://git.jtjr.com/noop/template-activity.git
```

## 开发模板

目录结构

```text
|- template-activity
  |- template # 放置项目结构，必需
  |- config.json # 配置，必需
  |- package.json
  |- README.md
```

添加以下内容到`config.json`，`questions`内容可以自由定义

```javascript
{
  "questions": [{
    "type": "input",
    "name": "name",
    "message": "请输入项目名字："
  }, {
    "type": "input",
    "name": "version",
    "message": "请输入项目版本："
  }]
}
```

在`template目录`下，修改`package.json`和`README.md`中需要占位的地方，生成项目后会自动替换`{{=value}}`，例如：

README.md

```text
# {{=name}}

version: {{=version}}
```

如果需要增加日期或者时间，可以添加`{{=global.date}}`或者`{{=global.time}}`
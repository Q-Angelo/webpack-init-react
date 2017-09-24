# Webpack构建React开发环境

### 安装react、react-dom

```
npm install react react-dom --save

```

### 安装webpack插件  

```javascript
//全局安装
npm install webpack -g

//安装webpack到项目目录
npm install webpack --save-dev
```

### 入口文件及打包后输出的存放路径

```javascript
const path = require('path');

module.exports = {
  //项目的入口文件
  entry: path.resolve(__dirname, 'app/index.js'),
  //打包后输出的文件
  output: {
    filename: "bundle.js"
  },
}
```

###  resolve对象

```javascript
module.exports = {
  ...
  //在项目中import 导入模块的时候如果是 .js .jsx 等(需要自己定下)结尾的文件不要写后缀。
  resolve: {
    extensions: ['.js','.jsx']
  },
}
```

### loaders

 > loader是webpack功能之一，通过设置不同的loader，webpack会调用外部的脚本工具，对不同格式的文件进行处理。例如将最新的ES6、ES7代码转化为浏览器可执行的ES5代码，将less、scss转换为浏览器可识别的css。

 loaders在module关键字下进行配置，主要配置项为以下几个：

* ```test``` : 通过正则匹配文件的后缀名，对不同文件进行处理 (必须，格式为正则匹配)

* ```loaders``` : 具体处理的loaders名称 (必须，格式为数组)

* ```include/exclude``` :  include表示必须要包含的文件或目录，而exclude表示要排除的目录 （可选，格式为字符串）

* ```query``` : 为loaders提供的设置选项 (可选， 格式为对象)

安装babel-loader 编译js文件
```javascript
module.exports = {
  module: {
    ...
    //各种loader的设置，下面分别介绍各loader的使用:
  }
}
```

###### babel

babel是一个编译javascript的平台，可以将ES6、ES7编译为浏览器兼容的版本

```javascript

//babel的安装：
npm i babel-core babel-loader babel-preset-es2015 babel-preset-react babel-plugin-react-transform --save-dev
```

在loaders中配置如下代码：

```javascript
module.exports = {
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
    ]
  }
}
```
项目根目录中新建 ``` .babelrc ``` 文件

```javascript
{
  "presets": ["react", "es2015"],
  "env": {
    "dev": {
        "plugins": [["react-transform", {
           "transforms": [{
             "transform": "react-transform-hmr",
             "imports": ["react"],
             "locals": ["module"]
           }]
         }]]
    }
  }
}
```

###### CSS

> webpack提供两个工具处理样式表，```css-loader``` 使你能够使用类似@import 和 ```url(...)``` 的方法实现类似 ```require()```的功能，```style-loader``` 将所有计算后的样式加入页面中

```javascript
//安装
npm i style-loader css-loader --save-dev
```

> ``` postcss-loader ``` ``` autoprefixer ``` 来为CSS代码自动添加适应不同浏览器的CSS前缀

```javascript
//安装
npm i autoprefixer postcss-loader --save-dev
```

在loaders中配置如下：

```javascript
module.exports = {
  module: {
    loaders: [
      {
          test: /\.css$/,
          loaders: [
            "style-loader",
            "css-loader?importLoaders=1",
            {
              loader: "postcss-loader",
              options: {
                plugins: (loader)=>[
                  require('autoprefixer')({
                      broswers:['last 5 versions']
                  })
                ]
              },
            }
          ]
      },
    ]
  }
}
```

###### CSS预处理器

* Less

* Sass

代码示例

```javascript
module.exports = {
  module: {
    loaders: [
      {
          test: /\.less$/,
          exclude: /node_modules/,
          loaders: [
            "style-loader",
            "css-loader?importLoaders=2",
            {
              loader: "postcss-loader",
              options: {
                plugins: (loader)=>[
                  require('autoprefixer')({
                      broswers:['last 5 versions']
                  })
                ]
              },
            },
            "less-loader"
          ]
      }
    ]
  }
}
```

###### 图片处理

```javascript
//安装
npm i url-loader --save-dev
```

```javascript
module.exports = {
  module: {
    loaders: [
      {
          test:/\.(png|gif|jpg|jpeg|bmp)$/i,
          loader:'url-loader',
          query: {
              limit: 1000,
              name: 'img/[name]-[hash:5].[ext]'
          }// 限制大小5kb
      }
    ]
  }
}
```

###### 字体处理

```javascript
module.exports = {
  module: {
    loaders: [
      {
          test:/\.(woff|woff2|svg|ttf|eot)$/i,
          loader:'url-loader',
          query: {
              limit: 1000,
              name: 'fonts/[name]-[hash:5].[ext]'
          }// 限制大小5kb
      }
    ]
  }
}
```

### plugins (插件)

>  插件用于扩展webpack功能，在整个构建过程中生效，执行相关的任务

###### 声明版权

```javascript
// 安装

```

```javascript
module.exports = {
  plugins: [
    new webpack.BannerPlugin("Copyright by Q-Angelo@github.com."),
  ]
}
```

###### html模板插件

> 在plugins中使用html-webpack-plugin插件将会插入index.html文件

* ``` filename ``` : 在output.path指定的目录下创建index.html文件
* ``` template ``` : 插入的模板
* ``` inject ``` : 指定插入的位置 可以指定插入在 head里面 或者 body里面
* ``` favicon ``` : 生成小图标

```javascript
// 安装
npm i html-webpack-plugin --save-dev
```

```javascript
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
        favicon:'./app/static/img/favicon.ico',
        template: __dirname + '/app/index.tpl.html'
    }),
  ]
}
```

###### 热加载插件   

```javascript
// 安装
npm i open-browser-webpack-plugin --save-dev
```

```javascript
module.exports = {
  plugins: [

  ]
}
new webpack.HotModuleReplacementPlugin()
```

###### webpack构建本地服务器 devServer

``` 注意： ``` 主要用于开发环境调试

* ``` port ``` : 设置默认监听端口，如果省略，默认为”8080“
* ``` inline ``` : 设置为true，当源文件改变时会自动刷新页面
* ``` colors ``` : 设置为true，使终端输出的文件为彩色的
* ``` historyApiFallback ``` : 在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
* ``` contentBase ``` :  webpack-dev-server默认会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录（例如设置到"./public"目录）

```
npm install webpack-dev-server --save-dev

```
```javascript
module.exports = {
  plugins: [
    devServer: {
      proxy: {
          // 凡是 `/api` 开头的 http 请求，都会被代理到 localhost:3000 上，由 koa 提供 mock 数据。
          // koa 代码在 ./mock 目录中，启动命令为 npm run mock
          '/api': { target: 'http://127.0.0.1:3000/', secure: false }
      },
      historyApiFallback: true, //不跳转，在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
      inline: true, //实时刷新
      contentBase:'/',
      host: '127.0.0.1',
      port: 8080,
      hot: true  //使用热加载插件 HotModuleReplacementPlugin
    }
  ]
}
```

###### DefinePlugin

```javascript
module.exports = {
  plugins: [
    // 定义为生产环境，编译 React 时压缩到最小
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': '"production"'
      }
    }),
  ]
}
```

###### OccurrenceOrderPlugin

```javascript
module.exports = {
  plugins: [
    // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
    new webpack.optimize.OccurrenceOrderPlugin(),
  ]
}
```

###### UglifyJsPlugin

js代码压缩

```javascript
module.exports = {
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
        compress: {
          //supresses warnings, usually from module minification
          warnings: false
        },
        beautify:false,
        comments:false
    }),
  ]
}
```

###### ExtractTextPlugin 分离CSS和JS文件

```
//安装
npm install extract-text-webpack-plugin --save-dev

```

```javascript
//引入
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  plugins: [
    // 分离CSS和JS文件
    new ExtractTextPlugin('/css/[name].[chunkhash:8].css'),
  ]
}
```

###### OptimizeCssAssetsPlugin css代码压缩

```javascript
//安装
npm install optimize-css-assets-webpack-plugin --save-dev
```

```javascript
//引入
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  plugins: [
    //css代码压缩
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: {removeAll: true } },
      canPrint: true
    }),
  ]
}
```

###### 提供公共代码

```javascript

module.exports = {
  plugins: [
    //提供公共代码
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: '/js/[name].[chunkhash:8].js'
    }),
  ]
}
```

###### 将代码压缩成gz格式最小化文件大小这种格式需要与后段配合来使的浏览器去解析

```javascript

module.exports = {
  plugins: [
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
}
```

# webpack与webpack-dev-server的区别：
  webpack-dev-server只是个本地的文件服务器，它只做文件服务，生成的文件会在内存里，不做打包服务，当您更改资源中的某些内容时，将会重新加载文件。
  如果第一次对文件打包可以使用webpack

# 注意:save 和 --save-dev的区别
  npm install时使用--save和--save-dev，可分别将依赖（插件）记录到package.json中的dependencies和devDependencies下面。
  dependencies下记录的是项目在运行时必须依赖的插件，常见的react jquery等，即使项目打包好了、上线了，这些也是需要用的，否则程序无法正常执行。
  devDependencies下记录的是项目在开发过程中使用的插件，但是一旦项目打包发布、上线了之后，webpack就都没有用了，可卸磨杀驴。

# webpack踩坑之路

#### 错误1：

```
  configuration has an unknown property 'postcss'. These properties are valid:
```

#### 对策1：
  Webpack 2.1.0-beta23 之后的config里不能直接包含自定义配置项
  解决：将postcss和devServer替换成以下写法即可（https://github.com/webpack/webpack/pull/2974#issuecomment-245857168）

```javascript
  plugins: {
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: function () {
          return [precss, autoprefixer];
        },
        devServer: {
          contentBase: "./public", //本地服务器所加载的页面所在的目录
          colors: true, //终端中输出结果为彩色
          historyApiFallback: true, //不跳转
          inline: true //实时刷新
        }
      }
    })
  }
```

#### 错误2：

  postcss-loader 有版本问题,高版本的会对低版本的配置报错

```javascript
ERROR in ./~/css-loader!./~/postcss-loader/lib!./app/static/css/main.css
Module build failed: Error: No PostCSS Config found in:
```

#### 对策2：

  采用以下方法配置

```javascript
  {
        test: /\.css$/,
        loaders: [
          "style-loader",
          "css-loader?importLoaders=1",
          {
            loader: "postcss-loader",
            options: {
              plugins: (loader)=>[
                require('autoprefixer')({
                    broswers:['last 5 versions']
                })
              ]
            },
          }
        ]
    }
```

#### 问题3

    配置package.json文件，注意windows和linux 之间的不同按照下面的即可

#### 对策3：



 * 配置生产环境

linux下配置：```json "start": "NODE_ENV=dev webpack-dev-server --progress --colors" ```

windows下配置：```json "start": "set NODE_ENV=dev && webpack-dev-server --progress --colors" ```

 * 配置开发环境

linux下配置：```json "build": "rm -rf ./build && NODE_ENV=production webpack --config ./webpack.production.config.js --progress --colors"  ```

windows下配置：```json "build": "rd/s/q build && set NODE_ENV=production && webpack --config ./webpack.server.js --progress --colors" ```

windows每次build的时候需要在项目目录下建一个build文件夹，如果没有此文件，删除的时候会报错  

#### 问题4

    OccurenceOrderPlugin构造器错误

#### 对策4

    此问题一般出现在webpack2中，解决办法很简单，将OccurenceOrderPlugin改为OccurrenceOrderPlugin即可  

#### 问题5

    ant-design与css Modules的冲突，配置了css-modules的相关功能会把antd的样式也hash化了，导致样式不匹配

#### 对策5：

    定义两个css loaders像下面这样

```javascript
    // CSS modules
    {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader?modules'
    },
    //ant-design
    {
        test: /\.css$/,
        include: /node_modules/,
        loader: 'style-loader!css-loader'
    }  
```

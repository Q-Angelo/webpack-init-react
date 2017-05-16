webpack初始化react
1.npm init
安装插件
//webpack
npm install webpack webpack-dev-server --save-dev

//react
npm i react react-dom --save

//js代码、css代码、图片、less、字体图标
npm i postcss-loader --save-dev
npm i style-loader css-loader --save-dev
npm i less less-loader postcss-loader url-loader --save-dev

//
npm i html-webpack-plugin open-browser-webpack-plugin --save-dev


//.babelrc 
npm i babel-core babel-loader babel-preset-es2015 babel-preset-react babel-plugin-react-transform --save-dev




webpack才坑之路
	错误1：
	configuration has an unknown property 'postcss'. These properties are valid:

	对策1：
	Webpack 2.1.0-beta23 之后的config里不能直接包含自定义配置项
	解决：将postcss和devServer替换成以下写法即可（https://github.com/webpack/webpack/pull/2974#issuecomment-245857168）
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

	错误2：
	postcss-loader 有版本问题,高版本的会对低版本的配置报错
	ERROR in ./~/css-loader!./~/postcss-loader/lib!./app/static/css/main.css
	Module build failed: Error: No PostCSS Config found in: 

	对策2：
	采用以下方法配置
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

    问题3
    配置package.json文件，注意windows和linux 之间的不同按照下面的即可

    对策3：
    配置生产环境
		linux下配置：
			"start": "NODE_ENV=dev webpack-dev-server --progress --colors"
		windows下配置：
			"start": "set NODE_ENV=dev && webpack-dev-server --progress --colors"
	配置开发环境
		linux下配置：
		"build": "rm -rf ./build && NODE_ENV=production webpack --config ./webpack.production.config.js --progress --colors"		
		windows下配置：
		"build": "rd/s/q build && set NODE_ENV=production && webpack --config ./webpack.server.js --progress --colors"
		如果还有问题 在项目目录下建一个build文件夹

	问题4
		OccurenceOrderPlugin构造器错误

	对策4
		此问题一般出现在webpack2中，解决办法很简单，将OccurenceOrderPlugin改为OccurrenceOrderPlugin即可
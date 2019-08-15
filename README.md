## Webpack4 全面整理笔记（2019/8/15）—— 小鹿

[TOC]



## Webpack

`webpack` 是一款强大的模块加载器兼打包工具，他能把各种资源，例如 `JS（JSX）`、样式（`less/sass`）、图片都作为模块使用和处理。优势如下：

1、`webpack` 是以 `CommonJS` 的形式来书写的，但对 `AMD/CMD` 的支持也很全面，方便旧项目进行代码迁移。

2、能被模块化的不仅仅是 `JS`，还包括各种资源文件。

3、开发便捷，能替代 `gulp` 的工作，比如打包、混淆压缩、图片转 `base64` 等。

4、扩展性强，插件机制完善，特别是支持 `React` 热插件。



## 1. webpack 命令行

### 1.1 全局安装 webpack

```
npm install webpack -g
```

### 1.2 本地开发环境安装

```
npm install webpack --save-dev
```

### 1.3 安装用于命令行运行 webpack-cli

```
npm install webpack-cli -g
```

### 1.4 命令行中的使用

```
webpack index.js -o bundle.js -参数
```

> `src/index.js` 打包的入口文件路径 `build/bundle.js` 打包后的输出文件名

### 1.5 命令行参数

- `webpack 源文件 -o 打包文件` 开发环境下编译
- `webpack -p` 生产环境下编译，**会压缩生成后的文件**
- `webpack -w` 开发环境下**持续的监听文件** > 变动来进行编译
- `webpack -d` 会生成 `map` 映射文件，会在控制台的 `Source` 页面标签中出现存放打包前原始文件的 `webpack://` 目录，**可以打断点，帮助调试**（会生成 `webpack：// ` 文件夹）
- `webpack --progress`  显示构建**项目的进度**
- `webpack --display-error-details` 显示打包过程中的**出错信息**（比如 `webpack` 寻找模块的过程）
- `webpack --profile` **输出性能数据**，可以看到每一步的消耗



## 2. 使用 webpack 配置文件

### 2.1 初始化 git

```
新建文件夹 ——> git init
```

### 2.2 初始化项目

```
npm init
```

### 2.3增加 .gitignore

**创建文件**

- README.md ：描述项目使用操作文件
- .gitignore ：git 配置文件（配置某些文件不提交 github）

**在文件下添加一下内容**

```javascript
node_modules
.idea
```

### 2.4 在项目的根目录下创建 src 和 build 目录 

`src` 目录存放源码，`build` 目录存放编译打包之后的资源

```
mkdir src build
```

### 2.5 增加一下文件

#### 2.5.1 src/index.js && component.js 

> 每个文件的入口文件为 `index.js` 或在 `package.json` 中的。



```
cd src && touch component.js
```

写入一下内容

```javascript
// component.js 
var str = module.exports = '小鹿';
console.log(str)
```

```javascript
// index.js 
require('./component.js')
```



#### 2.7 创建 webpack 配置文件

```
touch webpack.config.js
```

> **注意：**这个文件名是定死的，不然会报 `Output filename not configured` 的错误;另外，如果不按这个命名，那么会在 webpack 运行的时候需要通过 `--configured` 这个参数指定配置文件，比如：`webpack --config  conf.js`(别名)

#### 2.8 在配置文件中配置命令操作

> 配置命令操作或者打包路径信息等。

```
// webpack.config.js 配置文件
const path = require('path');

// 导出模块
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    mode: 'development' // 设置mode
}
```

```
webpack 
```

> **补充：**运行 `webpack` 就会在当前目录下找 `webpack.config` 文件，如果没有则会报错。
>
> **注意：**如果根目录下多个项目，`webpack `打包只能应用于一个项目，所以需要将全局的 `webpack` 卸载掉，在本地安装 `webpack` 就可以解决这个问题(需要把全局的卸载掉)。

**运行命令找不到问题**

如果在本地安装完 `webpack` 会出现命令找不到的问题，以为我们的 webpack 安装在 `node_module 中，通过在 `package.json` 文件中通过别名的脚本来执行命令。

```
// package.json 中设置打包环境
"scripts": {
    "dev": "webpack --mode development",  // 开发环境
     "build": "webpack --mode production",  // 生产环境
  },
```

```
npm run build  // 此时程序会去 node_module 文件中去查找，如果找不到，直接去全局下寻找配置文件，如果还找不到，就会报错
```



## 3. loader

`loader` 就是一个加载器，`webpack` 就通过加载器来将文件进行打包的。使用 `babel-loader` 来解析 `es6` 写成的模块。

### 3.1 安装 loader 

`babel-loader` 可以将 `ES6` 的代码转为 `ES5` 的代码 `babel` 官网。

```
npm install --global babel-cli
```

### 3.2 命令行下使用 Babel 

这将把编译后的结果直接输出至终端

```
babel es6.js 
```

加上  `-o`  参数 可以将结果写入到指定的文件

```
babel es6.js -o es5.js
```

把整个目录整个编译成一个新的目录

```
babel src -d lib
```

### 3.3 配置 Babel

`Babel` 是一个通用编译器，因此默认情况下他反而什么都不用做，你必须明确的告诉 `Babel` 应该要做什么，在项目根目录下创建 `.babelrc` 文件，这是用来让 `Babel` 做你要它做的事情的配置文件。

```
{
	"presets":[], // 映射
	"plugins":[]  // 插件
}
```

### 3.4 babel-preset-es2015

> 把 ES6 编译成 ES5

安装依赖的预设

```
npm install --save-dev babel-preset-es2015
```

修改 `.babelrc`

```
{
    "presets":["es2015"],
    "plugins": []
}
```

### 3.5 webpack 中使用 loader

```
npm install babel-loader@7 babel-core@6 --save-dev
npm install babel-preset-es2015 babel-preset-stage-0 --save-dev
```

> **注意：**如果运行 `webpack` 报错，因为 `babel-loader` 和 `babel-core` 版本不对应导致的。
>
> 1）`-loader` 其实是可以省略不写的，多个 `loader` 之间用 “！” 连接起来 `loaders` 是一个数组。

### 3.6 修改 webpack.config.js

```javascript
// 配置模块
module: {
    rules: [
        {
            test: /\.js$/, // 匹配所有.js结尾的文件
            exclude: /node_modules/,  // 忽略node_modules文件夹
            use: {
                loader: 'babel-loader'  // 使用babel-loader转义
            }
        }
    ]
}
```



## 4. devServer

`webpack-dev-server` 是一个 `Web` 服务器，可以预览项目，并且当修改源码后可以实时刷新页面 server 配置。

### 4.1 安装 devServer

```javas
npm install webpack-dev-server --save-dev
```

### 4.2 配置 package.json 

```
"scripts": {
    "dev": "webpack-dev-server"
  },
```

### 4.3 配置 webpack.config.js

```javascript
// 指定 webpack-dev-server 的配置项
devServer: {
    port: 8080, // 配置端口号
    contentBase: './build' // 配置文件的根目录
},
```

### 4.4 启动服务器

```
npm run dev
```

> **注意：**devServer 服务器打包到了内存中，而不是本地硬盘上，为了能够提高效率。

### 4.5 预览项目

打开浏览器访问 http://localhost:8080

### 4.6 proxy 模拟后台接口

![1565785864918](C:\Users\10405\AppData\Roaming\Typora\typora-user-images\1565785864918.png)

#### 4.6.1  修改 webpack.config.js 

```javascript
devServer: {
    port: 8080, // 配置端口号
        contentBase: './build', // 配置文件的根目录
            proxy:[
                {   
                    // 用来匹配请求 URL 的正则
                    path:/\/api\/(.+)/,
                    // 将此请求转发给哪个服务器
                    target: 'http://localhost:8080',
                    // 转换路径，把原路径转成目标路径
                    rewrite: rewriteUrl('\/$1\.json'),
                    // 修改来源的路径
                    changeOrigin:true
                }
            ]
},
```

```javascript
// 进行路径的转换 传入要替换成什么样的路径
function rewriteUrl(replacePath){
    // options 就是 proxy 的对象
    return function(req,options){
        //  /\api\/(.+)/ => '\/$1\.json'
        req.url = req.path.replace(options.path,replacePath)
    }
}
```



## 5. resolve 解析

### 5.1 extension

指定 `extension` 之后可以不用在 `require` 或是 `import` 的时候加载文件扩展名，会依次尝试添加扩展名进行匹配

#### 5.1.1 修改 webpack.config.js

```javascript
// 如何解析文件
resolve: {
    // 指定文件扩展名
    extensions:['.js', '.css', '.json']
},
```

#### 5.1.2 修改 src/index.js 

```javascript
require('./component') // 不用后边写后缀,会自动匹配
```

### 5.2 alias

配置别名可以加快 `webpack` 查找模块的速度

- 每当引入 `jquery` 模块的时候，它会直接引入 `jqueryPath` ，而不需要从 `node_modules` 文件夹中按模块查找规则查找。
- 不需要 `webpack` 去解析 `jquery.js` 文件

#### 5.2.1 先安装 jQuery

```
npm install jquery --save
```

#### 5.2.2 修改 webpack.config.js

```javascript
// 如何解析文件
resolve: {
    ......
    // 指定模块的别名 指定后不需要再走原有的 node 模块流程，直接定位到文件
    alias: {
       // 得到 jquery 的绝对路径(补充:path.resolve方法用于将相对路径转为绝对路径)
       jqueryPath: path.resolve('lib\jquery.js')
    } 
},
   module: {
        rules: [
            {
              test: /\.js$/, // 匹配所有.js结尾的文件
              exclude: /node_modules/,  // 忽略node_modules文件夹
              use: {
                loader: 'babel-loader'  // 使用babel-loader转义
              }
            }
        ],
        // 如果你确定一个模块中没有其他新的依赖 就可以配置这一项，webpack 将不再进行解析
        noParse: [jqueryPath]
    },
```

> 补充：正常的引入 jquery 是怎么加载的？

```
var $ = require('jquery')
```

> 先找 `node_modules` 然后再去找 `jquery`，然后找到 `package.json`，然后找到 `main` 配置项，然后才找到 `jquery` 文件。

#### 5.2.3 修改 src/index.js 

```
var str = require('./component')
document.write('哈哈'+str)
```

#### 5.2.4 将 jquery.js 单独放在根目录下的 lib 文件

```
touch lib
```

#### 5.2.5 修改 webpack.config.json

```javascript
// 如何解析文件
resolve: {
    // 指定文件扩展名
    extensions:['.js', '.css', '.json'],
    // 指定模块的别名 指定后不需要再走原有的 node 模块流程，直接定位到文件
    alias: {
        // 得到 jquery 的绝对路径(补充:path.resolve方法用于将相对路径转为绝对路径。)
        jqueryPath: path.resolve('lib\jquery.js')
    } 
},
```



## 6. 解析 less 样式文件

### 6.1 安装 loader

- `less-loader` 负责把 `less` 源码转成 `css `代码
- `css-loader` 负责读取 `css` 代码
- `style-loader` 负责在 `css `代码转变成 `style` 标签并作为页内样式插入到页面中去

```
npm install less style-loader css-loader less-loader --save-dev
```

### 6.2 修改配置文件 webpack.config.js

```
{
    test: /\.less$/,             // 如果是 less 文件，该如何加载
    use: ['style-loader','css-loader','less-loader'], // 从左向右依次编译
}
```

#### 6.2.1 新建 src/less/index.less文件

```less
@base:red;
.red{
    color: @base;
}
```

#### 6.2.2 修改 src/index.js 

```javascript
var str = require('./component') 

// 把 less 模块引入当前项目中
require('./less/index')
var $ = require('jquery')

$('#app').html(str)
```

#### 6.2.3 修改 webpack.config.json

```
 extensions:['.js', '.css', '.json','.less'] // 添加 less 解析
```



## 7. 资源文件的加载

实现 css、图标、图片等资源文件加载

### 7.1 安装 bootstrap 和相应的 loader

```
npm install bootstrap@3 --save
npm install file-loader url-loader --save-dev
```

### 7.2 修改 webpack.config.js

设置 css 文件和图标文件的加载器

```javascript
    // 如果是 css 文件
    {
        test: /\.css$/, 
            use:['style-loader', 'css-loader']
    },
    // 图标
    {
        test:/\.(eot|svg|ttf|woff|woff2)/,
            use:{
                loader: 'url-loader',
                    options:{
                        limit: 8192
                    }
            }
    },
    // 图片
     {
        test:/\.(png|jpg|gif)$/,
        use:{
            loader: 'url-loader',
            options: {
               limit: 8192
            },

         }
    }
```

> 配置信息中的参数 `limit：8192` 表示将所有小于 `8kb` 的图片都转为 `base64` 形式（其实说应该超过 `8kb` 的才使用 `url-loader` 来映射到文件，否则转为 `data url` 形式）

### 7.3 修改 src/index.js

```javascript
require('bootstrap/dist/css/bootstrap.css')
// 加载图片
var img = document.createElement('img');
img.className = 'img-circle';
img.src = require('./images/1.png');
document.body.appendChild(img)
```

### 7.4 修改 build/index.html

```html
<div class="red" id="app"></div>
<span class="glyphicon glyphicon-glass"></span>
```



## 8. 自动刷新

在源码修改之后可以自动刷新页面  修改 `webpack.config.js`

```javascript
 devServer: {
 	inline:true,// 在源代码修改之后重新打包并刷新浏览器
 }
```



## 9. 自动产出 html

### 9.1 创建 html 模板文件

```javascript
cd src && touch index.html
```

### 9.2 下载 webpack 插件

```javascript
npm install html-webpack-plugin --save-dev
```

### 9.3 修改 webpack.config.js 

```vue
var HtmlWebpackPlugin = require('html-webpack-plugin')
// 插件
plugins: [
    // 把 template 里的文件拷贝到目标并且自动插入产出的或者说打包后的文件
    new HtmlWebpackPlugin({
        title: '小鹿webpack',
        template:'./src/index.html',
        filename: 'index.html'
    })
]
```



## 10. 自动打开浏览器

### 10.1 安装插件

```
npm install open-browser-webpack-plugin --save-dev
```

### 10.2 修改webpack.config.js

```javascript
var OpenBrowerWebpackPlugin = require('open-browser-webpack-plugin')
// 自动打开浏览器
new OpenBrowerWebpackPlugin({
    url:'http://localhost:8080'
})
```



## 11. 暴露全局对象

### 11.1 安装暴露组件

```
npm install expose-loader --save-dev
```

### 11.2 暴露全局对象

```javascript
 // 暴露全局对象
{
    test:/jquery\.js$/,
        use: {
            loader:'expose-loader?jQuery'
        }
}
```

### 11.3 Html 使用 jquery

```javascript
 <script>
     window.onload = function(){
     	console.log(window.jQuery)
 	 }
</script>
```



## 13、CSS 文件的单独加载

### 13.1 安装插件

> webpack4 需要将该插件进行升级到 4 才可以使用。

```javascript
npm install mini-css-extract-plugin --save-dev
```

### 13.2 修改 webpack.config.js

```javascript
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 如果是 css 文件
{
    test: /\.css$/, 
        use:  [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'less-loader',
        ]
},

// 抽离出来以后的css文件名称
new MiniCssExtractPlugin({
   filename: "[name].css",
   chunkFilename: "[id].css"
}),
```



## 14. 提取公共代码和应用代码和第三方代码分离

> ```
> 项目中分别有a.js, b.js, page1.js, page2.js这四个JS文件， page1.js 和 page2.js中同时都引用了a.js, b.js， 这时候想把a.js, b.js抽离出来合并成一个公共的js，然后在page1, page2中自动引入这个公共的js，怎么配置呢？
> ```

- **相同的资源被重复的加载**，浪费用户的流量和服务器的成本；
- 每个页面需要**加载的资源太大**，导致网页首屏加载缓慢，影响用户体验。 如果能把公共代码抽离成**单独文件进行加载能进行优化**，可以减少网络传输流量，降低服务器成本
- 在 `webpack4.0 optimization.splitChunks` 替代了 `CommonsChunkPlugin`

### 14.1 修改webpack.config.js

```javascript
    optimization:{
        splitChunks:{
          cacheGroups:{
            // 公共代码抽离
            common:{
              chunks:'initial',
              minSize:0,      // 大于 0 字节
              minChunks:2     // 抽离公共代码时，代码块的最小被引用次数
            },
            // 将第三方模块进行提取
            vendor:{
              priority:1,         // 优先级(权重)
              test:/node_modules/,// 提取文件路径
              chunks: 'initial',
              minSize: 0,          //  大于 0 字节
              minChunks: 2         //  抽离公共代码时，代码块的最小被引用次数
            }
          }
        }
    }
```

> **注意：**这里需要配置权重 `priority`，因为抽离的时候会执行第一个 `common` 配置，入口处看到 `jquery` 也被公用了就一起抽离了，不会再执行 `vendor` 的配置了，所以加了权重之后会先抽离第三方模块，然后再抽离公共 `common` 的，这样就实现了第三方和公用的都被抽离了。



## 15. 添加哈希值

> 避免缓存问题，哈希值不同，缓存将重新存取数据。

### 15.1修改webpack.config.js

```
file-name: '[name].[hash].js'
```



## 16. 压缩资源

### 16.1 html 代码压缩

```
npm install html-webpack-plugin --save-dev
```

转 HTML 模板。

### 16.2 js 代码压缩

```
npm install uglifyjs-webpack-plugin --save-dev
```
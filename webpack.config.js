const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OpenBrowerWebpackPlugin = require('open-browser-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const uglifyjs = require('uglifyjs-webpack-plugin');
const jqueryPath =  path.resolve('lib/jquery.js');

// 进行路径的转换 传入要替换成什么样的路径
// function rewriteUrl(replacePath){
//     // options 就是 proxy 的对象
//     return function(req,options){
//         //  /\api\/(.+)/ => '\/$1\.json'
//         req.url = req.path.replace(options.path,replacePath)
//     }
// }

// 导出一个模块对象
module.exports = {
    // 设置入口文件的绝对路径
    entry: {
        index:path.resolve('./src/index.js'),
        vendor:['jquery']
    },
    // 设置环境(开发环境)
    mode: 'development',
    // 设置输出
    output: {
        path: path.resolve(__dirname, 'build'),// 设置输出目录
        filename: '[name].[hash].js' // 设置输出保存的文件名
    },
    // 如何解析文件
    resolve: {
        // 指定文件扩展名
        extensions:['.js', '.css', '.json','.less'],
        // 指定模块的别名 指定后不需要再走原有的 node 模块流程，直接定位到文件
        alias: {
            // 得到 jquery 的绝对路径(补充:path.resolve方法用于将相对路径转为绝对路径。)
            jqueryPath: path.resolve('lib/jquery.js')
        } 
    },
    // 配置模块
    module: {
        rules: [
            // 匹配所有.js结尾的文件
            {
              test: /\.js$/, 
              exclude: /node_modules/,  // 忽略node_modules文件夹
              use: {
                loader: 'babel-loader'  // 使用babel-loader转义
              }
            },
             // 如果是 less 文件，该如何加载
            {
                test: /\.less$/,            
                use:["style-loader","css-loader", "less-loader"]
            },
            // 如果是 css 文件
            {
                test: /\.css$/, 
                use:  [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                ]

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
            },
            // 暴露全局对象
            {
                test:/jquery\.js$/,
                use: {
                    loader:'expose-loader?jQuery'
                }
            }
        ],
        // 如果你确定一个模块中没有其他新的依赖 就可以配置这一项，webpack 将不再进行解析
        noParse: [jqueryPath]
    },

    // 指定 webpack-dev-server 的配置项
    devServer: {
        inline:true,// 在源代码修改之后重新打包并刷新浏览器
        port: 8080, // 配置端口号
        contentBase: './build', // 配置文件的根目录
        // proxy:[
        //     {   
        //         // 用来匹配请求 URL 的正则
        //         path:/\/api\/(.+)/,
        //         // 将此请求转发给哪个服务器
        //         target: 'http://localhost:8080',
        //         // 转换路径，把原路径转成目标路径
        //         rewrite: rewriteUrl('\/$1\.json'),
        //         // 修改来源的路径
        //         changeOrigin:true
        //     }
        // ]
    },
    // 插件
    plugins: [
        // 抽离出来以后的css文件名称
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css",
            chunkFilename: "[id].css"
          }),
        // 把 template 里的文件拷贝到目标并且自动插入产出的或者说打包后的文件
        new HtmlWebpackPlugin({
            title: '小鹿webpack',
            template:'./src/index.html',
            filename: '[name].[hash].html'
        }),
        // 自动打开浏览器
        new OpenBrowerWebpackPlugin({
            url:'http://localhost:8080'
        }),
        // 压缩 JS 代码
        new uglifyjs(), 
    ],

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
}

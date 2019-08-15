var str = require('./component')    
// 把 less 模块引入当前项目中
require('./less/index')
require('../node_modules/bootstrap/dist/css/bootstrap')
var $ = require('jquery')
$('#app').html(str)

// 加载图片
var img = document.createElement('img');
img.className = 'img-circle';
img.src = require('./images/1.png');
document.body.appendChild(img)

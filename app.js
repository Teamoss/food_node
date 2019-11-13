//项目入口文件

//加载express模块
const express = require('express')
//加载文件路径模块
const path = require('path')
//加载body-parser，处理post提交
const bodyParser = require('body-parser')
//加载数据库模块
const mongoose= require('mongoose')
//创建app应用
const app = express()

//允许跨域
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});


//配置静态托管文件
app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')))

//配置表单post请求 parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//挂载路由
app.use('/api', require('./routers/api'));
app.use('/api', require('./routers/login'));

//连接数据库
mongoose.connect('mongodb://localhost/food', { useNewUrlParser: true },function(err) {
    if (err) {
        console.log('数据库连接失败');
    } else {
        console.log('数据库连接成功');

        //启动服务器
        app.listen(3000,function () {
            console.log('server is running。。。。')
        })
    }
})




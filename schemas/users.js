const mongoose = require('mongoose')

//用户表结构
module.exports = new mongoose.Schema({

    //用户名
    username:String,
    //用户密码
    password:String,
    //是否是管理员
    isAdmin:{
        type: Boolean,
        default: false
    }
})
//商家表结构
const mongoose = require('mongoose')

//用户表结构
module.exports = new mongoose.Schema({

    //商家账号
    username:String,
    //密码
    password:String,
    //商家logo
    logo:{
        type:String,
        default: ''
    },
    //商家名称
    business:{
        type:String,
        default: ''
    },
    //商家介绍
    content:{
        type:String,
        default: ''
    },
})
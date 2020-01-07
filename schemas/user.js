//用户表结构
const mongoose = require('mongoose')

module.exports = new mongoose.Schema({

    //用户openid
    openid: String,

    //用户昵称
    nickName: String,

    //用户头像
    avatarUrl: String,

    //用户性别  0女性 1男性
    gender: Number,

    //用户城市
    city: String,

    //用户省份
    province: String,


})
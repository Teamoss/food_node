//商家表结构
const mongoose = require('mongoose')

module.exports = new mongoose.Schema({

    //商家账号
    username:String,
    //密码
    password:String,
    //店铺logo
    logo:{
        type:String,
        default: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIAtibsicGaUUAGpGr8yo5G7MibcxgUPUreak1h1MAlp2quibB9qXxuruTdVnepiavDz8Tu9OIruLHMb7A/132'
    },
    //商家名称
    business:{
        type:String,
        default: '暂无名字，取个名字吧'
    },
    //商家介绍
    content:{
        type:String,
        default: '赶快来介绍下你的店铺'
    },
    //商家地址
    address: {
        type:String,
        default: '暂无地址'
    }
})
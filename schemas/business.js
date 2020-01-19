//商家表结构
const mongoose = require('mongoose')
const randomNumber = require('../plugin/randomNumber')

module.exports = new mongoose.Schema({

    //商家账号
    username: String,
    //密码
    password: String,
    //店铺logo
    logo: {
        type: String,
        default:'/public/default/logo.jpg'
    },
    //商家名称
    business: String,

    //商家介绍
    content: String,

    //商家地区
    city: {
        type: Array,
        default: ["广东省", "广州市", "天河区"]
    },

    //商家详细地址
    address: String,

    //联系方式
    phone: Number,

    //评分
    score: {
        type: Number,
        default: 0
    },

    //销量
    saleNumber: {
        type: Number,
        default: 0
    },

    //评论数量
    commentNumber: {
        type: Number,
        default: 0
    },

    //门店图片
    swiper: {
        type: String,
        default: '/public/default/swiper.jpg'
    },

})
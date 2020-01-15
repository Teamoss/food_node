const mongoose = require('mongoose')

//用户评论表结构
module.exports = new mongoose.Schema({

    //关联字段-商家ID
    business: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Business'
    },

    //关联字段-订单ID
    order: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Order'
    },

    //用户openid
    openid: String,

    //用户信息
    userInfo: Object,

    //评论内容
    comment: String,

    //评论时间
    commentTime: String,

    //评分
    score: Number,

    //商家回复
    businessComment: {
        //类型
        type: String,
        default: null
    },

})


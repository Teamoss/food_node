const mongoose = require('mongoose')

//收藏表结构
module.exports = new mongoose.Schema({

    //关联字段-商家ID
    business: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Business'
    },

    //用户openid
    openid: String,


    //收藏时间
    addTime: String,


})


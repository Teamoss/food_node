const mongoose = require('mongoose')

//用户收货地址表结构
module.exports = new mongoose.Schema({

    //关联字段-用户ID
    user: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'User'
    },
    //姓名
    name: String,
    //性别  0女性 1男性
    gender: Number,
    //手机号码
    phone: Number,
    //收货地址
    address: String
})


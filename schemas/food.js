const mongoose = require('mongoose')

//菜品表结构
module.exports = new mongoose.Schema({

    //关联字段-商户ID
    business: {
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Business'
    },
    //菜品名称
    name:String,
    //菜品介绍
    description:{
        type: String,
        default:'快来介绍下吧~~'
    },
    //菜品价格
    price:Number,
    //菜品图片
    imageUrl:{
        type:String,
        default: '/public/default/food.jpeg'
    },
})


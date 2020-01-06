const mongoose = require('mongoose')

//订单表结构
module.exports = new mongoose.Schema({

    //关联字段-商家ID
    business: {
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Business'
    },

    //用户openid
    openid: String,

    //收货姓名
    name: String,

    //收货地址
    address: String,

    //下单时间
    orderTime:String,

    //期望送达时间
    sendTime:String,

    //联系电话
    phone:String,

    //性别  0女性 1男性
    gender: Number,

    //订单信息
    food:String,

    //订单金额
    sumMoney:Number,

    //订单状态  0:商家未接单  1.商家已接单  2:已送达/确认收货
    status:{
        type: Number,
        default:0
    }

})


const mongoose = require('mongoose')
const order = require('../schemas/order')

//导出订单表模型
module.exports = mongoose.model('Order',order)
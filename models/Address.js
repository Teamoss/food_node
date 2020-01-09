const mongoose = require('mongoose')
const address = require('../schemas/address')

//导出用户收货地址表模型
module.exports = mongoose.model('Address',address)
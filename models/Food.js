const mongoose = require('mongoose')
const food = require('../schemas/food')

//导出菜品表模型
module.exports = mongoose.model('Food',food)
const mongoose = require('mongoose')
const businessSchema = require('../schemas/business')

//导出商家表模型
module.exports = mongoose.model('Business',businessSchema)
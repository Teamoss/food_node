const mongoose = require('mongoose')
const admin = require('../schemas/admin')

//导出商家表模型
module.exports = mongoose.model('Admin',admin)
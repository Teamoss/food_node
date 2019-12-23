const mongoose = require('mongoose')
const user = require('../schemas/user')

//导出用户表模型
module.exports = mongoose.model('User',user)
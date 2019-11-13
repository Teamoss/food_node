const mongoose = require('mongoose')
const userSchema = require('../schemas/users')

//导出用户表模型
module.exports = mongoose.model('User',userSchema)
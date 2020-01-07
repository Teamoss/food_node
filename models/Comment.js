const mongoose = require('mongoose')
const comment = require('../schemas/comment')

//导出评论表模型
module.exports = mongoose.model('Comment',comment)
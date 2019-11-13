const mongoose = require('mongoose')
const contentSchema = require('../schemas/contents')

//导出文章内容表模型
module.exports = mongoose.model('Content',contentSchema)
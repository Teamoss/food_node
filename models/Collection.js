const mongoose = require('mongoose')
const collection = require('../schemas/collection')

//导出收藏表模型
module.exports = mongoose.model('Collection',collection)
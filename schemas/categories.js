const mongoose = require('mongoose')

//文章分类表结构
module.exports = new mongoose.Schema({

    //分类名称
    categoryName: String
})
//管理员表结构
const mongoose = require('mongoose')

module.exports = new mongoose.Schema({

    //管理员账号
    username: String,
    //密码
    password: String,

})
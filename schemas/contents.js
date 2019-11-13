const mongoose = require('mongoose')
//导入时间格式化插件
const localDate = require('../plugin/dateFormat')

//文章内容表结构
module.exports = new mongoose.Schema({

    //关联字段-内容分类ID
    category:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Category'
    },

    //关联字段-用户ID
    user: {
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'User'
    },

    //内容标题
    title:String,
    //简介
    description:{
        type: String,
        default:''
    },
    //内容
    content:{
        type:String,
        default: ''
    },
    //添加时间
    addTime:{
        type:String,
        default: localDate
    },
    //阅读量
    views:{
        type:Number,
        default:''
    },
    //评论
    comments:{
        type:Array,
        default:[]
    }
})


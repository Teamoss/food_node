const express = require('express')
const router = express.Router()
const Comment = require('../models/Comment')


//定义统一返回格式
const resData = {}

//查询店铺所有评论
// router.post('/findAllFood', (req, res, next) => {
//
//     const {business, pageSize, pageNo} = req.body
//
//     if (!pageSize || !pageNo) {
//         resData.code = 2001
//         resData.message = '服务器出小差了，请稍后重试~~~'
//         res.json(resData)
//         return
//     }
//     //越过数据库条数
//     let skip = (pageNo - 1) * pageSize
//     if (business) {
//         //降序排序sort
//         Food.find({
//             business
//         }).sort({_id: -1}).limit(pageSize).skip(skip).then(foodData => {
//             if (!foodData) {
//                 resData.code = 2001
//                 resData.message = '服务器出小差了，请稍后重试~~~'
//                 res.json(resData)
//                 return
//             }
//             Food.countDocuments({
//                 business
//             }).then(count => {
//                 let total = count
//                 resData.code = 2000
//                 resData.message = '查询成功'
//                 resData.data = foodData
//                 resData.total = total
//                 res.json(resData)
//             })
//         })
//     } else {
//         resData.code = 2001
//         resData.message = '查询出错，请重试登录~~'
//         res.json(resData)
//     }
// })



//用户评论
router.post('/addComment', function (req, res, next) {

    // const {imageUrl, business} = req.body

    // if (!business) {
    //     resData.code = 2001
    //     resData.message = '服务器出错，请重新登录~~~~~~'
    //     res.json(resData)
    //     return
    // }
    //
    // new Food({
    //     business,
    //     name,
    //     description,
    //     price,
    //     imageUrl
    // }).save().then(isSaveSuccess => {
    //
    //     if (!isSaveSuccess) {
    //         resData.code = 2001
    //         resData.message = '服务器出差了，请重试'
    //         res.json(resData)
    //         return
    //     }
    //
    //     resData.code = 2000
    //     resData.message = '添加成功'
    //     res.json(resData)
    // })
})



module.exports = router
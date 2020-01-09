const express = require('express')
const router = express.Router()
const Comment = require('../models/Comment')
const Order = require('../models/Order')
const Business = require('../models/Business')


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


//修改评论
router.post('/editComment', (req, res, next) => {

    const {score, oldscore, commentId, comment, commentTime, business} = req.body
    Comment.update({
        _id: commentId
    }, {
        score,
        comment,
        commentTime,
    }).then(updateSuccess => {

        //更新商家评分
        Business.findOne({
            _id: business
        }).then(businessInfo => {
            let _score = parseFloat((businessInfo.commentNumber * businessInfo.score - oldscore + score) / (businessInfo.commentNumber)).toFixed(1)
            Business.update({
                _id: business
            }, {
                score: _score
            }).then(updateSuccess => {

            })
        })

        if (!updateSuccess) {
            resData.code = 2001
            resData.message = '修改失败'
            res.json(resData)
            return
        }
        resData.code = 2000
        resData.message = '修改成功'
        res.json(resData)
    })

})


//查找用户评论
router.post('/findComment', (req, res, next) => {

    const {id} = req.body
    Comment.findOne({
        order: id,
    }).then(comment => {
        if (!comment) {
            resData.code = 2001
            resData.message = '评论不存在'
            res.json(resData)
            return
        }
        resData.code = 2000
        resData.message = 'success'
        resData.data = comment
        res.json(resData)
    })

})


//添加用户评论
router.post('/addComment', function (req, res, next) {

    const {score, openid, userInfo, business, order, comment, commentTime} = req.body

    let user = JSON.stringify(userInfo)


    new Comment({
        business,
        order,
        openid,
        userInfo: user,
        comment,
        commentTime,
        score
    }).save().then(isSaveSuccess => {

        if (!isSaveSuccess) {
            resData.code = 2001
            resData.message = '服务器出差了，请重试'
            res.json(resData)
            return
        }

        //更新商家评论数量和评分
        Business.findOne({
            _id: business
        }).then(businessInfo => {
            let commentNumber = businessInfo.commentNumber
            let _score = parseFloat((commentNumber * businessInfo.score + score) / (commentNumber + 1)).toFixed(1)
            Business.update({
                _id: business
            }, {
                commentNumber: commentNumber + 1,
                score: _score
            }).then(updateSuccess => {

                //更新订单状态
                Order.update({
                    _id: order
                }, {
                    commentStatus: 1,
                }).then(updateSuccess => {

                    resData.code = 2000
                    resData.message = '评论成功'
                    resData.data = isSaveSuccess
                    res.json(resData)
                })
            })
        })
    })

})


module.exports = router
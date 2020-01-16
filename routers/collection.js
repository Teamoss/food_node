const express = require('express')
const router = express.Router()
const Collection = require('../models/Collection')
const util = require('../plugin/dateFormat')
const host = require('../config/host')


//定义统一返回格式
const resData = {}

//查询用户收藏
router.post('/findAllCollection', (req, res, next) => {

    const {openid, pageSize, pageNo} = req.body

    //越过数据库条数
    let skip = (pageNo - 1) * pageSize
    //降序排序sort
    Collection.find({
        openid
    }).populate({
        path: 'business'
    }).sort({_id: -1}).limit(pageSize).skip(skip).then(data => {
        if (!data) {
            resData.code = 2001
            resData.message = '服务器出小差了，请稍后重试~~~'
            res.json(resData)
            return
        }

        data && data.length > 0 && data.forEach((item, index) => {
            item.business['logo'] = host + item.business.logo
            item.business['swiper'] = host + item.business.swiper
        })

        Collection.countDocuments({
            openid
        }).then(count => {
            let total = count
            resData.code = 2000
            resData.message = '查询成功'
            resData.data = data
            resData.total = total
            res.json(resData)
        })
    })

})


// 添加收藏
router.post('/addCollection', (req, res, next) => {

    const {openid, business} = req.body
    let addTime = util.formatTime(new Date())

    new Collection({
        openid,
        business,
        addTime
    }).save().then(isSaveSuccess => {

        if (!isSaveSuccess) {
            resData.code = 2001
            resData.message = '服务器出差了，请重试'
            res.json(resData)
            return
        }
        resData.code = 2000
        resData.message = '收藏成功'
        resData.data = isSaveSuccess
        res.json(resData)
    })
})

//取消收藏
router.post('/deleteCollection', function (req, res, next) {

    const {openid, business} = req.body

    Collection.deleteOne({
        openid,
        business
    }).then(deleteSuccess => {
        if (!deleteSuccess) {
            resData.code = 2001
            resData.message = '服务器繁忙，请稍后重试~~~~~'
            res.json(resData)
            return
        }
        resData.code = 2000
        resData.message = '取消成功'
        res.json(resData)
    })
})


//查询店铺收藏状态
router.post('/collection', (req, res, next) => {

    const {business, openid} = req.body

    Collection.findOne({
        openid,
        business
    }).then(data => {
        if (!data) {
            resData.code = 2001
            resData.data = data
            res.json(resData)
            return
        }
        resData.code = 2000
        resData.data = data
        res.json(resData)
    })

})


module.exports = router
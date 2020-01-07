const express = require('express')
const router = express.Router()
const Order = require('../models/Order')

//定义统一返回格式
const resData = {}

//查询商家所有订单
router.post('/findAllBusinessOrder', (req, res, next) => {

    //type 0:未接单  1.已接单  2:已送达
    const {type, business, pageSize, pageNo} = req.body

    if (!pageSize || !pageNo) {
        resData.code = 2001
        resData.message = '服务器出小差了，请稍后重试~~~'
        res.json(resData)
        return
    }
    //越过数据库条数
    let skip = (pageNo - 1) * pageSize
    if (business) {
        //降序排序sort
        Order.find({
            business,
            status: type
        }).sort({_id: -1}).limit(pageSize).skip(skip).then(orderData => {
            if (!orderData) {
                resData.code = 2001
                resData.message = '服务器出小差了，请稍后重试~~~'
                res.json(resData)
                return
            }

            Order.countDocuments({
                business,
                status: type
            }).then(count => {
                let total = count
                resData.code = 2000
                resData.message = '查询成功'
                resData.data = orderData
                resData.total = total
                res.json(resData)
            })
        })
    } else {
        resData.code = 2001
        resData.message = '查询出错，请重试登录~~'
        res.json(resData)
    }
})

//订单状态改变
router.post('/changeOrder', (req, res, next) => {

    //type: 1 商家接单 2 订单已完成/送达
    const {id, type} = req.body

    Order.update({
        _id: id
    }, {
        status: type,
    }).then(updateSuccess => {
        if (!updateSuccess) {
            resData.code = 2001
            resData.message = '接单失败，请稍后重试'
            res.json(resData)
            return
        }
        resData.code = 2000
        resData.message = '接单成功'
        res.json(resData)
    })
})

//查询用户所有订单
router.post('/findAllOrder', (req, res, next) => {

    const {openid, pageSize, pageNo} = req.body

    if (!pageSize || !pageNo) {
        resData.code = 2001
        resData.message = '服务器出小差了，请稍后重试~~~'
        res.json(resData)
        return
    }
    //越过数据库条数
    let skip = (pageNo - 1) * pageSize
    if (openid) {
        //降序排序sort
        Order.find({
            openid
        }).populate({
            path: 'business'
        }).sort({_id: -1}).limit(pageSize).skip(skip).then(orderData => {
            if (!orderData) {
                resData.code = 2001
                resData.message = '服务器出小差了，请稍后重试~~~'
                res.json(resData)
                return
            }

            Order.countDocuments({
                openid
            }).then(count => {
                let total = count
                resData.code = 2000
                resData.message = '查询成功'
                resData.data = orderData
                resData.total = total
                res.json(resData)
            })
        })
    } else {
        resData.code = 2001
        resData.message = '查询出错，请重试登录~~'
        res.json(resData)
    }
})


//用户下单
router.post('/sendOrder', (req, res, next) => {

    const {businessId, orderList, orderTime, time, sumMoney} = req.body
    const {openid, name, address, phone, gender} = req.body.address
    let food = JSON.stringify(orderList)

    if (!openid || !businessId) {
        resData.code = 2001
        resData.message = '服务器出错，请重新登录~~~~~~'
        res.json(resData)
        return
    }
    new Order({
        business: businessId,
        openid,
        name,
        address,
        phone,
        gender,
        food,
        orderTime,
        sendTime: time,
        sumMoney,
    }).save().then(saveInfo => {

        if (!res) {
            resData.code = 2001
            resData.message = '服务器出差了，请重试'
            res.json(resData)
            return
        }
        let obj = {}
        obj['id'] = saveInfo._id
        obj['sumMoney'] = saveInfo.sumMoney
        resData.code = 2000
        resData.message = '保存成功'
        resData.data = obj
        res.json(resData)
    })

})

module.exports = router
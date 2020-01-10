const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const Business = require('../models/Business')

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
    const {id, type, finishTime} = req.body

    Order.update({
        _id: id
    }, {
        status: type,
        finishTime
    }).then(updateSuccess => {
        if (!updateSuccess) {
            resData.code = 2001
            resData.message = '服务器繁忙,请稍后重启'
            res.json(resData)
            return
        }
        resData.code = 2000
        resData.message = 'success'
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
        food:orderList,
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

        //添加商家销量
        Business.findOne({
            _id: businessId
        }).then(businessInfo => {
            Business.update({
                _id: businessId
            }, {
                saleNumber: businessInfo.saleNumber + 1,
            }).then(updateSuccess => {

            })
        })

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
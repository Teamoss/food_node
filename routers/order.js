const express = require('express')
const router = express.Router()
const Order = require('../models/Order')

//定义统一返回格式
const resData = {}

//用户下单
router.post('/sendOrder', (req, res, next) => {

    let data = req.body
    let business = data.businessId
    let openid = data.address.openid
    let name = data.address.name
    let address = data.address.address
    let phone = data.address.phone
    let gender = data.address.gender
    let food = JSON.stringify(data.orderList)
    let orderTime = data.orderTime
    let sendTime = data.time
    let sumMoney = data.sumMoney

    if (!openid || !business) {
        resData.code = 2001
        resData.message = '服务器出错，请重新登录~~~~~~'
        res.json(resData)
        return
    }

    new Order({
        business,
        openid,
        name,
        address,
        phone,
        gender,
        food,
        orderTime,
        sendTime,
        sumMoney
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
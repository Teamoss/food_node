const express = require('express')
const router = express.Router()
const Address = require('../models/Address')


//定义统一返回格式
const resData = {}


//获取用户收货地址
router.post('/getUserAddress', (req, res, next) => {

    let user = req.body.id.toString()
    Address.findOne({
        user,
    }).then(address => {
        if (!address) {
            resData.code = 2000
            resData.message = '暂无地址'
            resData.data=[]
            res.json(resData)
            return
        }
        resData.code = 2000
        resData.message = 'success'
        resData.data = address
        res.json(resData)
    })
})

//编辑商家信息
router.post('/editBusinessMessage', (req, res, next) => {

    let data = req.body
    let id = data.userID
    let logo = data.imageUrl
    let swiper = data.swiper
    let business = data.form.name
    let content = data.form.message
    let address = data.addressMess

    if (!business || !logo || !content || !address) {
        resData.code = 2001
        resData.message = '请填写完整信息'
        res.json(resData)
        return
    }
    Business.update({
        _id: id
    }, {
        logo,
        swiper,
        business,
        content,
        address
    }).then(updateSuccess => {
        if (!updateSuccess) {
            resData.code = 2001
            resData.message = '更新失败'
            res.json(resData)
            return
        }
        resData.code = 2000
        resData.message = '更新成功'
        res.json(resData)
    })
})


module.exports = router
const express = require('express')
const router = express.Router()
const Address = require('../models/Address')

//定义统一返回格式
const resData = {}

//获取用户收货地址
router.post('/getUserAddress', (req, res, next) => {

    const {id} = req.body

    Address.find({
        openid: id,
    }).sort({_id: -1}).then(address => {
        if (!address) {
            resData.code = 2000
            resData.message = '暂无地址'
            resData.data = []
            res.json(resData)
            return
        }
        resData.code = 2000
        resData.message = 'success'
        resData.data = address
        res.json(resData)
    })
})

//添加收货地址
router.post('/addUserAddress', function (req, res, next) {

    const {openid, addr, phone, name, gender} = req.body

    if (!openid) {
        resData.code = 2001
        resData.message = '服务器出错，请重新登录~~~~~~'
        res.json(resData)
        return
    }

    new Address({
        openid,
        name,
        address: addr,
        phone,
        gender
    }).save().then(isSaveSuccess => {

        if (!isSaveSuccess) {
            resData.code = 2001
            resData.message = '服务器出差了，请重试'
            res.json(resData)
            return
        }
        resData.code = 2000
        resData.message = '保存成功'
        res.json(resData)
    })
})

//编辑收货地址
router.post('/editUserAddress', (req, res, next) => {

    const {id, address, phone, name, gender} = req.body

    Address.update({
        _id: id
    }, {
        address,
        phone,
        name,
        gender
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


//删除收货地址
router.post('/deleteUserAddress', function (req, res, next) {

    const {id} = req.body

    Address.deleteOne({
        _id: id
    }).then(deleteSuccess => {
        if (!deleteSuccess) {
            resData.code = 2001
            resData.message = '服务器繁忙，请稍后重试~~~~~'
            res.json(resData)
            return
        }
        resData.code = 2000
        resData.message = '删除成功'
        res.json(resData)
    })
})


module.exports = router
const express = require('express')
const router = express.Router()
const User = require('../models/User')

//定义统一返回格式
const resData = {}

//用户登录
router.post('/userLogin', (req, res, next) => {

    let openid = req.body.openid

    User.findOne({
        openid,
    }).then(userInfo => {
        if (!userInfo) {
            resData.code = 2001
            resData.message = '用户未注册'
            res.json(resData)
            return
        }
        resData.code = 2000
        resData.message = '登录成功'
        res.json(resData)
    })
})

//用户注册
router.post('/userRegister', (req, res, next) => {

    let data = req.body
    let openid = data.openid
    let nickName = data.userInfo.nickName
    let avatarUrl = data.userInfo.avatarUrl
    let gender = data.userInfo.gender
    let city = data.userInfo.city
    let province = data.userInfo.province

    let user = new User({
        openid,
        nickName,
        avatarUrl,
        gender,
        city,
        province
    })

    user.save().then(saveSuccess => {
        if (!saveSuccess) {
            resData.code = 2001
            resData.message = '用户信息保存失败'
            res.json(resData)
            return
        }
        resData.code = 2000
        resData.message = '用户信息保存成功'
        res.json(resData)
    })

})

module.exports = router
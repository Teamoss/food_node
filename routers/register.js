const express = require('express')
const router = express.Router()
const Business = require('../models/Business')

//定义统一返回格式
const resData = {}

//商家注册
router.post('/register', (req, res, next) => {

    let username = req.body.username
    let password = req.body.password

    if (username === '') {
        resData.code = 2001
        resData.message = '注册账号不能为空'
        res.json(resData)
        return
    }
    if (password === '') {
        resData.code = 2001
        resData.message = '注册密码不能为空'
        res.json(resData)
        return
    }

    //判断商家是否已被注册
    Business.findOne({
        username: username
    }).then(userInfo => {
        if (userInfo) {
            resData.code = 2001
            resData.message = '该账户已被注册'
            return res.json(resData)
        }
        //商家未被注册则将数据保存到数据库
        let business = new Business({
            username: username,
            password: password
        })
        return business.save()
    }).then(newUserInfo => {

        if (!newUserInfo) {
            resData.message = '服务器繁忙。。。'
            res.json(resData)
            return
        }
        resData.code = 2000
        resData.message = '注册成功'
        res.json(resData)
    })

})

module.exports = router
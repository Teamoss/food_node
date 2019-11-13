const express = require('express')
const router = express.Router()
const Business = require('../models/Business')

//定义统一返回格式
const resData = {}

//商家登录
router.post('/login', (req, res, next) => {

    //获取用户提交过来登录信息
    let username = req.body.username
    let password = req.body.password

    if (username === '') {
        resData.code = 2001
        resData.message = '用户名不能为空'
        res.json(resData)
        return
    }
    if (password === '') {
        res.code = 2001
        resData.message = '密码不能为空'
        res.json(resData)
        return
    }

    Business.findOne({
        username,
        password,
    }).then(userInfo => {
        if (!userInfo) {
            resData.code = 2001
            resData.message = '账号与密码不匹配'
            res.json(resData)
            return
        }
        resData.code = 2000
        resData.message = '登录成功'
        resData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        }
        res.json(resData)
    })
})

module.exports = router
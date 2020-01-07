const express = require('express')
const router = express.Router()
const Business = require('../models/Business')

//定义统一返回格式
const resData = {}

//商家登录
router.post('/login', (req, res, next) => {

    const {username, password} = req.body

    if (username === '') {
        resData.code = 2001
        resData.message = '账号不能为空'
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
        //用户存在则设置session记录登录状态
        // req.session.userInfo = userInfo

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
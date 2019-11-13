const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Content = require('../models/Content')
const dateFormat = require('../plugin/dateFormat')

//定义统一返回格式
const resData = {}


//用户注册
router.post('/user/register', (req, res, next) => {

    //获取用户提交过来注册信息
    var username = req.body.username
    var password = req.body.password
    var repassword = req.body.repassword

    if (username === '') {
        resData.code = 1
        resData.message = '用户名不能为空'
        res.json(resData)
        return
    }
    if (password === '') {
        resData.code = 2
        resData.message = '密码不能为空'
        res.json(resData)
        return
    }
    if (password !== repassword) {
        resData.code = 3
        resData.message = '两次密码不一致'
        res.json(resData)
        return
    }
    //判断用户是否已被注册
    User.findOne({
        username: username
    }).then(userInfo => {
        if (userInfo) {
            resData.code = 4
            resData.message = '该账户已被注册'
            res.json(resData)
            return
        }

        //对密码进行md5加密
        password = md5(md5(password))

        //用户未被注册则将数据保存到数据库
        var user = new User({
            username: username,
            password: password
        })
        return user.save()
    }).then(newUserInfo => {
        if (!newUserInfo) {
            resData.message = '服务器繁忙。。。'
            res.json(resData)
            return
        }
        resData.code = 5
        resData.message = '注册成功'
        res.json(resData)
        return
    })

})

//用户登录
router.post('/user/login', (req, res, next) => {

    //获取用户提交过来登录信息
    var username = req.body.username
    var password = req.body.password

    if (username === '') {
        resData.code = 1
        resData.message = '用户名不能为空'
        res.json(resData)
        return
    }
    if (password === '') {
        resData.code = 2
        resData.message = '密码不能为空'
        res.json(resData)
        return
    }

    User.findOne({
        username: username,
        password: md5(md5(password))
    }).then(userInfo => {
        if (!userInfo) {
            resData.code = 3
            resData.message = '账号与密码不匹配'
            res.json(resData)
            return
        }

        //用户存在则设置session记录登录状态
        req.session.userInfo = userInfo

        resData.code = 5
        resData.message = '登录成功'
        resData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        }
        res.json(resData)
        return
    })
})

//用户退出登录
router.get('/user/logout', (req, res, next) => {

    //清除用户session
    req.session.userInfo = null
    resData.code = 6
    res.json(resData)
    return
})

//获取指定文章所有评论
router.get('/comment', function (req, res, next) {

    var contentId = req.query.content || ''
    Content.findOne({
        _id: contentId
    }).then(contentInfo => {
        resData.data = contentInfo
        res.json(resData)
    })
})


//用户提交评论
router.post('/comment', function (req, res, next) {

    //获取评论文章ID
    var contentId = req.body.contentId || ''

    var postData = {
        username: req.session.userInfo.username,
        postTime: dateFormat(),
        comment: req.body.comment
    }

    Content.findOne({
        _id: contentId
    }).then(content => {
        content.comments.unshift(postData)
        return content.save()

    }).then(postCommentSuccess => {

        if (!postCommentSuccess) {
            resData.code = 3
            resData.message = '评论失败'
            res.json(resData)
            return
        }
        resData.code = 5
        resData.message = '评论成功'
        resData.data = postCommentSuccess
        res.json(resData)
        return
    })

})

module.exports = router
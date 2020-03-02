const express = require('express')
const router = express.Router()
const Admin = require('../models/Admin')
const Business = require('../models/Business')
const host = require('../config/host')
//定义统一返回格式
const resData = {}

//管理员登录
router.post('/adminLogin', (req, res, next) => {

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

    Admin.findOne({
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

//管理员注册
router.post('/adminRegister', (req, res, next) => {

    const {username,password} = req.body

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

    //判断账号是否已被注册
    Admin.findOne({
        username
    }).then(userInfo => {
        if (userInfo) {
            resData.code = 2001
            resData.message = '该账户已被注册'
            return res.json(resData)
        }
        //商家未被注册则将数据保存到数据库
        let admin = new Admin({
            username,
            password
        })
        return admin.save()
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

//查询所有商家
router.post('/adminBusiness', (req, res, next) => {

    const {pageSize, pageNo} = req.body

    if (!pageSize || !pageNo) {
        resData.code = 2001
        resData.message = '服务器出小差了，请稍后重试~~~'
        res.json(resData)
        return
    }
    //越过数据库条数
    let skip = (pageNo - 1) * pageSize
        Business.find({},{username:0,password:0}).sort({_id: -1}).limit(pageSize).skip(skip).then(data => {
            if (!data) {
                resData.code = 2001
                resData.message = '服务器出小差了，请稍后重试~~~'
                res.json(resData)
                return
            }
            data && data.forEach(item => {
                let addr = ''
                item['logo'] = host + item.logo
                item['swiper'] = host + item.swiper
                item.city.forEach(item => {
                    addr += item
                })
                item.address = item.address ? addr + item.address : addr
            })
            Business.countDocuments().then(count => {
                let total = count
                resData.code = 2000
                resData.message = '查询成功'
                resData.data = data
                resData.total = total
                res.json(resData)
            })
        })

})

//删除商家
router.post('/deleteBusiness', function (req, res, next) {

    const {id} = req.body

    Business.deleteOne({
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
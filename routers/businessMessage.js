const express = require('express')
const router = express.Router()
const Business = require('../models/Business')
const formidable = require("formidable")
const path = require('path')
const host = require('../config/host')

//定义统一返回格式
const resData = {}

//获取商家信息
router.post('/getBusinessMessage', (req, res, next) => {

    let _id = req.body.userID
    Business.findOne({
        _id,
    }).then(userInfo => {
        resData.code = 2000
        resData.message = '登录成功'
        resData.userInfo = userInfo
        res.json(resData)
    })
})

//编辑商家信息
router.post('/editBusinessMessage', (req, res, next) => {
    // let _id = req.body.userID
    // Business.findOne({
    //     _id,
    // }).then(userInfo => {
    //     resData.code = 2000
    //     resData.message = '登录成功'
    //     resData.userInfo = userInfo
    //     res.json(resData)
    // })
})

//上传商家Logo
router.post('/uploadLogo', (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = path.join(__dirname, '../public/logo');
    form.keepExtensions = true; //保留后缀
    //处理图片
    form.parse(req, function (err, fields, files) {
        let path = files.file.path.split('food_node')[1]
        let url = host + path
        resData.code = 2000
        resData.message = '上传成功'
        resData.logo = url
        res.json(resData)
    })
})

module.exports = router
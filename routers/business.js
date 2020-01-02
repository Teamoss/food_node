const express = require('express')
const router = express.Router()
const Business = require('../models/Business')
const formidable = require("formidable")
const path = require('path')
const host = require('../config/host')

//定义统一返回格式
const resData = {}

//查询所有商家
router.post('/findAllBusiness', (req, res, next) => {
    let data = req.body
    let pageSize = data.pageSize
    let pageNo = data.pageNo
    if (!pageSize || !pageNo) {
        resData.code = 2001
        resData.message = '服务器出小差了，请稍后重试~~~'
        res.json(resData)
        return
    }
    //越过数据库条数
    let skip = (pageNo - 1) * pageSize

    //降序排序sort
    Business.find().sort({_id: -1}).limit(pageSize).skip(skip).then(data => {
        if (!data) {
            resData.code = 2001
            resData.message = '服务器出小差了，请稍后重试~~~'
            res.json(resData)
            return
        }
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

//上传商家Logo
router.post('/uploadLogo', (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = path.join(__dirname, '../public/logo');
    form.keepExtensions = true; //保留后缀
    //处理图片
    form.parse(req, function (err, fields, files) {
        let path = files.file.path.split('food_node')[1]
        let formPath = path.replace(/\\/g, '/')
        let url = host + formPath
        resData.code = 2000
        resData.message = '上传成功'
        resData.logo = url
        res.json(resData)
    })
})

//上传商家图片
router.post('/uploadSwiper', (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = path.join(__dirname, '../public/swiper');
    form.keepExtensions = true; //保留后缀
    //处理图片
    form.parse(req, function (err, fields, files) {
        let path = files.file.path.split('food_node')[1]
        let formPath = path.replace(/\\/g, '/')
        let url = host + formPath
        resData.code = 2000
        resData.message = '上传成功'
        resData.swiper = url
        res.json(resData)
    })
})

module.exports = router
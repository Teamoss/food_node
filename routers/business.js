const express = require('express')
const router = express.Router()
const Business = require('../models/Business')
const formidable = require("formidable")
const path = require('path')
const host = require('../config/host')

//定义统一返回格式
const resData = {}

//搜素商家
router.post('/searchBusiness', (req, res, next) => {

    //key为搜素key cityKey为城市定位key
    const {key, cityKey} = req.body

    //降序排序sort  模糊查询
    Business.find({
        $or: [{'business': {'$regex': key.toString(), $options: '$i'}}]
    }).sort({_id: -1}).then(data => {
        if (!data) {
            resData.code = 2001
            resData.message = '服务器出小差了，请稍后重试~~~'
            res.json(resData)
            return
        }

        let arr = []
        data && data.forEach(item => {
            if (item.city && item.city.includes(cityKey)) {
                let addr = ''
                item['logo'] = host + item.logo
                item['swiper'] = host + item.swiper
                item.city.forEach(item => {
                    addr += item
                })
                item['address'] = item.address ? addr + item.address : addr
                arr.push(item)
            }
        })

        resData.code = 2000
        resData.message = '查询成功'
        resData.data = arr
        resData.total = arr.length
        res.json(resData)
        
    })

})

//查询所有商家
router.post('/findAllBusiness', (req, res, next) => {

    const {pageSize, pageNo, type, cityKey} = req.body

    if (!pageSize || !pageNo) {
        resData.code = 2001
        resData.message = '服务器出小差了，请稍后重试~~~'
        res.json(resData)
        return
    }
    //越过数据库条数
    let skip = (pageNo - 1) * pageSize

    //降序排序sort
    if (type == 1) {
        Business.find({
            $or: [{'city': {$regex: cityKey, $options: '$i'}}]
        }, {username: 0, password: 0}).sort({_id: -1}).limit(pageSize).skip(skip).then(data => {
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
            console.log(data)
            Business.countDocuments().then(count => {
                let total = count
                resData.code = 2000
                resData.message = '查询成功'
                resData.data = data
                resData.total = total
                res.json(resData)
            })
        })
    }
    //销量降序排序
    if (type == 2) {
        Business.find({
            $or: [{'city': {$regex: cityKey, $options: '$i'}}]
        }, {username: 0, password: 0}).sort({saleNumber: -1}).limit(pageSize).skip(skip).then(data => {
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
    }
    //好评优先降序排序
    if (type == 3) {
        Business.find({
            $or: [{'city': {$regex: cityKey, $options: '$i'}}]
        }, {username: 0, password: 0}).sort({score: -1}).limit(pageSize).skip(skip).then(data => {
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
    }

})


//获取商家信息
router.post('/getBusinessMessage', (req, res, next) => {

    const {userID} = req.body
    Business.findOne({
        _id: userID,
    }, {username: 0, password: 0}).then(userInfo => {
        if (userInfo) {
            userInfo['logo'] = host + userInfo.logo
            userInfo['swiper'] = host + userInfo.swiper
        }
        console.log(userInfo)
        resData.code = 2000
        resData.message = '登录成功'
        resData.userInfo = userInfo
        res.json(resData)
    })
})

//编辑商家信息
router.post('/editBusinessMessage', (req, res, next) => {

    const {userID, imageUrl, swiper, city} = req.body
    const {name, message, phone, address} = req.body.form
    let url = imageUrl ? imageUrl.split('/public')[1] : null
    let urlSwiper = swiper ? swiper.split('/public')[1] : null
    let logo = `/public${url}`
    let _swiper = `/public${urlSwiper}`

    Business.update({
        _id: userID
    }, {
        logo,
        swiper: _swiper,
        phone,
        business: name,
        content: message,
        address,
        city
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
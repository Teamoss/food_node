const express = require('express')
const router = express.Router()
const Food = require('../models/Food')
const formidable = require("formidable")
const path = require('path')
const host = require('../config/host')

//定义统一返回格式
const resData = {}

//查询店铺所有菜单
router.post('/findAllFood', (req, res, next) => {

    const {business, pageSize, pageNo} = req.body

    if (!pageSize || !pageNo) {
        resData.code = 2001
        resData.message = '服务器出小差了，请稍后重试~~~'
        res.json(resData)
        return
    }
    //越过数据库条数
    let skip = (pageNo - 1) * pageSize
    if (business) {
        //降序排序sort
        Food.find({
            business
        }).sort({_id: -1}).limit(pageSize).skip(skip).then(foodData => {
            if (!foodData) {
                resData.code = 2001
                resData.message = '服务器出小差了，请稍后重试~~~'
                res.json(resData)
                return
            }
            foodData && foodData.forEach(item => {
                item['imageUrl'] = host + item.imageUrl
            })
            Food.countDocuments({
                business
            }).then(count => {
                let total = count
                resData.code = 2000
                resData.message = '查询成功'
                resData.data = foodData
                resData.total = total
                res.json(resData)
            })
        })
    } else {
        resData.code = 2001
        resData.message = '查询出错，请重试登录~~'
        res.json(resData)
    }
})

//编辑菜单
router.post('/editFood', (req, res, next) => {

    const {imageUrl} = req.body
    const {name, description, price, _id} = req.body.form
    let url = imageUrl ? imageUrl.split('/public')[1] : null
    let foodUrl = `/public${url}`

    if (!name || !description || !imageUrl || !price) {
        resData.code = 2001
        resData.message = '请填写完整信息'
        res.json(resData)
        return
    }
    Food.update({
        _id
    }, {
        name,
        description,
        imageUrl: foodUrl,
        price
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

//删除菜单
router.post('/deleteFood', function (req, res, next) {

    const {id} = req.body

    Food.deleteOne({
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


//添加菜单
router.post('/addFood', function (req, res, next) {

    const {imageUrl, business} = req.body
    const {name, description, price} = req.body.form
    let url = imageUrl ? imageUrl.split('/public')[1] : null
    let foodUrl = `/public${url}`

    if (!name || !description || !price || !imageUrl) {
        resData.code = 2001
        resData.message = '请填写完整信息'
        res.json(resData)
        return
    }

    if (!business) {
        resData.code = 2001
        resData.message = '服务器出错，请重新登录~~~~~~'
        res.json(resData)
        return
    }

    new Food({
        business,
        name,
        description,
        price,
        imageUrl: foodUrl
    }).save().then(isSaveSuccess => {

        if (!isSaveSuccess) {
            resData.code = 2001
            resData.message = '服务器出差了，请重试'
            res.json(resData)
            return
        }

        resData.code = 2000
        resData.message = '添加成功'
        res.json(resData)
    })
})

//上传菜单图片
router.post('/uploadFood', (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = path.join(__dirname, '../public/food');
    form.keepExtensions = true; //保留后缀
    //处理图片
    form.parse(req, function (err, fields, files) {
        let path = files.file.path.split('food_node')[1]
        let formPath = path.replace(/\\/g, '/')
        let url = host + formPath
        resData.code = 2000
        resData.message = '上传成功'
        resData.imageUrl = url
        res.json(resData)
    })
})

module.exports = router
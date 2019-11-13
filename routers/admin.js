const express = require('express')
const router = express.Router()
//导入表模型
const User = require('../models/User')
const Category = require('../models/category')
const Content = require('../models/Content')

//渲染后台首页
router.get('/', function (req, res, next) {

    //通过session判断用户是否为管理员
    if (!req.session.userInfo) {
        res.render('./404.html')
        return
    }
    if (!req.session.userInfo.isAdmin) {
        res.render('./404.html')
        return
    }

    res.render('./admin/index.html', {
        userInfo: req.session.userInfo
    })
})

//渲染用户管理页面
router.get('/user', function (req, res, next) {

    //通过session判断用户是否为管理员
    if (!req.session.userInfo) {
        res.render('./404.html')
        return
    }
    if (!req.session.userInfo.isAdmin) {
        res.render('./404.html')
        return
    }

    var page = Number(req.query.page || 1)  //获取用户传递过来页数
    var limit = 10  //每页显示10条数据
    var pages = 0   //总页数

    //获取用户总条数
    User.countDocuments().then(count => {

        //获取总页数
        pages = Math.ceil(count / limit)
        //最大页码不能超过总页数
        page = Math.min(page, pages)
        //最小页码不能小于1
        page = Math.max(page, 1)
        //越过数据库条数
        var skip = (page - 1) * limit

        //查询数据库降序排序 sort({_id:-1})
        User.find().sort({_id: -1}).limit(limit).skip(skip).then(userList => {
            res.render('./admin/user_index.html', {
                userInfo: req.session.userInfo,
                userList: userList,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            })
        })
    })

})

//删除用户
router.get('/user/delete', function (req, res, next) {

    //获取需要删除用户ID
    var id = req.query.id

    User.deleteOne({
        _id: id
    }).then(removeSuccess => {
        //删除失败
        if (!removeSuccess) {
            res.render('./admin/submitError.html', {
                userInfo: req.session.userInfo,
                message: '删除失败'
            })
            return
        }
        //删除成功
        res.render('./admin/submitSuccess.html', {
            userInfo: req.session.userInfo,
            message: '删除成功',
            url: '/admin/user'
        })
    })
})

//渲染分类管理页面
router.get('/category', function (req, res, next) {

    //通过session判断用户是否为管理员
    if (!req.session.userInfo) {
        res.render('./404.html')
        return
    }
    if (!req.session.userInfo.isAdmin) {
        res.render('./404.html')
        return
    }

    var page = Number(req.query.page || 1)  //获取页数
    var limit = 5  //每页显示5条数据
    var pages = 0   //总页数

    Category.countDocuments().then(count => {

        //获取总页数
        pages = Math.ceil(count / limit)
        //最大页码不能超过总页数
        page = Math.min(page, pages)
        //最小页码不能小于1
        page = Math.max(page, 1)
        //越过数据库条数
        var skip = (page - 1) * limit

        //查询数据库降序排序sort
        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(categoryList => {
            res.render('./admin/category_index.html', {
                userInfo: req.session.userInfo,
                categoryList: categoryList,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            })
        })
    })
})

//渲染分类添加页面
router.get('/category/add', function (req, res, next) {

    //通过session判断用户是否为管理员
    if (!req.session.userInfo) {
        res.render('./404.html')
        return
    }
    if (!req.session.userInfo.isAdmin) {
        res.render('./404.html')
        return
    }

    res.render('./admin/category_add.html', {
        userInfo: req.session.userInfo
    })

})

//处理分类添加
router.post('/category/add', function (req, res, next) {

    //获取需要添加分类名称
    var categoryName = req.body.name

    if (!categoryName) {
        res.render('./admin/submitError.html', {
            userInfo: req.session.userInfo,
            message: '分类名称不能为空'
        })
        return
    }

    //判断数据库中是否存在相同分类名称
    Category.findOne({
        categoryName: categoryName
    }).then(isHaveSameCategory => {
        if (isHaveSameCategory) {
            res.render('./admin/submitError.html', {
                userInfo: req.session.userInfo,
                message: '分类名称已存在'
            })
            return
        }
        //若不存在则保存数据
        return new Category({
            categoryName: categoryName
        }).save()

    }).then(isAddSuccess => {
        if (isAddSuccess) {
            res.render('./admin/submitSuccess.html', {
                userInfo: req.session.userInfo,
                message: '添加成功',
                url: '/admin/category'
            })
        }
    })
})

//渲染分类编辑页面
router.get('/category/edit', function (req, res, next) {

    //通过session判断用户是否为管理员
    if (!req.session.userInfo) {
        res.render('./404.html')
        return
    }
    if (!req.session.userInfo.isAdmin) {
        res.render('./404.html')
        return
    }

    var id = req.query.id

    Category.findOne({
        _id: id
    }).then(isCategory => {
        if (!isCategory) {
            res.render('./admin/submitError.html', {
                userInfo: req.session.userInfo,
                message: '分类信息不存在'
            })
            return
        } else {
            res.render('./admin/category_edit.html', {
                userInfo: req.session.userInfo,
                category: isCategory
            })
        }
    })
})

//处理分类编辑
router.post('/category/edit', function (req, res, next) {

    //获取当前编辑分类名称
    var category = req.body.categoryname || ''
    //获取需要编辑分类ID
    var id = req.query.id || ''

    //是否存在该分类名称
    Category.findOne({
        _id: id
    }).then(isHaveCategory => {
        if (!isHaveCategory) {
            res.render('./admin/submitError.html', {
                userInfo: req.session.userInfo,
                message: '分类信息不存在'
            })
            return
        } else {
            //若用户没有修改分类名称
            if (category == isHaveCategory.categoryName) {
                res.render('./admin/submitSuccess.html', {
                    userInfo: req.session.userInfo,
                    message: '修改成功'
                })
                return
            }
            //若用户修改了分类名称,判断是否已存在相同分类名称
            return Category.findOne({
                _id: {$ne: id},
                categoryName: category
            })
        }

    }).then(hasSameCategory => {
        //存在相同分类名称
        if (hasSameCategory) {
            res.render('./admin/submitError.html', {
                userInfo: req.session.userInfo,
                message: '分类名称已存在'
            })
            return
        }

        //不存在相同分类名称
        return Category.update({_id: id}, {categoryName: category})

    }).then(editCategorySuccess => {

        //编辑分类失败
        if (!editCategorySuccess) {
            res.render('./admin/submitError.html', {
                userInfo: req.session.userInfo,
                message: '服务器繁忙，请稍后再试'
            })
            return
        }
        //编辑分类成功
        res.render('./admin/submitSuccess.html', {
            userInfo: req.session.userInfo,
            message: '修改成功',
            url: '/admin/category'
        })

    })
})

//处理分类删除
router.get('/category/delete', function (req, res, next) {

    //获取需要删除分类ID
    var id = req.query.id || ''

    //判断是否存在该分类
    Category.findOne({
        _id: id
    }).then(isHaveCategory => {
        //若不存在该分类
        if (!isHaveCategory) {
            res.render('./admin/submitError.html', {
                userInfo: req.session.userInfo,
                message: '分类信息不存在'
            })
            return
        }
        //存在该分类则删除
        Category.deleteOne({
            _id: id
        }).then(removeCaregorySuccess => {

            //删除分类失败
            if (!removeCaregorySuccess) {
                res.render('./admin/submitError.html', {
                    userInfo: req.session.userInfo,
                    message: '服务器繁忙，请稍后重试。。'
                })
                return
            }
            //删除分类成功
            res.render('./admin/submitSuccess.html', {
                userInfo: req.session.userInfo,
                message: '删除成功',
                url: '/admin/category'
            })

        })

    })

})

//渲染内容管理页面
router.get('/content', function (req, res, next) {

    //通过session判断用户是否为管理员
    if (!req.session.userInfo) {
        res.render('./404.html')
        return
    }
    if (!req.session.userInfo.isAdmin) {
        res.render('./404.html')
        return
    }

    var page = Number(req.query.page || 1)  //获取页数
    var limit = 5  //每页显示5条数据
    var pages = 0   //总页数

    Content.countDocuments().then(count => {

        //获取总页数
        pages = Math.ceil(count / limit)
        //最大页码不能超过总页数
        page = Math.min(page, pages)
        //最小页码不能小于1
        page = Math.max(page, 1)
        //越过数据库条数
        var skip = (page - 1) * limit

        //查询数据库降序排序sort
        Content.find().sort({_id: -1}).populate(['category', 'user']).limit(limit).skip(skip).then(contentList => {

            res.render('./admin/content_index.html', {
                userInfo: req.session.userInfo,
                contentList: contentList,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            })
        })
    })

})

//渲染内容添加页面
router.get('/content/add', function (req, res, next) {

    //通过session判断用户是否为管理员
    if (!req.session.userInfo) {
        res.render('./404.html')
        return
    }
    if (!req.session.userInfo.isAdmin) {
        res.render('./404.html')
        return
    }

    //获取所有分类
    Category.find().sort({_id: -1}).then(category => {
        if (!category) {
            res.render('./admin/submitError.html', {
                userInfo: req.session.userInfo,
                message: '服务器繁忙，请稍后重试。。'
            })
            return
        }
        res.render('./admin/content_add.html', {
            userInfo: req.session.userInfo,
            category: category,
            message: '修改成功'
        })
    })
})

//处理内容添加
router.post('/content/add', function (req, res, next) {

    //校验用户传递过来内容
    if (!req.body.title) {
        res.render('./admin/submitError.html', {
            userInfo: req.session.userInfo,
            message: '标题不能为空'
        })
        return
    }
    if (!req.body.description) {
        res.render('./admin/submitError.html', {
            userInfo: req.session.userInfo,
            message: '简介不能为空'
        })
        return
    }
    if (!req.body.content) {
        res.render('./admin/submitError.html', {
            userInfo: req.session.userInfo,
            message: '内容不能为空'
        })
        return
    }

    //数据存储
    new Content({
        user: req.session.userInfo._id.toString(),
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).save().then(isSaveSuccess => {
        //数据存储失败
        if (!isSaveSuccess) {
            res.render('./admin/submitError.html', {
                userInfo: req.session.userInfo,
                message: '服务器繁忙，请稍后重试。。。'
            })
            return
        }
        //数据存储成功
        res.render('./admin/submitSuccess.html', {
            userInfo: req.session.userInfo,
            message: '提交成功',
            url: '/admin/content'
        })
        return
    })

})

//渲染内容编辑页面
router.get('/content/edit', function (req, res, next) {

    //通过session判断用户是否为管理员
    if (!req.session.userInfo) {
        res.render('./404.html')
        return
    }
    if (!req.session.userInfo.isAdmin) {
        res.render('./404.html')
        return
    }

    var id = req.query.id || ''

    //获取所有分类
    Category.find().then(category => {
        //获取数据库失败
        if (!category) {
            res.render('./admin/submitError.html', {
                userInfo: req.session.userInfo,
                message: '服务器繁忙，请稍后重试。。'
            })
            return
        }
        Content.findOne({
            _id: id
        }).populate('category').then(content => {
            //若不存在对应的内容
            if (!content) {
                res.render('./admin/submitError.html', {
                    userInfo: req.session.userInfo,
                    message: '服务器繁忙，请稍后重试。。'
                })
                return
            }
            res.render('./admin/content_edit.html', {
                userInfo: req.session.userInfo,
                categoryList: category,
                content: content,
                url: '/admin/content'
            })
        })
    })

})

//处理内容编辑
router.post('/content/edit', function (req, res, next) {

    //获取内容ID、分类ID、标题、简介、内容
    var id = req.query.id || ''
    var category = req.body.category
    var title = req.body.title
    var description = req.body.description
    var content = req.body.content

    //校验用户传递过来内容
    if (!req.body.category) {
        res.render('./admin/submitError.html', {
            userInfo: req.session.userInfo,
            message: '请填写分类'
        })
        return
    }
    if (!req.body.title) {
        res.render('./admin/submitError.html', {
            userInfo: req.session.userInfo,
            message: '请填写标题'
        })
        return
    }
    if (!req.body.description) {
        res.render('./admin/submitError.html', {
            userInfo: req.session.userInfo,
            message: '请填写简介'
        })
        return
    }
    if (!req.body.content) {
        res.render('./admin/submitError.html', {
            userInfo: req.session.userInfo,
            message: '请填写内容'
        })
        return
    }
    //校验通过更新数据
    Content.update({
        _id: id
    }, {
        category: category,
        title: title,
        description: description,
        content: content
    }).then(updateSuccess => {
        if (!updateSuccess) {
            res.render('./admin/submitError.html', {
                userInfo: req.session.userInfo,
                message: '更新失败'
            })
            return
        }
        //更新成功
        res.render('./admin/submitSuccess.html', {
            userInfo: req.session.userInfo,
            message: '更新成功',
            url: '/admin/content'
        })
    })
})

//处理内容删除
router.get('/content/delete', function (req, res, next) {

    //获取需要删除内容ID
    var id = req.query.id || 0

    Content.deleteOne({
        _id: id
    }).then(removeSuccess => {
        //删除失败
        if (!removeSuccess) {
            res.render('./admin/submitError.html', {
                userInfo: req.session.userInfo,
                message: '删除失败，请稍后重试。。'
            })
            return
        }
        //删除成功
        res.render('./admin/submitSuccess.html', {
            userInfo: req.session.userInfo,
            message: '删除成功',
            url: '/admin/content'
        })
    })
})


module.exports = router
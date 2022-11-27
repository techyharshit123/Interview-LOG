const express = require('express')
const router = express.Router();
const { ensureAuth } = require('../middleware/auth')

const Article = require('../models/Article')

// @desc        Add Article Page
// @route       GET /articles/add
router.get('/articles/add', ensureAuth, (req, res) => {
    res.status(200).render('articles/add', {
        title: 'Articles',
        user: req.user
    });
})

// @desc        Show Single Article Page
// @route       GET /articles/:id
router.get(`/articles/:id`, ensureAuth, async (req, res) => {
    try {
        let article = await Article.findById(req.params.id).populate('user').lean()
        if (!article)
            return res.render('error/404')

        res.render('articles/show', {
            article,
            user: req.user
        })
    } catch (err) {
        console.log(err)
        res.render('error/404')
    }
})

// @desc        Post Article
// @route       POST /articles
router.post('/articles', ensureAuth, async (req, res) => {

    let d = new Date(Date.now())
    d = d.toString();
    d = d.substring(0, d.length - 31);

    let article = new Article({
        user: req.user.id,
        title: req.body.title,
        author: req.body.author,
        body: req.body.body,
        time: d
    })
    try {
        article = await article.save()
        res.redirect('/dashboard')
    }
    catch (err) {
        console.log(err);
    }
})


// @desc        Edit page
// @route       GET /articles/edit/_id
router.get('/articles/edit/:id', ensureAuth, async (req, res) => {

    try {
        const article = await Article.findOne({ _id: req.params.id }).lean();

        if (!article)
            return res.render('error/404')
        if (article.user != req.user.id) {
            res.redirect('/')  // @todo
        }
        else {
            res.render('articles/edit', {
                article,
            })
        }
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }
})

// @desc        Update Article
// @route       PUT /articles/:id
router.put('/articles/:id', ensureAuth, async (req, res) => {
    try {
        let article = await Article.findById(req.params.id).lean()

        if (!article) {
            return res.render('error/404')
        }
        if (article.user != req.user.id) {
            res.redirect('/')
        } else {
            article = await Article.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true,
            })

            res.redirect('/')
        }
    } catch (err) {

        console.log(err)
        res.render('error/500')
    }
})

// @desc        Delete Article
// @route       DELETE /articles/:id
router.delete('/articles/:id', ensureAuth, async (req, res) => {
    try {
        await Article.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err)
        res.render('error/500')
    }
})

// @desc        Show User Articles
// @route       GET /articles/user/:userId
router.get('/articles/user/:userId', ensureAuth, async (req, res) => {
    try {
        let articles = await Article.find({ user: req.params.userId }).populate('user').lean();

        let userName = articles[0].author
        res.render('articles/userarticles', {
            articles,
            user: req.user,
            userName
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

module.exports = router;
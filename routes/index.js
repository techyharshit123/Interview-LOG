const express = require('express')
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Article = require('../models/Article')
const User = require('../models/User')

// @desc        Login/Landing Page
// @route       GET /
router.get('/', ensureAuth, async (req, res) => {

    try {
        res.render("home", {
            layout: "main",
        })

    } catch (err) {
        console.log(err)
    }
})

// @desc        All Articles
// @route       GET /all_articles
router.get('/all_articles', ensureAuth, async (req, res) => {

    try {
        const articles = await Article.find({}).populate('user').lean()
        const user = req.user
        res.render("all_articles", {
            layout: "main",
            articles,
            user
        })

    } catch (err) {
        console.log(err)
    }
})

// @desc        Dashboard Page
// @route       GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {

    try {
        const articles = await Article.find({ user: req.user.id }).lean()

        res.render("dashboard", {
            layout: "main",
            name: req.user.firstName,
            articles: articles
        })
    } catch (err) {
        console.log(err)
        res.render('error/500')
    }

})

// @desc        Login Page
// @route       GET /login
router.get('/login', ensureGuest, (req, res) => {
    res.render("loginpage", {
        layout: "login",
    })
})


module.exports = router
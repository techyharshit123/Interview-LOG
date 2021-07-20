const express = require('express')
const router = express.Router();
const passport = require('passport')

// @desc        Auth With Google
// @route       GET /auth/google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

// @desc        Google Callback
// @route       GET /auth/google/callback
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

// @desc        Logout User
// @route       GET /auth/logout
router.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = router
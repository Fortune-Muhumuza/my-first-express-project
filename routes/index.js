const express = require('express');
const User = require("./User");
const Tweet = require('./Tweet');
const bcrypt = require('bcryptjs');
const router = express.Router();
const mongoose = require('mongoose');
const session = require('express-session');
const { check, validationResult } = require('express-validator');


const authenticated = (req, res, next) => {
    if (req.session && req.session.user) return next();

    return res.redirect('/login');
}


router.get('/', (req, res) => {
    if (req.session && req.session.user) {
        Tweet.find({}, null, {sort: {created_at: -1}}, function (err, tweets) {
            res.render('index', { title: 'Home', tweets: tweets });
        });
    } else {
        res.render('welcome', { title: 'Welcome' });
    }

});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login page' });
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'Sign up page' });
});

router.get('/users.json', (req, res) => {
    User.find({}, (err, users) => {
        if (err) throw err;
        res.send(users);
    });
});

router.get('/tweet', authenticated, (req, res) => {
    res.render('tweet', { title: 'Tweet something' });
})

router.get('/me', authenticated, (req, res) => {
    res.render('me', { name: req.session.user.name });
});


router.post('/tweet', authenticated, (req, res) => {
    if (!req.body || !req.body.tweet) {
        return res.render('error', { error: 'no tweet found', title: 'error' });

    }
    Tweet.create({
        tweet: req.body.tweet,
        author: req.session.user._id
    }, (err, tweet) => {
        if (err) return res.render('error', { error: 'error creating tweet', title: 'error' });

        console.log('created tweet');
        res.redirect('/status/' + tweet._id);
    });
});

router.get('/status/:id', (req, res) => {
    Tweet.findOne({ _id: req.params.id }, (err, tweet) => {
        User.findOne({ _id: tweet.author }, (e, user) => {
            res.render('status', { name: user.name, content: tweet.tweet });
        })
    })
})

router.post("/login", async (req, res) => {
    var user = await User.findOne({ name: req.body.name }).exec();
    if (!user) {
        res.send('Sorry, username does not exist')
    }
    const correctPassword = user.comparePassword(req.body.password, user.password);
    if (!correctPassword) {
        res.send('wrong password');
    } else {
        req.session.user = user;
        req.session.save();
        console.log('logged is as: ' + user.name);
        res.redirect('/me');
    }

});

router.post('/logout', (req, res)=>{
    req.session.destroy();
})



router.post("/register", async (req, res) => {
    try {
        var user = new User({
            name: req.body.name,
            password: req.body.password
        });
        var result = await user.save();
        res.send(result);
        console.log(result);
    } catch (error) {
        res.send('error');
    }
});




module.exports = router;
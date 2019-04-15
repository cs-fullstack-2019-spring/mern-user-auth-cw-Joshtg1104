var express = require('express');
var router = express.Router();

var bCrypt = require('bcrypt-nodejs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
router.use(passport.initialize());
router.use(passport.session());
var Emails = require('../models/EmailSchema');
passport.serializeUser(function (user, done) {
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
    userCollection.findById(id, function (err, user) {
        done(err, user);
    });
});
var isValidPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password);
};
var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

router.get('/', (req, res) => {
    if (req.session.email) {
        res.send(req.session.email)
    } else {
        res.send(null)
    }
});
router.get('/logout', (req, res) => {
    if (req.session) {
        req.session = null;
        res.send('Logged Out');
    } else {
        res.send('Not Signed In')
    }
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        Emails.findOne({username: username}, function (err, user) {
            if (err) {
                console.log('1');
                return done(err);
            }
            if (!user) {
                console.log('2');
                return done(null, false, {message: 'Incorrect username.'});
            }
            if (!isValidPassword(user, password)) {
                console.log('3');
                return done(null, false, {message: 'Incorrect password.'});
            }
            console.log('4');
            console.log(user);
            return done(null, user, {user: user.username});
        });
    }
));

router.post('/login',
    passport.authenticate('local',
        {failureRedirect: '/user/loginfail'}),
    function (req, res) {
        req.session.username = req.body.username;
        res.send(req.body.username);
    });
router.get('/loginsuccess', (req, res) => {
    res.send('Successful Log In')
});
router.get('/loginfail', (req, res) => {
    res.send(undefined)
});

passport.use('signup', new LocalStrategy({
        passReqToCallback: true
    },
    function (req, username, password, done) {
        console.log('0');
        findOrCreateUser = function () {
            Emails.findOne({'username': username}, function (err, username) {
                if (err) {
                    console.log('1');
                    console.log('User already exists');
                    return done(null, false,
                        {message: 'User already exists.'}
                    );
                } else {
                    console.log('3');
                    var newUser = new Emails();
                    newUser.username = username;
                    newUser.password = createHash(password);
                    newUser.save(function (err) {
                        if (err) {
                            console.log('4');
                            console.log('Error in Saving user: ' + err);
                            throw err;
                        }
                        console.log('User Registration successful');
                        return done(null, newUser);
                    });
                }
            });
        };
        process.nextTick(findOrCreateUser);
    })
);

router.post('/newUser',
    passport.authenticate('signup',
        {
            successRedirect: '/users/successNewUser',
            failureRedirect: '/users/failNewUser'
        }
    ),
    function (req, res) {
        console.log("test");
        res.send('Authenticated!');
    });

router.get('/successNewUser', (req, res) => {
    console.log(req.body);
    res.send('Added New User')
});

router.get('/failNewUser', (req, res) => {
    console.log('Failed New user');
});

module.exports = router;

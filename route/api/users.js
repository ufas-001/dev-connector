const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

//Load User model
const User = require('../../models/User')

// Load secret key
const keys = require('../../config/keys')

// @route GET api/users
//@desc Tests users route
router.get('/',(req, res) => res.json({message: 'Users Works'}))


// @route GET api/users/register
// @desc Register user
router.post('/register', (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        if(user){
            return res.status(400).json({email: 'email already exists'})
        } else {
            const avatar = gravatar.url(req.body.email, {
             s: '200', // Size
             r: 'pg', // Rating
             d: 'mm' // Default
            })

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err))

                })
            })
        }
    })
})

// @route GET api/users/login
// @desc Login user // Returning JWT

router.post('/login', (req,res) => {
    const email = req.body.email;
    const password = req.body.password;
     
    //Find user by email
    User.findOne({ email }).then(user => {
        //Check for user
        if(!user) {
            return res.status(404).json({email: 'User not found'});
        }

        //Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if(isMatch){
                // User found
                const payload = {id: user.id, name: user.name, avatar: user.avatar}
                jwt.sign(payload, keys.secret,{ expiresIn: 3600}, (err, token) => {
                     if(err) throw err; 
                     res.json({
                         success: true,
                         token: 'Bearer ' + token
                     })
                })
            } else {
                 res.status(404).json({password: 'Password incorrect'})
            }
        })
    })

})

// @route GET api/users/current
// @desc return current user
// @access Private

router.get('/current', passport.authenticate('jwt', { session: false}), (req, res) => {
    res.json({msg: 'success'})
})

module.exports = router

const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/User');

/**
 * @description: Register User,
 * @param: request as req,
 * @param: response as res,
 * @param: callback as next,
 * @method: POST,
 */
router.post('/register', (req, res, next) =>{
    let register = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    });
    User.addUser(register, (err, user) =>{
        if(err){
            res.json({
                success: false,
                msg: 'Failed to register user'
            });
        } else {
            res.json({
                success: true,
                msg: 'User has been registered',
                user: register
            });
        }

    });
});

/**
 * @description: Authenticate User,
 * @param: request as req,
 * @param: response as res,
 * @param: callback as next,
 * @method: POST
 */
router.post('/auth', (req, res, next) =>{
    const username = req.body.username;
    const password = req.body.password;
    try {
        User.getUserByUserName(username, (err, user) => {
            if (err) {
                throw err;
            }
            if(!user) {
                return res.json({
                    success: false,
                    msg: 'User not found'
                });
            }
            User.comparePassword(password, user.password, (err, isMatch) => {
                if(err){
                    throw err;
                } 
                if(isMatch){
                    const token = jwt.sign(user.toJSON(), config.secret, {
                        expiresIn: 604600 // 1 week
                    });
                    res.json({
                        success: true,
                        token: 'jwt ' + token,
                        user: {
                            id: user._id,
                            name: user.username,
                            username: user.username,
                            email: user.email
                        }
                    });
                } else {
                    return res.json({
                        success: false,
                        msg: 'Wrong password'
                    });
                }
            });
        });   
    } catch (error) {
        console.log(error);
    }
});
/**
 * @description: Returns Profile of Authenticated User,
 * @param: request as req,
 * @param: response as res,
 * @param: callback as next,
 * @method: GET
 */
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) =>{
    res.json({
        user: req.user
    });
});

module.exports = router;
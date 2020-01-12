const _ = require('lodash');
const { User, validate} = require('../modules/users');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


router.post('/', async (req, res) =>{
    //Validate input and throw error
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email }); // Check if user exists
    if (user) return res.status(400).send('user already registered');

    user = new User(_.pick(req.body, ['name', 'email', 'password'])); //_.pick returns object with specified properies only

    await user.save();

    res.send(_.pick(user, ['_id', 'name', 'email']));
})

module.exports = router;
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/users');
const validate = require('../middleware/validateInput');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


router.post('/', validate(validateInput), async (req, res) =>{
    let user = await User.findOne({ email: req.body.email }); // Check if user exists
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword =  await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken(); 
    res.send(token);
    
});

function validateInput(req){
    const schema ={
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().required().min(5).max(255)
    }

    return Joi.validate(req, schema);
}
module.exports = router;
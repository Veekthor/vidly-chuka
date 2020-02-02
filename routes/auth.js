const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/users');
const validate = require('../middleware/validateInput');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * path:
 *  /api/auth:
 *    post:
 *      summary: LogIn user
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                  minlength: 5
 *                  maxlength: 255
 *                  description: User's email.
 *                  required: true
 *                password:
 *                  type: string
 *                  format: password
 *                  minlength: 5
 *                  maxlength: 255
 *                  required: true
 *              example:
 *                  email: johndoe@gmail.com
 *                  password: JD1234
 *      responses:
 *        "200":
 *          description: A user schema
 *          content:
 *            text/plain:
 *              schema:
 *                type: string
 *                example:
 *                  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 */
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
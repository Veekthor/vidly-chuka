const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate: validateUserDetails} = require('../models/users');
const validate = require('../middleware/validateInput');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) =>{
    const user = await User.findById(req.user._id).select('-password -__v');
    res.send(user);
});

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users management
 */

/**
 * @swagger
 * path:
 *  /api/users:
 *    post:
 *      summary: Create/Register a new user
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        "200":
 *          description: A user schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */

router.post('/', validate(validateUserDetails), async (req, res) =>{
    let user = await User.findOne({ email: req.body.email }); // Check if user exists
    if (user) return res.status(400).send('user already registered');

    user = new User(_.pick(req.body, ['name', 'email', 'password'])); //_.pick returns object with specified properies only

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;
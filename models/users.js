const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - name
 *          - email
 *          - password
 *        properties:
 *          name:
 *            type: string
 *            minlength: 5
 *            maxlength: 50
 *            description: Name of user.
 *          email:
 *            type: string
 *            format: email
 *            minlength: 5
 *            maxlength: 255
 *            description: User's email.
 *          password:
 *            type: string
 *            format: password
 *            minlength: 5
 *            maxlength: 255
 *          isAdmin:
 *            type: boolean
 *            default: false
 *            description: Admin status of registered user.
 *        example:
 *          name: Johnny
 *          email: johndoe@gmail.com
 *          password: JD1234
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

//Add (instance) method to user schema
userSchema.methods.generateAuthToken = function(){
                                //Payload          //PrivateKey
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey')); //to create JSON webtoken 

    return token;
};
const User = mongoose.model('User', userSchema);

function validateUser(user){
    const schema ={
        name: Joi.string().required().min(5).max(50),
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().required().min(5).max(255)
    }

    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
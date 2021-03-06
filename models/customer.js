const Joi = require('joi');
const mongoose = require('mongoose');

/**
 * @swagger
 *  components:
 *    schemas:
 *      Customer:
 *        type: object
 *        required:
 *          - name
 *          - phone
 *        properties:
 *          _id:
 *            type: string
 *            description: object ID in DB(set by mongoose).
 *          name:
 *            type: string
 *            minlength: 5
 *            maxlength: 50
 *            description: Customer Name.
 *          isGold:
 *            type: boolean
 *            default: false
 *            description: Gold membership status of customer.
 *          phone:
 *            type: string
 *            minlength: 5
 *            maxlength: 50
 *            description: Phone number of customer.
 *        example:
 *          _id: 2345654cdhhw345dnchd4583c
 *          name: John Doe
 *          isGold: true
 *          phone: 12345678
 */


 /**
 * @swagger
 *  components:
 *    requestBodies:
 *      CustomerInput:
 *        required: true
 *        content:
 *          application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 minlength: 5
 *                 maxlength: 50
 *                 description: Customer Name.
 *               isGold:
 *                 type: boolean
 *                 default: false
 *                 description: Gold membership status of customer.
 *               phone:
 *                 type: string
 *                 minlength: 5
 *                 maxlength: 50
 *                 description: Phone number of customer.
 *             example:
 *               name: John Doe
 *               isGold: true
 *               phone: "12345678"
 */

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type:Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
}));

//Validate input
function validateCustomer (customer){
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(5).max(50).required()
    };
    return Joi.validate(customer, schema);
}


exports.Customer = Customer;
exports.validate = validateCustomer;
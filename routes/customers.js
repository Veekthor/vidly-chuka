const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


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

router.get('/', async (req, res)=>{
    const customer = await Customer.find().sort('name');
    res.send(customer);
});

router.get('/:id', async (req, res) =>{

    const customer = await Customer.findById(req.params.id);

    if(!customer) {
        res.status(400)
        .send('Customer with given ID does not exist');

        return;}
    res.send(customer);
})

router.post('/', async (req, res) =>{
    const { error } = validateInput(req.body, 1);
    if(error){
        res.status(400)
            .send(error.details[0].message);
    return;
    }

    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    })

    customer = await customer.save();

    res.send(customer);
});

router.put('/:id', async (req, res) =>{
    const { error } = validateInput(req.body, 0);
    if(error){
        res.status(400)
            .send(error.details[0].message);
        return;
    }
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id,{
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold
        }
        , {new: true});

        res.send(customer);
    } catch(error){
        res.status(400)
            .send("Customer with given ID not found");
    }
});

router.delete('/:id', async (req, res) => {
    try{
        const customer = await Customer.findByIdAndRemove(req.params.id);
        res.send(customer)
    } catch(error){
        res.status(400)
            .send('Customer with given ID not found');
        console.error('Error: ', error.message);
    }
});

//Validate input
function validateInput (customer){
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().min(5).max(50).required()
    };
    return Joi.validate(customer, schema);
}






module.exports = router;
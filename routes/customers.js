const validateobjectId = require('../middleware/validateobjectId');
const auth = require('../middleware/auth');
const {Customer, validate: validateCustomer} = require('../models/customer');
const validate = require('../middleware/validateInput');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const admin = require('../middleware/admin');


router.get('/', async (req, res)=>{
    const customer = await Customer.find().sort('name');
    res.send(customer);
});

router.get('/:id', validateobjectId, async (req, res) =>{
    const customer = await Customer.findById(req.params.id);

    if(!customer) {
        res.status(400)
        .send('Customer with given ID does not exist');

        return;}
    res.send(customer);
});

router.post('/', [auth, validate(validateCustomer)], async (req, res) =>{
        const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    })
     await customer.save();

    res.send(customer);
});

router.put('/:id', [auth, validateobjectId, validate(validateCustomer)], async (req, res) =>{   
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

router.delete('/:id', [auth, admin, validateobjectId], async (req, res) => {
    try{
        const customer = await Customer.findByIdAndRemove(req.params.id);
        res.send(customer)
    } catch(error){
        res.status(400)
            .send('Customer with given ID not found');
        console.error('Error: ', error.message);
    }
});

module.exports = router;
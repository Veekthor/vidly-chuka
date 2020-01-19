const auth = require('../middleware/auth');
const {Customer, validate} = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const admin = require('../middleware/admin');


router.get('/', async (req, res)=>{
    const customer = await Customer.find().sort('name');
    res.send(customer);
});

router.get('/:id', async (req, res) =>{

    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send('invalid ID');

    const customer = await Customer.findById(req.params.id);

    if(!customer) {
        res.status(400)
        .send('Customer with given ID does not exist');

        return;}
    res.send(customer);
});

router.post('/', auth, async (req, res) =>{
    const { error } = validate(req.body);
    if(error){
        res.status(400)
            .send(error.details[0].message);
    return;
    }

    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    })
     await customer.save();

    res.send(customer);
});

router.put('/:id', auth, async (req, res) =>{

    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send('invalid ID');
        
    const { error } = validate(req.body);
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

router.delete('/:id', [auth, admin], async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send('invalid ID');
        
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
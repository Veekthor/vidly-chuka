const auth = require('../middleware/auth');
const {Rental} = require('../models/rental');
const express = require('express');
const router = express.Router();


router.post('/', auth, async (req, res, next) => {
    if (!req.body.customerId) return res.status(400).send('Customer not found');
    if (!req.body.movieId) return res.status(400).send('Movie not found');
    const rental = await Rental.findOne({
        'customer._id': req.body.customerId, 
        'movie._id': req.body.movieId 
    });
    if(!rental) return res.status(404).send('No rental found');
});

module.exports = router;
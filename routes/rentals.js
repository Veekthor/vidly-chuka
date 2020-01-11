const { Rental, validate } = require('../modules/rental');
const { Customer } = require('../modules/customer');
const { Movie } = require('../modules/movies');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) =>{
    const rentals = await Rental.find().sort('-dateOut');

    res.send(rentals);
});

router.post('/', async (req, res) =>{
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Customer not found');
    
    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Movie not found');

    if (movie.numberInStock === 0) return res.status(400).send('Movie is out of stock');
    
    let rental = await new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold
        },

        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    })

    rental = await rental.save();
    
    movie.numberInStock--;
    movie.save();

    res.send(rental);
});


module.exports = router;
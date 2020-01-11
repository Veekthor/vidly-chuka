const { Rental, validate } = require('../modules/rental');
const { Customer } = require('../modules/customer');
const { Movie } = require('../modules/movies');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();


Fawn.init(mongoose)


router.get('/', async (req, res) =>{
    const rentals = await Rental.find().sort('-dateOut');

    res.send(rentals);
});

router.post('/', async (req, res) =>{

    //Validate input and throw error
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Check for customer in DB using customerId and send error 
    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Customer not found');
    
    //Check for movie in DB using movieId and send error 
    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Movie not found');
    // Check if movie is still available
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
    // Fawn task for atomicity of transaction
    try{
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: {numberInStock: -1}
            }).run();

    res.send(rental);
    }
    catch(ex){
        res.status(500).send('Something failed');
    }
    
});


module.exports = router;
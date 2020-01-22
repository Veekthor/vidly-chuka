const moment = require('moment');
const auth = require('../middleware/auth');
const {Rental} = require('../models/rental');
const { Movie } = require('../models/movies');
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
    
    if(rental.dateReturned) return res.status(400).send('rental already processed');

    rental.dateReturned = new Date();
    const diffDays = moment().diff(rental.dateOut, 'days'); //calculate the days difference
    rental.rentalFee = diffDays * rental.movie.dailyRentalRate;
    await rental.save();
    await Movie.update({_id: req.body.movieId},{
        $inc: {numberInStock: 1}
    });


    
    res.status(200).send(rental);
});

module.exports = router;
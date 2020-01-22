const Joi = require('joi')
const moment = require('moment');
const auth = require('../middleware/auth');
const validate = require('../middleware/validateInput');
const {Rental} = require('../models/rental');
const { Movie } = require('../models/movies');
const express = require('express');
const router = express.Router();



router.post('/', [auth, validate(validateReturn)], async (req, res, next) => {
     
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

function validateReturn(req){
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;
const Joi = require('joi')
const auth = require('../middleware/auth');
const validate = require('../middleware/validateInput');
const {Rental} = require('../models/rental');
const { Movie } = require('../models/movies');
const express = require('express');
const router = express.Router();


/**
 * @swagger
 * path:
 *  /api/returns:
 *    post:
 *      summary: Create Return entry for rental
 *      tags: [Rentals]
 *      security: 
 *        - JWTAuth: []
 *      requestBody:
 *        $ref: '#/components/requestBodies/RentalInput'
 *      responses:
 *        "200":
 *          description: Return entry details
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Rental'
 */

router.post('/', [auth, validate(validateReturn)], async (req, res, next) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
    
    if(!rental) return res.status(404).send('No rental found');
    
    if(rental.dateReturned) return res.status(400).send('rental already processed');

    rental.return();
    await rental.save();

    await Movie.update({_id: req.body.movieId},{
        $inc: {numberInStock: 1}
    });


    
    res.send(rental);
});

function validateReturn(req){
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;
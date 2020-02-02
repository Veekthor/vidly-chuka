const Joi = require('joi')
const auth = require('../middleware/auth');
const validate = require('../middleware/validateInput');
const {Rental} = require('../models/rental');
const Fawn = require('fawn');
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
    try{
        new Fawn.Task()
                .update('rentals',{_id: rental._id}, {
                    dateReturned: rental.dateReturned,
                    rentalFee: rental.rentalFee
                })
                .update('movies', {_id: rental.movie._id},{
                    $inc: {numberInStock: 1}
                }).run();
        
        res.send(rental);
    } catch(ex){
        res.status(500).send('Something failed');
        throw ex;
    }
});

function validateReturn(req){
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;
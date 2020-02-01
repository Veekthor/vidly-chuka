const auth = require('../middleware/auth');
const { Rental, validate: validateRentalOrder } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movies');
const validate = require ('../middleware/validateInput');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Rentals
 *   description: Rentals management
 */

/**
 * @swagger
 * path:
 *  /api/rentals:
 *    get:
 *      summary: Get all rentals
 *      tags: [Rentals]
 *      responses:
 *        "200":
 *          description: An array of users
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Rental'
 */

Fawn.init(mongoose)


router.get('/', async (req, res) =>{
    const rentals = await Rental.find().sort('-dateOut');

    res.send(rentals);
});

/**
 * @swagger
 * path:
 *  /api/rentals:
 *    post:
 *      summary: Create Rental entry
 *      tags: [Rentals]
 *      security: 
 *        - JWTAuth: []
 *      requestBody:
 *        $ref: '#/components/requestBodies/RentalInput'
 *      responses:
 *        "200":
 *          description: returns created rental entry
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Rental'
 */
router.post('/', [auth, validate(validateRentalOrder)], async (req, res) =>{
    //Check for customer in DB using customerId and send error 
    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Customer not found');
    
    //Check for movie in DB using movieId and send error 
    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Movie not found');
    // Check if movie is still available
    if (movie.numberInStock === 0) return res.status(400).send('Movie is out of stock');
    
    const rental = await new Rental({
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
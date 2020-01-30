const validateobjectId = require('../middleware/validateobjectId');
const auth = require('../middleware/auth');
const {Movie, validate: validateMovie} = require('../models/movies');
const { Genre } = require('../models/genres');
const admin = require('../middleware/admin');
const validate = require('../middleware/validateInput');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movies management
 */

/**
 * @swagger
 * path:
 *  /api/movies:
 *    get:
 *      summary: Get all movies
 *      tags: [Movies]
 *      responses:
 *        "200":
 *          description: An array of users
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Movie'
 */
//Get
router.get('/', async (req, res) =>{
    const movies = await Movie.find()
                        .sort('title');
    res.send(movies);
});

//Get ID
router.get('/:id', validateobjectId, async (req, res) =>{        
    const movie = await Movie.findById(req.params.id);
    if (!movie){
        res.status(400)
            .send('Movie with given ID not found');
        return;
    }
    res.send(movie);
});

//POST
router.post('/', [auth, validate(validateMovie)], async (req, res) =>{
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre');

    const movie = new Movie({
        title: req.body.title,
        genre: new Genre({
            _id: genre._id,
            name: genre.name
        }),
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })

    await movie.save();

    res.send(movie);
});



//PUT
router.put('/:id', [auth, validateobjectId, validate(validateMovie)], async (req, res) =>{
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre');

    const movie = await Movie.findByIdAndUpdate(req.params.id,{
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
    }, {new: true});

    if (!movie){
        res.status(400)
            .send('Movie with given ID not found');
        return;
    }
    res.send(movie);
});



//Delete
router.delete('/:id', [auth, admin, validateobjectId], async (req, res) =>{ 
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie){
        res.status(400)
            .send('Course with given ID not found');
        return;
    }
    res.send(movie); 
});

module.exports = router;
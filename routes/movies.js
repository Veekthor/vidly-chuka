const auth = require('../middleware/auth');
const {Movie, validate} = require('../modules/movies');
const { Genre } = require('../modules/genres');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');



//Get
router.get('/', async (req, res) =>{
    const movies = await Movie.find()
                        .sort('title');
    res.send(movies);
});

//Get ID
router.get('/:id', async (req, res) =>{
    const movie = await Movie.findById(req.params.id);
    if (!movie){
        res.status(400)
            .send('Movie with given ID not found');
        return;
    }
    res.send(movie);
});

//POST
router.post('/', auth, async (req, res) =>{
    const { error } = validate(req.body);

    if (error) {
        res.status(400)
            .send(error.details[0].message);
        return;
    }

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
router.put('/:id', auth, async (req, res) =>{
    const { error } = validate(req.body);

    if (error) {
        res.status(400)
            .send(error.details[0].message);
        return;
    }
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
router.delete('/:id', [auth, admin], async (req, res) =>{
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie){
        res.status(400)
            .send('Course with given ID not found');
        return;
    }
    res.send(movie); 
});

module.exports = router;
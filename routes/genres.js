const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Genre, validate} = require('../models/genres');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res, next) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.post('/', auth, async (req, res) =>{

    const { error } = validate(req.body);

    if (error){
        res.status(400)
            .send(error.details[0].message);
        return;
    }

    const genre =  new Genre({
        name: req.body.name
    });

    await genre.save();

    res.send(genre);
});

//put operation
router.put('/:id', auth, async (req, res) =>{
    const { error } = validate(req.body);
    //Send bad request
    if (error){
        res.status(400)
            .send(error.details[0].message);
        return;
    }

    const genre = await Genre.findByIdAndUpdate(req.params.id,{
       $set: {
            name: req.body.name
       }
    }, {new: true});
    
    if (!genre){
        res.status(404)
            .send('Genre does not exist');
        return;
    }
    
    res.send(genre);
});

//delete operation
router.delete('/:id', [auth, admin], async (req, res) =>{
   const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre){
        res.status(404)
            .send('Genre does not exist');
        return;
    }
    res.send(genre);
});

router.get('/:id',async (req, res) =>{
    const genre = await Genre.findById(req.params.id);
    if (!genre){
        res.status(404)
            .send('Genre does not exist');
    } else {res.send(genre)}
});

module.exports = router;
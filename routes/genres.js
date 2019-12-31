const express = require('express');
const router = express.Router();

// genres array
const genres = [
    {id: 1, name: "Action"},
    {id: 2, name: "Horror"},
    {id: 3, name: "Romance"}
];

router.get('/', (req, res) => {
    res.send(genres);
});

router.post('/', (req, res) =>{

    const { error } = validateGenre(req.body);

    if (error){
        res.status(400)
            .send(error.details[0].message);
        return;
    }

    const genre = {
        id : genres.length + 1,
        name: req.body.name
    };

    genres.push(genre);
    res.send(genre);
});

//put operation
router.put('/:id', (req, res) =>{
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    
    if (!genre){
        res.status(404)
            .send('Genre does not exist');
        return;
    }
    
    const { error } = validateGenre(req.body);
    //Send bad request
    if (error){
        res.status(400)
            .send(error.details[0].message);
        return;
    }    

    genre.name = req.body.name;

    res.send(genre);
});

//delete operation
router.delete('/:id', (req, res) =>{
    const genre = genres.find(g => g.id === parseInt(req.params.id));

    if (!genre){
        res.status(404)
            .send('Genre does not exist');
        return;
    }

    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    res.send(genre);
});

//Validate input
function validateGenre (genre){
    const schema = {
        name: Joi.string().required()
    };

    return Joi.validate(genre, schema);
}

router.get('/:id', (req, res) =>{
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre){
        res.status(404)
            .send('Genre does not exist');
    } else {res.send(genre)}
});

module.exports = router;
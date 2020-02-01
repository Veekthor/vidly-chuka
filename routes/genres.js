const validateobjectId = require('../middleware/validateobjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Genre, validate: validateGenre} = require('../models/genres');
const validate = require('../middleware/validateInput');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Genres
 *   description: Genres management
 */

/**
 * @swagger
 * path:
 *  /api/genres:
 *    get:
 *      summary: Get all genres
 *      tags: [Genres]
 *      responses:
 *        "200":
 *          description: An array of users
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Genre'
 */
router.get('/', async (req, res, next) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

/**
 * @swagger
 * path:
 *  /api/genres:
 *    post:
 *      summary: Create new genre
 *      tags: [Genres]
 *      security: 
 *        - JWTAuth: []
 *      requestBody:
 *        $ref: '#/components/requestBodies/GenreInput'
 *      responses:
 *        "200":
 *          description: Created genre details
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Genre'
 */
router.post('/', [auth, validate(validateGenre)], async (req, res) =>{
    const genre =  new Genre({
        name: req.body.name
    });

    await genre.save();

    res.send(genre);
});

/**
 * @swagger
 * path:
 *  /api/genres/{genreId}:
 *    put:
 *      summary: Update genre
 *      tags: [Genres]
 *      parameters:
 *        - in: path
 *          name: genreId
 *          schema:
 *              type: string
 *          required: true
 *          description: Genre ID
 *      security: 
 *        - JWTAuth: []
 *      requestBody:
 *        $ref: '#/components/requestBodies/GenreInput'
 *      responses:
 *        "200":
 *          description: Created genre details
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Genre'
 */
//put operation
router.put('/:id', [auth, validateobjectId, validate(validateGenre)], async (req, res) =>{
    const genre = await Genre.findByIdAndUpdate(req.params.id,{
       $set: {
            name: req.body.name
       }
    }, {new: true});
    
    if (!genre) return res.status(404).send('Genre does not exist');
    
    res.send(genre);
});

/**
 * @swagger
 * path:
 *  /api/genres/{genreId}:
 *    delete:
 *      summary: Update genre
 *      tags: [Genres]
 *      parameters:
 *        - in: path
 *          name: genreId
 *          schema:
 *              type: string
 *          required: true
 *          description: Genre ID
 *      security: 
 *        - JWTAuth: []
 *      responses:
 *        "200":
 *          description: Created genre details
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Genre'
 */
//delete operation
router.delete('/:id', [auth, admin, validateobjectId], async (req, res) =>{

   const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre) return res.status(404).send('Genre does not exist');
    res.send(genre);
});

/**
 * @swagger
 * path:
 *  /api/genres/{genreId}:
 *    get:
 *      summary: Get genre
 *      tags: [Genres]
 *      parameters:
 *        - in: path
 *          name: genreId
 *          schema:
 *              type: string
 *          required: true
 *          description: Genre ID
 *      responses:
 *        "200":
 *          description: An array of genres
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Genre'
 */
router.get('/:id', validateobjectId, async (req, res) =>{
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('Genre does not exist');
    
    res.send(genre)
});

module.exports = router;
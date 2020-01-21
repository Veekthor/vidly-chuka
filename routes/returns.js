const auth = require('../middleware/auth')
const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res, next) => {
    if (!req.body.customerId) return res.status(400).send('Customer not found');
    if (!req.body.movieId) return res.status(400).send('Movie not found')
});

module.exports = router;
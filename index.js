const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const express = require('express');
const app = express();

//connect to Mongo DB
mongoose.connect('mongodb://localhost/vidly')
            .then(()=> console.log('Connected to MongoDB ....'))
                .catch((err) => console.log('Error', err));


//middle ware
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);

app.get('/', (req, res) => {
    res.send("Hello world");
});

const port = process.env.PORT || 3000;
app.listen(port, () =>{console.log(`Listening on port ${port}...`)});
const request = require('supertest');
const { Rental } = require('../../../models/rental');
const { User } = require('../../../models/users');
const { Movie } = require('../../../models/movies');
const mongoose = require('mongoose');
const moment = require('moment');

describe('/api/returns', () => {
    let server,
    customerId,
    movieId,
    rental,
    token,
    movie;

    //Happy path
    const exec = () =>{
        return request(server)
                            .post('/api/returns')
                            .set('x-auth-token', token)
                            .send({ customerId, movieId });
    }
    beforeEach( async () => {
        server = require('../../../index');
        
        token = new User().generateAuthToken();
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId(); 

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });

        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: {name: '12345'},
            numberInStock: 10
        });
        
        await movie.save();
        await rental.save();
    });
    afterEach( async () => { 
        await server.close();
        await Rental.remove({}); // cleans up DB after test
        await Movie.remove({});
    });

    it('should return 401 if user is not logged in', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if user is logged in and customerId is not provided', async () => {
        customerId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if user is logged in and movieId is not provided', async () => {
        movieId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental found with customerId/movieId', async () => {
        await Rental.remove({});

        const res = await exec();
        
        expect(res.status).toBe(404);
    });

    it('should return 400 if rental is already processed', async () => {
        rental.dateReturned = new Date();

        await rental.save();

        const res = await exec();
        
        expect(res.status).toBe(400);
    });

    it('should set movie returned date if input is valid', async () => {
        const res = await exec();
        
        const rentalInDB = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDB.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);
    });

    it('should set rentalFee if input is valid', async () => {
        //Set date out to 7 days before
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        const res = await exec();
        
        const rentalInDB = await Rental.findById(rental._id);
        
        expect(rentalInDB.rentalFee).toBe(14);
    });

    it('should increase movie stock', async () => {
        
        const res = await exec();
        
        const movieInDB = await Movie.findById(movie._id);
        
        expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return the rental if inout is valid', async () => {
        
        const res = await exec();
        
        const rentalInDB = await Rental.findById(rental._id);

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie']
            ));
    });
});
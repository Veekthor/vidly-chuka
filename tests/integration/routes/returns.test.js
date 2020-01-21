const request = require('supertest');
const { Rental } = require('../../../models/rental');
const { User } = require('../../../models/users');
const mongoose = require('mongoose');

describe('/api/returns', () => {
    let server,
    customerId,
    movieId,
    rental,
    token;

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
        await rental.save();
    });
    afterEach( async () => { 
       await server.close();
        await Rental.remove({}); // cleans up DB after test
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

    // it('should return 404 if no rental found with customerId/movieId', async () => {
    //     customerId = mongoose.Types.ObjectId();
    //     movieId = mongoose.Types.ObjectId(); 

    //     const res = await exec();
    //     expect(res.status).toBe(404);
    // });
});
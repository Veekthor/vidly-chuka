const request = require('supertest');
const { Rental } = require('../../../models/rental');
const { User } = require('../../../models/users');
const mongoose = require('mongoose');
require('jest');

describe('/api/returns', () => {
    let server,
    customerId,
    movieId,
    rental;
    beforeEach( async () => {
        server = require('../../../index');
        
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
       await server.close()
        await Rental.remove({}); // cleans up DB after test
    });

    it('should return 401 if user is not logged in', async () => {
        const res = await request(server)
                            .post('/api/returns')
                            .send({customerId, movieId});
        expect(res.status).toBe(401);
    });

    it('should return 400 if user is logged in and customerId is not provided', async () => {
        const token = new User().generateAuthToken();
        const res = await request(server)
                            .post('/api/returns')
                            .set('x-auth-token', token)
                            .send({ movieId });
        expect(res.status).toBe(400);
    });

    it('should return 400 if user is logged in and movieId is not provided', async () => {
        const token = new User().generateAuthToken();
        const res = await request(server)
                            .post('/api/returns')
                            .set('x-auth-token', token)
                            .send({ customerId });
        expect(res.status).toBe(400);
    });
});
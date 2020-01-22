const { User } = require('../../../models/users');
const request = require('supertest');
const mongoose = require('mongoose');

describe('/api/rentals', () => {
    let server
    beforeEach(() => {
        server = require('../../../index');
    });

    afterEach( async () => {
        await server.close();
    });
    describe('POST /', () => {
        it('should return 400 if customerId is invalid', async () => {
            const token = new User().generateAuthToken();
            const movieId = mongoose.Types.ObjectId();
            const res = await request(server).post('/api/rentals')
            .set('x-auth-token', token)
            .send({
                customerId: '1',
                movieId
            });

            expect(res.status).toBe(400);
        });
    });
});
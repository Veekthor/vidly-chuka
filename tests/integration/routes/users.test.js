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
        it('should return 400 if name is more than 50 characters', async () => {
            const token = new User().generateAuthToken();
            const name = new Array(52).join('a');
            const res = await request(server).post('/api/users')
            .set('x-auth-token', token)
            .send({
                name,
                email: '1234@gmail.com'
            });

            expect(res.status).toBe(400);
        });
    });
});
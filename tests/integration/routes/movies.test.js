const { User } = require('../../../models/users');
const request = require('supertest');

describe('/api/movies', () => {
    let server
    beforeEach(() => {
        server = require('../../../index');
    });

    afterEach( async () => {
        await server.close();
    });
    describe('POST /', () => {
        it('should return 400 if genreId is invalid', async () => {
            const token = new User().generateAuthToken();
            const res = await request(server).post('/api/customers')
            .set('x-auth-token', token)
            .send({
                title: '12345',
                genre: '1',
                numberInStock: 1,
                dailyRentalRate: 2
            });

            expect(res.status).toBe(400);
        });
    });
});